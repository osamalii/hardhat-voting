# Voting DApp Readme

## Introduction
This README provides a detailed explanation of the Voting DApp (Decentralized Application), which is built on the Ethereum blockchain using Web3 technology. The Voting DApp allows for secure and transparent voting processes, which can be used for various applications like elections, polls, or decision-making.

## Application Overview
The Voting DApp consists of two main roles: the Admin and Normal Users. The Admin has the authority to create and manage voting sessions, add voters to a whitelist, add propositions, open the voting session, and ultimately determine the winner. Normal Users, on the other hand, can participate in the voting process by casting their votes and, if allowed, proposing new propositions.

## Workflow
Here's a step-by-step explanation of the workflow within the Voting DApp:

### 1. Admin Starts a Session
- The Admin initiates a voting session, specifying whether it's a public or private session. A public session allows anyone to propose new propositions, while a private session restricts this feature to the Admin.

### 2. Admin Manages Voters
- The Admin can add voters to a whitelist. Only voters on the whitelist can participate in the voting process.
- The Admin also has the option to blacklist voters if necessary.

### 3. Admin Opens Proposal Registration
- If it's a public session, the Admin can open proposal registration, allowing all participants to submit their propositions. In the case of a private session, only the Admin can propose.

### 4. Users Add Proposals
- Participants, including the Admin and other whitelisted users, can add new propositions to the session.

### 5. Admin Closes Proposal Registration
- Once all the proposals are submitted, the Admin can close the proposal registration. No new propositions can be added after this point.

### 6. Admin Opens Voting Session
- The Admin can open the voting session, allowing all eligible voters to cast their votes.

### 7. Users Cast Votes
- Users can vote for their preferred propositions. It's important to note that each user can only vote once in a voting session. 

### 8. Admin Closes Voting Session
- Once the voting period is over, the Admin can close the voting session, preventing any further votes from being cast.

### 9. Admin Counts Votes
- The Admin counts the votes and determines the winning proposition based on the number of votes received.

### 10. Admin Publishes Results
- The Admin publishes the results, revealing the winning proposition.

## Additional Functionalities

### 1. White Vote
- A "white vote" is a special proposition that users can vote for if they don't want to vote for any of the existing propositions. It represents an abstention.

### 2. Blacklist
- The Admin can blacklist voters, preventing them from participating in the voting process. This feature can be used to exclude problematic voters.

## Conclusion
The Voting DApp is designed to facilitate transparent and secure voting processes on the Ethereum blockchain. It provides clear roles for Admin and Normal Users, and offers features such as white voting and blacklisting for added flexibility and control. The application can be adapted for various voting scenarios and ensures a fair and efficient voting process. Users can vote only once in a voting session, ensuring the integrity of the process.