import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  createContext,
} from "react";

import { loadWeb3 } from "./web3Utils";
import campaignFactoryContract from "./build/CampaignFactory.json";

const { abi } = campaignFactoryContract;

const Web3Context = createContext(null);
const { Provider } = Web3Context;

export const Web3ContextProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [factory, setFactory] = useState(null);

  useEffect(() => {
    const prepareBlockchain = async () => {
      const web3Instance = await loadWeb3();
      setWeb3(web3Instance);
    };
    prepareBlockchain();
  }, []);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
    };
    if (web3) {
      getAccounts();
      const contract = new web3.eth.Contract(abi, process.env.ADDRESS);
      setFactory(contract);
    }
  }, [web3]);

  const values = useMemo(
    () => ({
      web3,
      accounts,
      factory,
    }),
    [web3, accounts, factory]
  );

  return <Provider value={values}>{children}</Provider>;
};

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    console.error("Error deploying Web3 Context!!!");
  }
  return context;
}

export default useWeb3;
