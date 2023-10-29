import { Uint } from "web3";

export enum WorkflowStatus {
    Notstart,
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
    VotingSessionStarted,
    VotingSessionEnded,
    VotesTallied
}
export interface Proposal {
    proposalId:Uint;
     description:string;
     voteCount:Uint;
     proposerPar: string;
}
export interface Voter {
    isRegistered:boolean;
    hasVoted:boolean;
    votedProposalId:Uint;
}

export interface  SessionData {
    status: WorkflowStatus;
    isPublicProposal: boolean;
    lesProposition: Proposal[]; 
    winner: Proposal|null;
    whitelist:{adress:string,vote:Voter}|null;
    blacklist:{adress:string,is:boolean}|null;
  }
  