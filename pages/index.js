import React from "react";
// import { useWeb3 } from "../ethereum/Web3Context";
import { loadWeb3 } from "../ethereum/web3Utils";
import campaignFactoryContract from "../ethereum/build/CampaignFactory.json";

const { abi } = campaignFactoryContract;

export default ({ campaigns = [] }) => {
  // const { factory } = useWeb3();

  return (
    <div>
      <h1>This is the campaign list page!</h1>
      {campaigns.map((campaign) => {
        return (
          <div key={campaign}>
            <p>{campaign}</p>
          </div>
        );
      })}
    </div>
  );
};

export async function getServerSideProps() {
  const web3 = await loadWeb3();
  const campaignFactory = new web3.eth.Contract(abi, process.env.ADDRESS);
  const campaigns =
    (await campaignFactory.methods.getDeployedCampaigns().call()) ?? [];
  return {
    props: { campaigns },
  };
}
