import React, { Component, ChangeEvent } from "react";
import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import getWeb3 from "./getWeb3";
import { Container, AppBar, Toolbar, Typography, Checkbox, TextField, Button, Paper, Grid, FormControlLabel } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const styles = {
  root: {
    flexGrow: 1,
  },
  brand: {
    flexGrow: 1,
    fontSize: "24px",
  },
  connectedAccount: {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
  },
  section: {
    marginTop: "20px",
  },
  container: {
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
  },
  footer: {
    textAlign: "center",
    padding: "10px",
    fontSize: "14px",
  },
  header: {
    background: "linear-gradient(45deg, #1976d2 30%, #2196F3 90%)",
    color: "#fff",
    marginBottom: "20px",
    padding: "10px 0",
  },
  button: {
    background: "#1976d2",
    color: "#fff",
    borderRadius: "5px",
    padding: "10px 20px",
    margin: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    "&:hover": {
      background: "#1565c0",
    },
  },
  paper: {
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
  },
};

interface AppState {
  web3: any;
  accounts: string[] | null;
  contract: any;
  userAddress: string | null;
  isOwner: boolean;
  sessionStatus: string;
  voteOpen: boolean;
  propositions: string[];
  voters: string[];
  results: string;
  winner: string;
  newProposition: string;
  newVoterAddress: string;
  isPublicSession: boolean;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    web3: null,
    accounts: null,
    contract: null,
    userAddress: null,
    isOwner: false,
    sessionStatus: "",
    voteOpen: false,
    propositions: [],
    voters: [],
    results: "",
    winner: "",
    newProposition: "",
    newVoterAddress: "",
    isPublicSession: false,
  };

  async componentDidMount() {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      const instance = new web3.eth.Contract(
        Voting.abi,
        '0x784C8Bf66752ffc60ac220962c4EF47e2568DEb5'
      );

      this.setState({ web3, accounts, contract: instance });

      const account = this.state.accounts ? this.state.accounts[0] : null;

      this.setState({
        userAddress: account ? `${account.slice(0, 6)}...${account.slice(38, 42)}` : null,
      });

      const owner = await instance.methods.owner().call();

      if (account === owner) {
        this.setState({
          isOwner: true,
        });
      }

      // Fetch and update session status and other data
      // const sessionStatus = await instance.methods.getSessionStatus().call();
      // Update state based on session status
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check the console for details.`
      );
      console.error(error);
    }
  }

  // Implement other functions for handling actions

  handleStartSession = async () => {
    try {
      const { contract, accounts } = this.state;
      const isPublic = this.state.isPublicSession; // Assuming you have an isPublicSession state for the checkbox
      const startRes = await contract.methods.startSession(isPublic).call({ from: accounts[0] });
      console.log("startRes", startRes);

    } catch (error) {
      console.error("Failed to start the session:", error);
    }
  };
  

  handleAddProposition = async () => {
    // Implement adding a proposition logic
  };

  handleAddVoter = async () => {
    // Implement adding a voter logic
  };

  handleOpenVote = async () => {
    // Implement opening the vote session logic
  };

  handleCloseVote = async () => {
    // Implement closing the vote session logic
  };

  handleGetResults = async () => {
    // Implement getting vote results and winner logic
  };

  // Implement input change handlers
  handlePropositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProposition: e.target.value });
  };

  handleVoterAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newVoterAddress: e.target.value });
  };

  render() {
    return (
      <div style={styles.root}>
        <AppBar position="static" style={styles.header}>
          <Toolbar>
            <Typography variant="h6" style={styles.brand}>
              Voting App
            </Typography>
            {this.state.userAddress && (
              <div style={styles.connectedAccount}>
                <AccountCircleIcon style={{ marginRight: "8px" }} />
                Connected Account: {this.state.userAddress}
              </div>
            )}
          </Toolbar>
        </AppBar>

        <Container style={styles.section}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper style={styles.paper}>
                {this.state.isOwner ? (
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.isPublicSession}
                          onChange={() =>
                            this.setState({
                              isPublicSession: !this.state.isPublicSession,
                            })
                          }
                          color="primary"
                        />
                      }
                      label="Is Public Session"
                    />
                    <Button
                      variant="contained"
                      onClick={this.handleStartSession}
                      style={styles.button}
                    >
                      Start Session
                    </Button>
                  </div>
                ) : (
                  <div>
                    <TextField
                      type="text"
                      label="Enter a proposition"
                      value={this.state.newProposition}
                      onChange={this.handlePropositionChange}
                    />
                    <Button
                      variant="contained"
                      onClick={this.handleAddProposition}
                      style={styles.button}
                    >
                      Add Proposition
                    </Button>
                  </div>
                )}
              </Paper>
            </Grid>
            {this.state.isOwner && (
              <Grid item xs={12} sm={6}>
                <Paper style={styles.paper}>
                  <TextField
                    type="text"
                    label="Enter voter's address"
                    value={this.state.newVoterAddress}
                    onChange={this.handleVoterAddressChange}
                  />
                  <Button
                    variant="contained"
                    onClick={this.handleAddVoter}
                    style={styles.button}
                  >
                    Add Voter
                  </Button>
                  <Button
                    variant="contained"
                    onClick={this.handleOpenVote}
                    style={styles.button}
                  >
                    Open Vote
                  </Button>
                  <Button
                    variant="contained"
                    onClick={this.handleCloseVote}
                    style={styles.button}
                  >
                    Close Vote
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>

        <div style={styles.footer}>
          Project Description: A simple voting application.
        </div>
      </div>
    );
  }
}

export default App;



















// import  { Component } from "react";
// import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
// import getWeb3 from "./getWeb3.js";
// import "./App.css";
// import Proposal from "./component/Proposal/Proposal.js";

// import { SessionData,WorkflowStatus } from "./component/structure/Structure.js";

// interface AppState {
//   web3: any; // Replace with the correct type for web3
//   accounts: string[] | null;
//   contract: any; // Replace with the correct type for your contract
//   userAddress: string | null;
//   isOwner: boolean;
// }

// class App extends Component<{}, AppState> {
//   state: AppState = {
//     web3: null,
//     accounts: null,
//     contract: null,
//     userAddress: null,
//     isOwner: false,
//   };
//   data:SessionData={
//     status: WorkflowStatus.RegisteringVoters,
//     isPublicProposal: false,
//     lesProposition:[], 
//     winner: null,
//     whitelist:null,
//     blacklist:null,
//   }

//   async componentDidMount() {
//     try {
//       const web3 = await getWeb3();
//       const accounts = await web3.eth.getAccounts();

//       console.log("accounts", accounts)

//       const instance = new web3.eth.Contract(
//         Voting.abi,
//         '0x11003a6c71C29AD23092deAb00731666c5dDd79D'
//       );

//       console.log(instance, "instance")

//       this.setState({ web3, accounts, contract: instance });

//       let account = this.state.accounts ?? null;


//       this.setState({
//         userAddress: account
//           ? account.slice(0, 6) + "..." + account.slice(38, 42)
//           : null,
//       });

//       const owner = await instance.methods.owner().call();
//       if (account === owner) {
//         this.setState({
//           isOwner: true,
//         });
//       }
//       console.log("owner", owner);
//     } catch (error) {
//       console.log("error", error)
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`
//       );
//       console.error(error);
//     }
//   }

//   render() {
//     return (
//       <div className="App">
//         <div className="flex flex-col justify-between min-h-screen">
//           <div className="flex-1">
//             <header>
//               <nav className="bg-yellow-10 border-yellow-30  z-50 fixed w-full">
//                 <div className="sm:px-6 sm:py-3 md:px-8 md:py-6 flex flex-row items-center justify-between border border-b">
//                   <div className="flex flex-row items-center">
//                     <a className="logo md:w-170 w-80" href="/">
//                       Vote DApp
//                     </a>
//                   </div>
//                   <div className="flex">
//                     <button className="p-1 block md:hidden">
//                       <svg
//                         stroke="currentColor"
//                         fill="currentColor"
//                         strokeWidth="0"
//                         viewBox="0 0 24 24"
//                         className="h-8 w-auto"
//                         height="1em"
//                         width="1em"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
//                       </svg>
//                     </button>
//                   </div>
//                   <ul className="hidden list-none md:flex flex-row gap-4 items-baseline ml-10">
//                     <li>
//                       <button id="web3-status-connected" className="web3-button">
//                         <p className="Web3StatusText">
//                           {this.state.userAddress}
//                         </p>
//                         <div
//                           //size="16"
//                           className="Web3Status__IconWrapper-sc-wwio5h-0 hqHdeW"
//                         >
//                           <div className="Identicon__StyledIdenticon-sc-1ssoit4-0 kTWLky">
//                             <span>
//                               <div className="avatar">
//                                 <svg x="0" y="0" width="16" height="16">
//                                   <rect
//                                     x="0"
//                                     y="0"
//                                     width="16"
//                                     height="16"
//                                     transform="translate(-1.1699893080448718 -1.5622487594391614) rotate(255.7 8 8)"
//                                     fill="#2379E1"
//                                   ></rect>
//                                   <rect
//                                     x="0"
//                                     y="0"
//                                     width="16"
//                                     height="16"
//                                     transform="translate(4.4919645360147475 7.910549295855059) rotate(162.8 8 8)"
//                                     fill="#03595E"
//                                   ></rect>
//                                   <rect
//                                     x="0"
//                                     y="0"
//                                     width="16"
//                                     height="16"
//                                     transform="translate(11.87141302372359 2.1728091065947037) rotate(44.1 8 8)"
//                                     fill="#FB1877"
//                                   ></rect>
//                                 </svg>
//                               </div>
//                             </span>
//                           </div>
//                         </div>
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               </nav>
//             </header>
//             <div className="body">

//               <div className="Proposals">
                
//                 <Proposal data={this.data}/>
//                 </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default App;
