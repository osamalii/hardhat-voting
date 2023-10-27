import { Component } from "react";
import "./Proposal.css";
enum WorkflowStatus {
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
       VotingSessionStarted,
    VotingSessionEnded,
    VotesTallied
}
interface Proposal {
    proposalId:number;
     description:string;
     voteCount:number;
     proposerPar: string;
}
interface Voter {
    isRegistered:boolean;
    hasVoted:boolean;
    votedProposalId:number;
}
interface Sessiondata {
    status: WorkflowStatus;
    isPublicProposal: boolean;
    lesProposition: Proposal[]; 
    winner: Proposal;
    whitelist:{adress:string,vote:Voter};
    blacklist:{adress:string,is:boolean};
  }

class Proposal extends Component<Sessiondata>{
 

render() {
    return (
        <>

        </>
    )
}
   
}
export default Proposal;