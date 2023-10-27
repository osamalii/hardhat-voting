import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract, ContractFactory } from "ethers";
import { Voting } from '../typechain-types/contracts'; // Import the contract interface

describe("Voting Contract", function () {
  let owner: Signer;
  let voter1: Signer;
  let votingContract: Voting;
  let votingContractFactory: ContractFactory;

  before(async function () {
    [owner, voter1] = await ethers.getSigners();

    votingContractFactory = await ethers.getContractFactory("Voting");
    votingContract = await votingContractFactory.deploy();
    await votingContract.deployed();
  });

  it("Should add a voter to the whitelist", async function () {
    await votingContract.connect(owner).addVoter(voter1.getAddress());
    expect(await votingContract.whitelist(voter1.getAddress())).to.be.true;
  });

  it("Should start a session", async function () {
    await votingContract.connect(owner).startSession(true);
    expect(await votingContract.getSession()).to.equal(1); // Adjust the expected value
  });

  it("Should close proposition session", async function () {
    await votingContract.connect(owner).closeProposition();
    expect(await votingContract.getSession()).to.equal(2); // Adjust the expected value
  });

  it("Should open the vote session", async function () {
    await votingContract.connect(owner).openVote();
    expect(await votingContract.getSession()).to.equal(3); // Adjust the expected value
  });

  it("Should close the vote session", async function () {
    await votingContract.connect(owner).closeVote();
    expect(await votingContract.getSession()).to.equal(4); // Adjust the expected value
  });

  it("Should allow a registered voter to vote", async function () {
    await votingContract.connect(voter1).setVote(0);
    const voter = await votingContract.whitelist(await voter1.getAddress());
    expect(voter.hasVoted).to.be.true;
  });

  it("Should not allow a voter to vote twice", async function () {
    await expect(votingContract.connect(voter1).setVote(1)).to.be.reverted;
  });

  it("Should allow a registered voter to propose a new proposal", async function () {
    await votingContract.connect(voter1).proposer("New Proposal");
    expect(await votingContract.currentSession.lesProposition.length).to.equal(1);
  });

  it("Should not allow a non-registered voter to propose", async function () {
    await expect(votingContract.connect(owner).proposer("New Proposal")).to.be.reverted;
  });

  it("Should calculate and announce the winner", async function () {
    await votingContract.connect(owner).contabiliserVote();
    const winner = await votingContract.getWinner();
    expect(winner.description).to.equal("The Winning Proposal"); // Adjust the expected value
  });
});
