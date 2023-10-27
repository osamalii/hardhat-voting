
export enum WorkflowStatus {
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
       VotingSessionStarted,
    VotingSessionEnded,
    VotesTallied
}
export interface Proposal {
    proposalId:number;
     description:string;
     voteCount:number;
     proposerPar: string;
}
export interface Voter {
    isRegistered:boolean;
    hasVoted:boolean;
    votedProposalId:number;
}
export interface  SessionData {
    status: WorkflowStatus;
    isPublicProposal: boolean;
    lesProposition: Proposal[]; 
    winner: Proposal|null;
  }
