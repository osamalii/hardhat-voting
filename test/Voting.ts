import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract, ContractFactory } from "ethers";
import { Voting } from '../typechain-types/contracts'; // Import the contract interface

describe("Voting Contract", function () {
  let votingContract: Voting;
  let admin: Signer;
  let user1: Signer;
  let user2: Signer;

  before(async function () {
    [admin, user1, user2] = await ethers.getSigners();

    const VotingFactory: ContractFactory = await ethers.getContractFactory("Voting");
    votingContract = (await VotingFactory.deploy()) as Voting;
    await votingContract.deployed();
  });

  it("Should add a voter to the whitelist", async function () {
    // Use the 'admin' signer to add a voter to the whitelist
    await votingContract.addVoter(await user1.getAddress());
    const isVoter = await votingContract.isVoter(await user1.getAddress());
    expect(isVoter).to.be.true;
  });

  it("Should open proposal registration and allow users to add proposals", async function () {
    // Use the 'admin' signer to open proposal registration
    await votingContract.openProposalRegistration();
    
    // Use 'user1' to add a proposal
    await votingContract.addProposal("Proposal 1", { from: await user1.getAddress() });

    // Use 'user2' to add another proposal
    await votingContract.addProposal("Proposal 2", { from: await user2.getAddress() });

    // Verify that there are two proposals
    const proposalCount = await votingContract.getProposalCount();
    expect(proposalCount).to.equal(2);
  });

  it("Should not allow users to add proposals after proposal registration is closed", async function () {
    // Use the 'admin' signer to close proposal registration
    await votingContract.closeProposalRegistration();

    // Attempt to add a proposal using 'user2' (expect to fail)
    await expect(votingContract.addProposal("Proposal 3", { from: await user2.getAddress() })).to.be.revertedWith("Proposal registration is closed");
  });

  it("Should allow users to vote once in the voting session", async function () {
    // Use 'user1' to vote for 'Proposal 1'
    await votingContract.vote(0, { from: await user1.getAddress() });

    // Verify that 'user1' has voted
    const user1HasVoted = await votingContract.hasVoted(await user1.getAddress());
    expect(user1HasVoted).to.be.true;

    // Attempt to vote again using 'user1' (expect to fail)
    await expect(votingContract.vote(1, { from: await user1.getAddress() })).to.be.revertedWith("Already voted");
  });

  it("Should not allow non-voters to vote", async function () {
    // Use 'user2' to vote (expect to fail because 'user2' is not on the whitelist)
    await expect(votingContract.vote(1, { from: await user2.getAddress() })).to.be.revertedWith("Not a registered voter");
  });

  it("Should close the voting session and count votes", async function () {
    // Use the 'admin' signer to close the voting session
    await votingContract.closeVotingSession();

    // Use the 'admin' signer to count votes and get the winning proposal index
    await votingContract.countVotes();
    const winningProposalIndex = await votingContract.getWinningProposal();

    // Verify that the winning proposal is 'Proposal 1'
    expect(winningProposalIndex).to.equal(0);
  });

  it("Should not allow users to vote after the voting session is closed", async function () {
    // Attempt to vote using 'user2' (expect to fail)
    await expect(votingContract.vote(1, { from: await user2.getAddress() })).to.be.revertedWith("Voting session is closed");
  });

  it("Should open a new voting session", async function () {
    // Use the 'admin' signer to open a new voting session
    await votingContract.openVotingSession();
    const votingSessionOpen = await votingContract.isVotingSessionOpen();
    expect(votingSessionOpen).to.be.true;
  });
});
