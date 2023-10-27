import  { Component } from "react";
import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import getWeb3 from "./getWeb3.js";
import "./App.css";

interface AppState {
  web3: any; // Replace with the correct type for web3
  accounts: string[] | null;
  contract: any; // Replace with the correct type for your contract
  userAddress: string | null;
  isOwner: boolean;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    web3: null,
    accounts: null,
    contract: null,
    userAddress: null,
    isOwner: false,
  };

  async componentDidMount() {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      console.log("accounts", accounts)

      const instance = new web3.eth.Contract(
        Voting.abi,
        '0x3c6BA818A93709ed6E6155EAdb12499fAd934eED'
      );

      console.log(instance, "instance")

      this.setState({ web3, accounts, contract: instance });

      let account = this.state.accounts ?? null;


      this.setState({
        userAddress: account
          ? account.slice(0, 6) + "..." + account.slice(38, 42)
          : null,
      });

      const owner = await instance.methods.owner().call();
      if (account === owner) {
        this.setState({
          isOwner: true,
        });
      }
      console.log("owner", owner);
    } catch (error) {
      console.log("error", error)
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="flex flex-col justify-between min-h-screen">
          <div className="flex-1">
            <header>
              <nav className="bg-yellow-10 border-yellow-30  z-50 fixed w-full">
                <div className="sm:px-6 sm:py-3 md:px-8 md:py-6 flex flex-row items-center justify-between border border-b">
                  <div className="flex flex-row items-center">
                    <a className="logo md:w-170 w-80" href="/">
                      Vote DApp
                    </a>
                  </div>
                  <div className="flex">
                    <button className="p-1 block md:hidden">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        className="h-8 w-auto"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                      </svg>
                    </button>
                  </div>
                  <ul className="hidden list-none md:flex flex-row gap-4 items-baseline ml-10">
                    <li>
                      <button id="web3-status-connected" className="web3-button">
                        <p className="Web3StatusText">
                          {this.state.userAddress}
                        </p>
                        <div
                          size="16"
                          className="Web3Status__IconWrapper-sc-wwio5h-0 hqHdeW"
                        >
                          <div className="Identicon__StyledIdenticon-sc-1ssoit4-0 kTWLky">
                            <span>
                              <div className="avatar">
                                <svg x="0" y="0" width="16" height="16">
                                  <rect
                                    x="0"
                                    y="0"
                                    width="16"
                                    height="16"
                                    transform="translate(-1.1699893080448718 -1.5622487594391614) rotate(255.7 8 8)"
                                    fill="#2379E1"
                                  ></rect>
                                  <rect
                                    x="0"
                                    y="0"
                                    width="16"
                                    height="16"
                                    transform="translate(4.4919645360147475 7.910549295855059) rotate(162.8 8 8)"
                                    fill="#03595E"
                                  ></rect>
                                  <rect
                                    x="0"
                                    y="0"
                                    width="16"
                                    height="16"
                                    transform="translate(11.87141302372359 2.1728091065947037) rotate(44.1 8 8)"
                                    fill="#FB1877"
                                  ></rect>
                                </svg>
                              </div>
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>
            </header>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
