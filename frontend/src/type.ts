import { Uint } from "web3";

export enum WorkflowStatus {
    Notstart=-1,
    RegisteringVoters=0,
    ProposalsRegistrationStarted=1,
    ProposalsRegistrationEnded=2,
    VotingSessionStarted=3,
    VotingSessionEnded=4,
    VotesTallied=5
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
  
export interface AppState {
    web3: any;
    accounts: string[] | null;
    contract: any;
    contractAddress:string;
    userAddress: string | null;
    isOwner: boolean;
    sessionStatus: WorkflowStatus;
    voteOpen: boolean;
    propositions: Proposal[];
    voters: string[];
    results: string;
    winner: Proposal |null;
    newProposition: string;
    newVoterAddress: string;
    alreadyVote:boolean;
    isPublicSession: boolean;
    error: string | null;
  }
  