// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomOwnable is Ownable {
    constructor() Ownable(msg.sender) {
        // The constructor for CustomOwnable sets the initial owner to msg.sender.
    }
}
contract Voting is CustomOwnable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        uint proposalId;
        string description;
        uint256 voteCount;
        address proposerPar;
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
        Proposal winner;
        bool isValid;
        mapping(address => Voter) whitelist;
        mapping(address => bool) blacklist;
    }

    Session[] public lesSession;
    uint public sessionIndex;

    event VoterRegistered(address voterAddress);
    event VoterUnRegistered(address voterAddress);
    event VoterBlacklisted(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    modifier valid(uint index) {
        require(index < lesSession.length, "Session index out of bounds");
        require(lesSession[index].isValid, "No session, already set");
        _;
    }

    modifier isAuthorized() {
        require(
            (lesSession[sessionIndex].whitelist[msg.sender].isRegistered &&
            !lesSession[sessionIndex].blacklist[msg.sender]) || (owner() == msg.sender),
            "Not whitelisted or blacklisted"
        );
        _;
    }

    modifier canPropose() {
        require(
            lesSession[sessionIndex].isPublicProposal || owner() == msg.sender,
            "Cannot propose in this session"
        );
        _;
    }

    constructor() {
       // restart(true); // Start the initial session with public proposals.
    }
    
function startSession(bool _publicProposal) public onlyOwner payable   {
    restart(_publicProposal);
   }

    function getSessionStatus() public view returns (WorkflowStatus) {
        return lesSession[sessionIndex].status;
    }

    function restart(bool _publicProposal)  private {
        //Proposal[] storage newlesPropositions;
        sessionIndex = lesSession.length;
        lesSession.push();
        Session storage currentSession = lesSession[sessionIndex];
        currentSession.status = WorkflowStatus.RegisteringVoters;
        currentSession.isPublicProposal = _publicProposal;
       // currentSession.lesProposition = newlesPropositions;
        currentSession.isValid = true;
        currentSession.whitelist[msg.sender] = Voter(true, false, 0);
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.RegisteringVoters);

        
    }

    function openProposalRegistration() public onlyOwner {
        require(lesSession[sessionIndex].status == WorkflowStatus.ProposalsRegistrationStarted, "The status is not ProposalsRegistrationStarted");
    
        emit WorkflowStatusChange(lesSession[sessionIndex].status, WorkflowStatus.ProposalsRegistrationStarted);
        lesSession[sessionIndex].status = WorkflowStatus.ProposalsRegistrationStarted;
    }


    function addVoter(address _address) public onlyOwner {
        require(!lesSession[sessionIndex].whitelist[_address].isRegistered);
        lesSession[sessionIndex].whitelist[_address] = Voter(true, false, 0);
        emit VoterRegistered(_address);
    }

    function removeVoter(address _address) public onlyOwner {
        require(lesSession[sessionIndex].whitelist[_address].isRegistered);
        lesSession[sessionIndex].whitelist[_address] = Voter(false, false, 0);
        emit VoterUnRegistered(_address);
    }

    function blacklistVoter(address _address) public onlyOwner() {
        lesSession[sessionIndex].whitelist[_address].isRegistered = false;
        lesSession[sessionIndex].blacklist[_address] = true;
        emit VoterBlacklisted(_address);
    }

    function closeRegisteringVoters() public onlyOwner {
        emit WorkflowStatusChange(lesSession[sessionIndex].status, WorkflowStatus.ProposalsRegistrationStarted);
        lesSession[sessionIndex].status = WorkflowStatus.ProposalsRegistrationStarted;
    }

    function addProposal(string calldata _description) isAuthorized() canPropose public returns(WorkflowStatus,bool,WorkflowStatus){
        require(lesSession[sessionIndex].status == WorkflowStatus.ProposalsRegistrationStarted, "The status is  ProposalsRegistrationStarted");
        uint lenPropositions = lesSession[sessionIndex].lesProposition.length;
        Proposal memory newProposal = Proposal(lenPropositions + 1, _description, 0, msg.sender);
        lesSession[sessionIndex].lesProposition.push(newProposal);
        emit ProposalRegistered(lesSession[sessionIndex].lesProposition.length - 1);
         return (lesSession[sessionIndex].status, lesSession[sessionIndex].status == WorkflowStatus.ProposalsRegistrationStarted,WorkflowStatus.ProposalsRegistrationStarted);
    }

    function closeProposal() public onlyOwner {
        require(lesSession[sessionIndex].status == WorkflowStatus.ProposalsRegistrationStarted,"status not ProposalsRegistrationStarted");
        uint lenPropositions = lesSession[sessionIndex].lesProposition.length;
        Proposal memory newProposal = Proposal(lenPropositions + 1, "Vote Blanc", 0, msg.sender);
        lesSession[sessionIndex].lesProposition.push(newProposal);
        emit WorkflowStatusChange(lesSession[sessionIndex].status, WorkflowStatus.ProposalsRegistrationEnded);
        lesSession[sessionIndex].status = WorkflowStatus.ProposalsRegistrationEnded;
    }

    function openVote() public onlyOwner {
        require(lesSession[sessionIndex].status == WorkflowStatus.ProposalsRegistrationEnded, "The status is not ProposalsRegistrationEnded");
        emit WorkflowStatusChange(lesSession[sessionIndex].status, WorkflowStatus.VotingSessionStarted);
        lesSession[sessionIndex].status = WorkflowStatus.VotingSessionStarted;
    }

    function addVote(uint _proposalId) isAuthorized() public {
        require(!lesSession[sessionIndex].whitelist[msg.sender].hasVoted && lesSession[sessionIndex].status == WorkflowStatus.VotingSessionStarted);
        require(_proposalId > 0 && _proposalId <= lesSession[sessionIndex].lesProposition.length, "Invalid proposal ID");
        lesSession[sessionIndex].lesProposition[_proposalId - 1].voteCount += 1;
        lesSession[sessionIndex].whitelist[msg.sender].hasVoted = true;
        lesSession[sessionIndex].whitelist[msg.sender].votedProposalId = _proposalId;
        emit Voted(msg.sender, _proposalId);
    }

    function closeVote() public onlyOwner {
        require(lesSession[sessionIndex].status == WorkflowStatus.VotingSessionStarted, "The status is not valid");
        emit WorkflowStatusChange(lesSession[sessionIndex].status, WorkflowStatus.VotingSessionEnded);
        lesSession[sessionIndex].status = WorkflowStatus.VotingSessionEnded;
    }

    function countVotes() public onlyOwner {
        require(lesSession[sessionIndex].status == WorkflowStatus.VotingSessionEnded, "The status is not valid");
        uint max = lesSession[sessionIndex].lesProposition[0].voteCount;
        Proposal storage winner = lesSession[sessionIndex].lesProposition[0];
        for (uint i = 1; i < lesSession[sessionIndex].lesProposition.length; i++) {
            if (max < lesSession[sessionIndex].lesProposition[i].voteCount) {
                max = lesSession[sessionIndex].lesProposition[i].voteCount;
                winner = lesSession[sessionIndex].lesProposition[i];
            }
        }
        lesSession[sessionIndex].winner = winner;
        emit WorkflowStatusChange(lesSession[sessionIndex].status, WorkflowStatus.VotesTallied);
        lesSession[sessionIndex].status = WorkflowStatus.VotesTallied;
    }

    function getSessionProposal() public view returns (Proposal[] memory) {
        return lesSession[sessionIndex].lesProposition;
    }

    function getWinner() public view returns (Proposal memory) {
        return lesSession[sessionIndex].winner;
    }

    function getIndexSession() public view returns (uint) {
        return sessionIndex;
    }

    struct SessionFormat {
        WorkflowStatus status;
        bool isPublicProposal;
        Proposal[] lesProposition;
        Proposal winner;
    }

    function getSession(uint index) public view valid(index) returns (SessionFormat memory) {
        return SessionFormat(lesSession[index].status, lesSession[index].isPublicProposal, lesSession[index].lesProposition, lesSession[index].winner);
    }

    function getCurrentSession() public view returns (SessionFormat memory) {
        return SessionFormat(lesSession[sessionIndex].status, lesSession[sessionIndex].isPublicProposal, lesSession[sessionIndex].lesProposition, lesSession[sessionIndex].winner);
    }

    function getCurrentStatus(uint Index) public view returns (WorkflowStatus) {
        require(Index < lesSession.length, "Session index out of bounds");
        return lesSession[Index].status;
    }
}
