import { Component, ChangeEvent } from "react";
import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import getWeb3 from "./getWeb3";
import Confetti from "react-confetti";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Checkbox,
  TextField,
  Popover ,
  Button,
  Paper,
  Grid,
  FormControlLabel,
  Alert,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AppState, Proposal, WorkflowStatus } from "./types";
import {styles}from "./style";
import { Uint } from "web3";


class App extends Component<{}, AppState> {
  state: AppState = {
    web3: null,
    accounts: [""],
    newBlackListAddress:"",
    contract: null,
    contractAddress:"0x25FD062154ba346f9768c9BFADCa656234e5BfA5",
    userAddress: null,
    isOwner: false,
    sessionStatus: WorkflowStatus.Notstart,
    voteOpen: false,
    propositions: [],
    voters: [],
    results: "",
    winner:null,//{"description":"","proposalId":"","proposerPar":"","voteCount":""}
    newProposition: "",
    newVoterAddress: "",
    alreadyVote:false,
    isPublicSession: false,
    error: null,
  };
  

  async componentDidMount() {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts() || [""];
      const instance = new web3.eth.Contract(
        Voting.abi,
        this.state.contractAddress
      );
      console.log(instance);
              

      this.setState({ web3, accounts, contract: instance });

      const account = this.state.accounts ? this.state.accounts[0] : "";

      this.setState({
        userAddress: account ? `${account.slice(0, 6)}...${account.slice(38, 42)}` : null,
      });

      const owner: string = await instance.methods.owner().call();

      if (account === owner) {
        this.setState({
          isOwner: true,
        });
      }
      
      instance.events.WorkflowStatusChange({
        fromBlock: 0,
      })
        .on('data', (event) => {

          const { newStatus } = event.returnValues;
          this.setState({
            sessionStatus: Number(newStatus) as WorkflowStatus,
          });

        });
        this.handleRefreshProposition();
      // Fetch and update session status and other data
      // const sessionStatus = await instance.methods.getSessionStatus().call();
      // Update state based on session status
    } catch (error) {
      this.setState({ error: `Failed to load web3, accounts, or contract.` });
      console.error(error);
    }
  }

  // Implement other functions for handling actions

  handleStartSession = async () => {
    try {
      
      const {web3, contract, accounts,contractAddress,isPublicSession} = this.state;

      this.setState({
        sessionStatus: WorkflowStatus.Notstart,
        voteOpen: false,
        propositions: [],
        voters: [],
        results: "",
        winner:null,
        newProposition: "",
        newVoterAddress: "",
        alreadyVote:false,
        error: null,
      });

      const gasEstimate = await contract.methods
      .startSession(isPublicSession)
      .estimateGas({ from: accounts[0] });
      //console.log(gasEstimate);

      const encode = await contract.methods.startSession(isPublicSession).encodeABI();

      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        to: contractAddress,
        gas: gasEstimate,
        data: encode,
      });
      console.log("function ", tx);
      console.log(this.state.sessionStatus);

    } catch (error) {
      this.setState({ error: `Failed to start the session.` });
      console.error("Failed to start the session:", error);
    }
  };
  handleAddVoter = async () => {
    // Implement adding a voter logic
    // newVoterAddress is the address of the voter to be added (this.state.newVoterAddress) [we can split by ',' to add multiple voters at once]
    try {
      const { contract, accounts, web3 } = this.state;
      const voters = this.state.newVoterAddress.split(",");

      for (let i = 0; i < voters.length; i++) {
        const gasEstimate = await contract.methods.addVoter(voters[i]).estimateGas({ from: accounts[0]});
        const encode = await contract.methods.addVoter(voters[i]).encodeABI();

        const tx = await web3.eth.sendTransaction({
          from: accounts[0],
          to: this.state.contractAddress,
          gas: gasEstimate,
          data: encode,
        });

        console.log(tx);
      }
      
      this.setState({newVoterAddress:""});
    } catch (error) {
      this.setState({ error: `Failed to add the voter.` });
      console.error("Failed to add the voter:", error);
    }
  };

  handleBlackListVoter= async () => {
    // Implement adding a voter logic
    // newVoterAddress is the address of the voter to be added (this.state.newVoterAddress) [we can split by ',' to add multiple voters at once]
    try {
      const { contract, accounts, web3 } = this.state;
      const voters = this.state.newVoterAddress.split(",");

      for (let i = 0; i < voters.length; i++) {
        const gasEstimate = await contract.methods.blacklistVoter(voters[i]).estimateGas({ from: accounts[0]});
        const encode = await contract.methods.blacklistVoter(voters[i]).encodeABI();

        const tx = await web3.eth.sendTransaction({
          from: accounts[0],
          to: this.state.contractAddress,
          gas: gasEstimate,
          data: encode,
        });

        console.log(tx);
      }
      
      this.setState({newVoterAddress:""});
    } catch (error) {
      this.setState({ error: `Failed to add the voter.` });
      console.error("Failed to add the voter:", error);
    }
  };


  handleCloseRegisterVoter= async()=>{
    try{
      const {web3, contract, accounts,contractAddress} = this.state;
      const gasEstimate = await contract.methods
      .closeRegisteringVoters()
      .estimateGas({ from: accounts[0] });
      console.log(gasEstimate);

      const encode = await contract.methods.closeRegisteringVoters().encodeABI();

      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        to: contractAddress,
        gas: gasEstimate,
        data: encode,
      });
      console.log("function ", tx);

    } catch (error) {
      this.setState({ error: `Failed to close register voter.` });
      console.error("Failed to close register voter:", error);
    }
  }

  handleAddProposition = async () => {
    // Implement adding a proposition logic
    try{
      const {web3, contract, accounts,contractAddress,newProposition} = this.state;
      const gasEstimate = await contract.methods
      .addProposal(newProposition)
      .estimateGas({ from: accounts[0] });
      console.log(gasEstimate);

      const encode = await contract.methods.addProposal(newProposition).encodeABI();

      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        to: contractAddress,
        gas: gasEstimate,
        data: encode,
      });
      console.log("function ", tx);
      await this.handleRefreshProposition();
      this.setState({newProposition:""});
    } catch (error) {
      this.setState({ error: `Failed to Add the proposition.` });
      console.error("Failed to Add the proposition:", error);
    }
  };
  handleCloseRegisterProposals= async()=>{
    try{
      const {web3, contract, accounts,contractAddress} = this.state;
      const gasEstimate = await contract.methods
      .closeProposal()
      .estimateGas({ from: accounts[0] });
      console.log(gasEstimate);

      const encode = await contract.methods.closeProposal().encodeABI();

      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        to: contractAddress,
        gas: gasEstimate,
        data: encode,
      });
      console.log("function ", tx);
      this.handleRefreshProposition();
    } catch (error) {
      this.setState({ error: `Failed to close register proposal.` });
      console.error("Failed to register proposal:", error);
    }
  }

  

  handleOpenVote = async () => {
    // Implement opening the vote session logic
    try {
      const { contract, accounts, web3 } = this.state;
      const gasEstimate = await contract.methods.openVote().estimateGas({ from: accounts[0]});
      const encode = await contract.methods.openVote().encodeABI();

      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        to: this.state.contractAddress,
        gas: gasEstimate,
        data: encode,
      });

      console.log(tx);
    } catch (error) {
      this.setState({ error: `Failed to open the vote.` });
      console.error("Failed to open the vote:", error);
    }
  };

  handleAddVote = async (currentvote:Uint) => {
    // Implement opening the vote session logic
    try {
      const { contract, accounts, web3,alreadyVote} = this.state;
      
      this.handleRefreshProposition();
      if(currentvote==null){
        throw ("currentVote not valid");
      }
      if(alreadyVote){
        throw ("You already vote");
      }
    
      const gasEstimate = await contract.methods.addVote(currentvote).estimateGas({ from: accounts[0]});
      const encode = await contract.methods.addVote(currentvote).encodeABI();

      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        to: this.state.contractAddress,
        gas: gasEstimate,
        data: encode,
      });

      console.log(tx);
      this.setState({alreadyVote:true});
      this.handleRefreshProposition();
    } catch (error) {
      this.setState({ error: `Failed to add the vote.` });
      console.error("Failed to add the vote:", error);
    }
  };

  handleCloseVote = async () => {
    // Implement closing the vote session logic
    try {
      const { contract, accounts, web3 } = this.state;
      const gasEstimate = await contract.methods.closeVote().estimateGas({ from: accounts[0]});
      const encode = await contract.methods.closeVote().encodeABI();

      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        to: this.state.contractAddress,
        gas: gasEstimate,
        data: encode,
      });

      console.log(tx);
    } catch (error) {
      this.setState({ error: `Failed to close the vote.` });
      console.error("Failed to close the vote:", error);
    }
  };


  handleRefreshProposition = async ()=>{
    try{
      const { contract, accounts } = this.state;
      const resultsRes = await contract.methods.getSessionProposal().call({ from: accounts[0] });
      console.log("getSessionProposal", resultsRes);
      this.setState({propositions:resultsRes});
    }catch (error) {
      this.setState({ error: `Failed to get the propositions.` });
      console.error("Failed to get the propositions:", error);
    }
  };
  handleCalculAndGetResults = async () => {
    try{
      const { contract, accounts,web3,contractAddress } = this.state;
      const gasEstimate = await contract.methods
      .countVotes()
      .estimateGas({ from: accounts[0] });
      console.log(gasEstimate);

      const encode = await contract.methods.countVotes().encodeABI();

      const tx = await web3.eth.sendTransaction({
        from: accounts[0],
        to: contractAddress,
        gas: gasEstimate,
        data: encode,
      });
      console.log("function ", tx);

      
      const resultsRes = await contract.methods.getWinner().call({ from: accounts[0] });
      console.log("resultsRes", resultsRes);
      
      this.setState({winner:resultsRes});
    }catch (error) {
      this.setState({ error: `Failed to get the results.` });
      console.error("Failed to get the results:", error);
    }
  };
  handleGetResults = async () => {
    try{
      const { contract, accounts } = this.state;
      
      const resultsRes = await contract.methods.getWinner().call({ from: accounts[0] });
      console.log("resultsRes", resultsRes);
      
      this.setState({winner:resultsRes});
    }catch (error) {
      this.setState({ error: `Failed to get the results.` });
      console.error("Failed to get the results:", error);
    }
  };

  // Implement input change handlers
  handlePropositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProposition: e.target.value });
  };

  handleVoterAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newVoterAddress: e.target.value });
  };
  handleBlackListVoterAddressChange= (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBlackListAddress: e.target.value });
  };
  handleCloseError = () => {
    this.setState({ error: null });
  };

  renderStep = () => {
    console.log("this.state.sessionStatus", this.state.sessionStatus);
    switch (this.state.sessionStatus) {

      case WorkflowStatus.Notstart:
        return (
          <div>
            {/* Render UI for StartSession step */}
            {this.state.isOwner ? (
                  <div>
                    <h3>Start the Session</h3>
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
          ):(
            <>
              <p>The session will start soon</p>
            </>
          )}
          </div>
            
        );
                      
      case WorkflowStatus.RegisteringVoters:
        return (
          <div>
            {/* Render UI for RegisteringVoters step */}
            {this.state.isOwner ? (
                  <div>
                    <h3>Add or blackList voters</h3>
                    <br/>
                        <TextField
                          type="text"
                          label="Enter voter's address"
                          value={this.state.newBlackListAddress}
                          onChange={this.handleBlackListVoterAddressChange}
                        />
                        <Button
                          variant="contained"
                          onClick={this.handleBlackListVoter}
                          style={styles.button}
                        >
                          BlackList Voter
                        </Button>
                        <br/>

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
                          WhiteList Voter
                        </Button>
                        <br/>
                        <Button
                          variant="contained"
                          onClick={this.handleCloseRegisterVoter}
                          style={styles.button}
                        >
                          Close Register Voter
                        </Button>
                      
                </div>
          ):(
            <>
              <p>The session will start soon</p>
            </>
          )}
          </div>
        );

      case WorkflowStatus.ProposalsRegistrationStarted:
        console.log("handleCloseVote", this.handleCloseVote);
        return (
         
          <div>
             
            {/* Render UI for ProposalsRegistrationStarted step */}
            <h3>Add Propositions</h3>
            {
            this.state.isPublicSession ||  this.state.isOwner? (
              <>
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
              </>
              ):(
                <>
                  <h3>Waiting is private Proposition</h3>
                </>
              )
              }
            {
               this.state.isOwner && (
                <>
                   <Button
                      variant="contained"
                      onClick={this.handleCloseRegisterProposals}
                      style={styles.button}
                    >
                      Close Register Proposals  
                    </Button>
                </>
               )
            }
          </div>
        );

      case WorkflowStatus.ProposalsRegistrationEnded:
        return (
          <div>
            {/* Render UI for ProposalsRegistrationEnded step */}
           { this.state.isOwner ? (
            <Button
              variant="contained"
              onClick={this.handleOpenVote}
              style={styles.button}
            >
              Open Voting Session
            </Button>
            ):(
              <h3>Wait the voting time</h3>
            )}
          </div>
        );

      case WorkflowStatus.VotingSessionStarted:
        return (
          <div>
            {/* Render UI for VotingSessionStarted step */}
            <h3>Voting Time !!!!</h3>
            { this.state.isOwner && (
            <Button
              variant="contained"
              onClick={this.handleCloseVote}
              style={styles.button}
            >
              Close Voting Session
            </Button>
            )}
          </div>
        );

      case WorkflowStatus.VotingSessionEnded:
        return (
          <div>
            {/* Render UI for VotingSessionEnded step */}
            { this.state.isOwner ? (
            <Button
              variant="contained"
              onClick={this.handleCalculAndGetResults}
              style={styles.button}
            >
              Get Voting Results
            </Button>
            ):(
            <>
              <h3>Wait Admin to know the winner</h3>
            </>
            )}
          </div>
        );

      default:
        console.log("defaul", this.state.sessionStatus);
        return null;
    }
  };
  render() {
    return (
      <div style={styles.root} >
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
              <Grid item xs={100} sm={100}>
                <Paper style={styles.paper}>{this.renderStep()}</Paper>
              </Grid>
              {/* ... (other UI components) */}
              <Grid item xs={100} sm={100}>
                <Paper style={styles.paper}>
                  <label>Les proposition de Vote</label>
                  <br/>
                  <br/>
                  <br/>
                  <Grid container spacing={2} >
                    {Object(this.state.propositions).map((proposition:Proposal) => (

                      <Grid item  key={proposition.proposalId} >
                        <Paper style={{backgroundColor:"GrayText",padding:"5px"}}>
                          <h4>{proposition.description}</h4>
                          <p>Vote :{Number(proposition.voteCount)}</p>
                          <Button 
                            variant="contained"
                            onClick={() => {
                              this.handleAddVote(proposition.proposalId);
                            }}
                            style={styles.button}
                          >
                            Voter
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
            </Grid>
            
            
                        {this.state.winner!=null &&(
              <>
              <Confetti numberOfPieces={150} width={2000} height={2000} />
                <Popover 
                    id={"1"}
                    open={true}
                    anchorOrigin={{
                      vertical: 'center',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'center',
                      horizontal: 'center',
                    }}
                  >
                  <Typography sx={{ p: 10 }}>
                    The Propose winner is : <br/>
                    {this.state.winner.description} <br/>
                    with: {Number(this.state.winner.voteCount)} votes <br/>
                    from: {this.state.winner.proposerPar} <br/><br/>
                    {this.state.isOwner ? (
                      <>
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
                      Restart Session
                    </Button>
                      </>
                    ):(<>
                      <h3>Wait until Admin Restart Session</h3>
                    
                    </>)}
                  </Typography>
                </Popover>
              </>
            )}
            
            </Grid>
          </Container>
        {this.state.error && (
          <Alert severity="error" onClose={this.handleCloseError}  style={styles.errorAlert}>
            {this.state.error}
          </Alert>
        )}

        <div style={styles.footer}>
          Project Description: A simple voting application.
        </div>
      </div>
    );
  }
}

export default App;