import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";

async function loadWeb3() {
  let web3;
  if (typeof window === "undefined") {
    // this is the web3 at backend used for SSR
    const provider = new HDWalletProvider(
      process.env.MNEMONIC,
      "https://rinkeby.infura.io/v3/455c93099a8b465a86a2b2e2261341e9"
    );
    web3 = new Web3(provider);
  } else if (window?.ethereum) {
    // this is the new way clients like Metamask Expose their provider
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } else if (window?.web3) {
    // this is for legacy dapp browsers
    web3 = new Web3(window.web3.currentProvider);
  }
  return web3;
}

export { loadWeb3 };
