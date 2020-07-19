import React from "react";
import Link from "next/link";
import { Card, Button, Icon } from "semantic-ui-react";
import Layout from "../components/Layout";
import { useWeb3 } from "../ethereum/Web3Context";
import { loadWeb3 } from "../ethereum/web3Utils";
import campaignFactoryContract from "../ethereum/build/CampaignFactory.json";

const { abi } = campaignFactoryContract;

const renderCampaigns = (campaigns) => {
  const items = campaigns.map((address) => ({
    header: address,
    description: (
      <Link href="/campaign/[address]" as={`/campaign/${address}`}>
        <a>View page</a>
      </Link>
    ),
    fluid: true,
  }));

  return <Card.Group items={items} />;
};
export default ({ campaigns = [] }) => {
  const { factory } = useWeb3();

  return (
    <Layout>
      <Link href="/campaign/new">
        <a>
          <Button
            floated="right"
            icon={true}
            primary={true}
            labelPosition="left"
          >
            <Icon name="add" />
            Create new campaign
          </Button>
        </a>
      </Link>
      {renderCampaigns(campaigns)}
    </Layout>
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
