import dotenv from "dotenv";
dotenv.config();

import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import compiledFactory from "./build/CampaignFactory.json";

const { abi, evm } = compiledFactory;

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  "https://rinkeby.infura.io/v3/455c93099a8b465a86a2b2e2261341e9"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(`Attempting to use account ${accounts[0]}`);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: "4000000", from: accounts[0] });

  console.log(`Contract deployed to ${result.options.address}`);
  provider.engine.stop();
};

deploy();

// Last deployment address: 0xfEd4a9f2343F459e5725d1A44bD07B6AAC755aA9
