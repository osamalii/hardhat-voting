// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
 struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
/*contract MappingVote{
        mapping (address=>Voter) public whitelist;
        mapping (address=>bool) public blacklist;
        function getwhitelist(address _address) public view returns(Voter memory )  {
            return whitelist[_address];
        }
        function setwhitelist(address _address,Voter memory _vote) public  {
            whitelist[_address]=_vote;
        }

        function getblacklist(address _address) public view returns(bool)  {
            return blacklist[_address];
        }
        
        function setblacklist(address _address,bool _is) public  {
            blacklist[_address]=_is;
        }

}*/

contract  Voting is Ownable(msg.sender) {

   
    
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
        //MappingVote whitelistAndBlacklist;
        mapping (address =>Voter)whitelist;
        mapping (address =>bool) blacklist;
    }

    mapping (address =>Voter)currentWhitelist;
    mapping (address =>bool) currentBlacklist;
    //Session  currentSession;
    Session[] lesSession ;
    Proposal[] newlesPropositions;
    uint sessionIndex;

    event VoterRegistered(address voterAddress);
    event VoterUnRegistered(address voterAddress);
    event VoterBlacklisted(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    modifier valid(uint index){
        require(lesSession[index].isValid,"No session, already set");
        _;
    }
    modifier isAutorized() {
        require(
            //lesSession[sessionIndex].whitelistAndBlacklist.getwhitelist(msg.sender).isRegistered && 
           ( lesSession[sessionIndex].whitelist[msg.sender].isRegistered && 
            //!lesSession[sessionIndex].whitelistAndBlacklist.getblacklist(msg.sender) ,
            !lesSession[sessionIndex].blacklist[msg.sender] )||(owner()==msg.sender) ,
            "not whitelisted or blacklisted"
        );
        _;
    }
    modifier canPropose(){
            require(
                    lesSession[sessionIndex].isPublicProposal || owner() == msg.sender
            );
        _;
    }

     modifier isBlacklisted(address _address) {
       // require( lesSession[sessionIndex].whitelistAndBlacklist.getblacklist(msg.sender) ,"is blacklisted");
       require( lesSession[sessionIndex].blacklist[msg.sender],"is blacklisted");
        _;
    }

    function getSessionStatus() public view returns (WorkflowStatus) {
        return lesSession[sessionIndex].status;
    }

    function startSession(bool _publicProposal) public onlyOwner {
        restart(_publicProposal);
        lesSession[sessionIndex].whitelist[msg.sender]=Voter(true,false,0);
    }
    function restart(bool _publicProposal) private {

        
        delete newlesPropositions;
        //MappingVote m = new MappingVote();
       // m.setwhitelist(msg.sender,Voter(true,false,0));
        //Voting.Session memory currentSession = Session(WorkflowStatus.RegisteringVoters, _publicProposal, newlesPropositions,m,Proposal(0,"",0,msg.sender));  
        Session storage currentSession  = lesSession.push();
        currentSession.status= WorkflowStatus.RegisteringVoters;
        currentSession.isPublicProposal=_publicProposal;
        currentSession.lesProposition=newlesPropositions;
        currentSession.isValid=true;

        //Session memory currentSession = Session({status: WorkflowStatus.RegisteringVoters, isPublicProposal:_publicProposal,lesProposition: newlesPropositions,winner:Proposal(0,"",0,msg.sender)});
        //sessionIndex =  lesSession.push(currentSession);
    }

    function addVoter(address _address) public onlyOwner() isBlacklisted(_address){
        require(!lesSession[sessionIndex].whitelist[_address].isRegistered);
        lesSession[sessionIndex].whitelist[_address] = Voter(true,false,0);
        emit VoterRegistered(_address);
    }
    function removeVoter(address _address) public onlyOwner() {
        require(!lesSession[sessionIndex].whitelist[_address].isRegistered);
        lesSession[sessionIndex].whitelist[_address] = Voter(false,false,0);
        emit VoterUnRegistered(_address);

    }
    function blacklistVoter(address _address) public onlyOwner(){
        lesSession[sessionIndex].whitelist[_address].isRegistered=false;
        lesSession[sessionIndex].blacklist[_address] = true;
        emit VoterBlacklisted(_address);
    }
    function CloseRegisteringVoters() public onlyOwner{
        
        emit WorkflowStatusChange(lesSession[sessionIndex].status, WorkflowStatus.ProposalsRegistrationStarted);   
        lesSession[sessionIndex].status = WorkflowStatus.ProposalsRegistrationStarted;
    }
    function AddProposition(string calldata _description ) isAutorized() canPropose public {

            require(
                lesSession[sessionIndex].status == WorkflowStatus.ProposalsRegistrationStarted,
                "The Status not good"
            );
            uint lenPropositions=lesSession[sessionIndex].lesProposition.length;
            Proposal memory newPorosal = Proposal(lenPropositions+1,_description, 0,msg.sender);
            
            lesSession[sessionIndex].lesProposition.push(newPorosal);
            emit ProposalRegistered(lesSession[sessionIndex].lesProposition.length - 1);
        
    }
    
    function closeProposition() public onlyOwner {
        require(
            lesSession[sessionIndex].status == WorkflowStatus.ProposalsRegistrationStarted, 
            "The Status not good"
        );
        
        uint lenPropositions=lesSession[sessionIndex].lesProposition.length;
        Proposal memory newPorosal = Proposal(lenPropositions+1,"Vote Blanc", 0,msg.sender);
        lesSession[sessionIndex].lesProposition.push(newPorosal);
        
        emit WorkflowStatusChange(lesSession[sessionIndex].status, WorkflowStatus.ProposalsRegistrationEnded); 
        lesSession[sessionIndex].status = WorkflowStatus.ProposalsRegistrationEnded;  
    }

    function openVote() public onlyOwner  {
        require(
            lesSession[sessionIndex].status == WorkflowStatus.ProposalsRegistrationEnded, 
            "The Status not good"
        );
        
        emit WorkflowStatusChange(lesSession[sessionIndex].status, WorkflowStatus.VotingSessionStarted);  
        lesSession[sessionIndex].status = WorkflowStatus.VotingSessionStarted;   
    }
   
    function addVote(uint _ProposalId) isAutorized() public{
        require(!lesSession[sessionIndex].whitelist[msg.sender].hasVoted && lesSession[sessionIndex].status == WorkflowStatus.VotingSessionStarted);
        lesSession[sessionIndex].lesProposition[_ProposalId-1].voteCount += 1;
        lesSession[sessionIndex].whitelist[msg.sender].hasVoted = true;
        emit Voted(msg.sender, _ProposalId);
    }
   
    function closeVote() public onlyOwner  {
        require(
            lesSession[sessionIndex].status == WorkflowStatus.VotingSessionStarted,
            "The Status not good "
        );
        emit WorkflowStatusChange(lesSession[sessionIndex].status, WorkflowStatus.VotingSessionEnded);
        lesSession[sessionIndex].status = WorkflowStatus.VotingSessionEnded;
    }

    function contabiliserVote() public onlyOwner {
        uint i=1;
        uint max =lesSession[sessionIndex].lesProposition[0].voteCount;
        Proposal storage winner=lesSession[sessionIndex].lesProposition[0];
        for (i; i < lesSession[sessionIndex].lesProposition.length-1 ; i++) {
           if(max > lesSession[sessionIndex].lesProposition[i].voteCount){
                max=lesSession[sessionIndex].lesProposition[i].voteCount;
                winner=lesSession[sessionIndex].lesProposition[i];
           }
        }
        lesSession[sessionIndex].winner=winner;
        
    }
    
    /*function getSession() public view returns (Voting.Session calldata){
        return lesSession[sessionIndex];
    }
    
    
    
        WorkflowStatus status;
        bool isPublicProposal;
        Proposal[] lesProposition;
        Proposal winner;
        mapping (address =>Voter)whitelist;
        mapping (address =>bool) blacklist;

    */
    function getSessionProposal() public view returns (Proposal[] memory){
        return lesSession[sessionIndex].lesProposition;
    }
   
    function getWinner() public view  returns(Proposal memory){
        return lesSession[sessionIndex].winner;
    }
    
    function getIndexSession() public view  returns(uint){
        return sessionIndex;
    }
    function getSession(uint index) public view valid(index) returns(SessionFormat memory){
        
        return SessionFormat(lesSession[index].status,lesSession[index].isPublicProposal,lesSession[index].lesProposition,lesSession[index].winner);
    }

    function getCurrentStatus(uint Index) public view returns ( WorkflowStatus){

        return lesSession[Index].status;
    }
    struct SessionFormat{
        WorkflowStatus status;
        bool isPublicProposal;
        Proposal[] lesProposition;
        Proposal winner;
    }
}
