import Web3 from "web3";

const getWeb3 = (): Promise<Web3> =>
  new Promise((resolve: (web3: Web3) => void, reject: (error: Error) => void) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if ((window as any).ethereum) {
        const web3 = new Web3((window as any).ethereum);
        try {
          // Request account access if needed
          await (window as any).ethereum.enable();
          // Accounts now exposed
          resolve(web3);
        } catch (error: any) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if ((window as any).web3) {
        // Use Mist/MetaMask's provider.
        const web3 = new Web3((window as any).web3);
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

export default getWeb3;
