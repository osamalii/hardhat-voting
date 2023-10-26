// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract  Voting is Ownable(msg.sender) {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    
    struct Proposal {
        string description;
        uint256 voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
	    ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
       	VotingSessionStarted,
	    VotingSessionEnded,
	    VotesTallied
    }

    struct Session {
        WorkflowStatus status;
        bool isPublicProposal;
        Proposal[] lesProposition;
    }

    Proposal newPorosal;
    Voter currentVote = Voter(false, false, 0);
    Voting.Session currentSession;
    Proposal winner;
    mapping (address => Voter) public whitelist;
    
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    
    modifier isWhiteList {
        require( whitelist[msg.sender].isRegistered ,"is not whitelisted");
        _;
    }

    function addVoter(address _address) public onlyOwner() {
        require(!whitelist[_address].isRegistered);
        whitelist[_address] = Voter(true,false,0);
        emit WorkflowStatusChange(currentSession.status, WorkflowStatus.RegisteringVoters);
        currentSession.status = WorkflowStatus.RegisteringVoters;

    }

    function startSession(bool _publicProposal) public onlyOwner {
        whitelist[owner()].isRegistered = true;
        emit WorkflowStatusChange(currentSession.status, WorkflowStatus.ProposalsRegistrationStarted);
        currentSession.status = WorkflowStatus.ProposalsRegistrationStarted;
        currentSession.isPublicProposal = _publicProposal;
    }

    function closeProposition() public onlyOwner {
        require(currentSession.status == WorkflowStatus.ProposalsRegistrationStarted, "Session need be in register status before");
        emit WorkflowStatusChange(currentSession.status, WorkflowStatus.ProposalsRegistrationEnded);
        currentSession.status = WorkflowStatus.ProposalsRegistrationEnded;
    }
    function openVote() public onlyOwner  {
        require(currentSession.status == WorkflowStatus.ProposalsRegistrationEnded,"Session need be in closeregister status before");
        emit WorkflowStatusChange(currentSession.status, WorkflowStatus.VotingSessionStarted);     
        currentSession.status = WorkflowStatus.VotingSessionStarted;
    }
    function closeVote() public onlyOwner  {
        require(currentSession.status == WorkflowStatus.VotingSessionStarted,"Session need be in vote status before");
        emit WorkflowStatusChange(currentSession.status, WorkflowStatus.VotingSessionEnded);
        currentSession.status = WorkflowStatus.VotingSessionEnded;
    }

    function setVote(uint _ProposalId) isWhiteList public{
        require(currentSession.status == WorkflowStatus.VotingSessionStarted && !currentVote.hasVoted);
        currentSession.lesProposition[_ProposalId].voteCount += 1;
        currentVote.hasVoted = true;
        emit Voted(msg.sender, _ProposalId)
        
    }
    function proposer(string calldata _description ) isWhiteList public {
        if(currentSession.isPublicProposal || owner() == msg.sender){
            require(
                currentSession.status == WorkflowStatus.ProposalsRegistrationStarted
            );
            newPorosal = Proposal(_description, 0);
            currentSession.lesProposition.push(newPorosal);
            emit ProposalRegistered(currentSession.lesProposition.length - 1);
        }
    }

    function contabiliserVote() public onlyOwner {
        uint i=1;
        uint max =currentSession.lesProposition[0].voteCount;
        winner=currentSession.lesProposition[0];
        for (i; i < currentSession.lesProposition.length ; i++) {
           if(max > currentSession.lesProposition[i].voteCount){
                max=currentSession.lesProposition[i].voteCount;
                winner=currentSession.lesProposition[i];
           }
        }
        
    }
     function getSession() public view returns (Voting.Session memory){
        return currentSession;
    }
    function getWinner() public view  returns(Proposal memory){
        return winner;
    }
}