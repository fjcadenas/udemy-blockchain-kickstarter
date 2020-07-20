import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import ContributeFrom from "../../../components/ContributeForm";
import { useWeb3 } from "../../../ethereum/Web3Context";

import campaignContract from "../../../ethereum/build/Campaign.json";
import { loadWeb3 } from "../../../ethereum/web3Utils";

const { abi } = campaignContract;

const CampaignView = ({
  minimumContribution,
  balance,
  requestsLength,
  approversCount,
  manager,
}) => {
  const [campaign, setCampaign] = useState(null);
  const router = useRouter();
  const { web3 } = useWeb3();

  const {
    query: { address },
  } = router;

  useEffect(() => {
    if (web3) {
      const contract = new web3.eth.Contract(abi, address);
      setCampaign(contract);
    }
  }, [web3]);

  const items = useMemo(
    () => [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and create founding requests.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description: "Yoy must contribute at least this amount to participate.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestsLength,
        meta: "Number of Requests",
        description: "A Request tries to withdraw money from the contract.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description: "People who already donated to this campaign.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: balance,
        meta: "Campaign Balance (Ether)",
        description: "How much money this campaign has left to spend.",
        style: { overflowWrap: "break-word" },
      },
    ],
    []
  );

  return (
    <Layout>
      <h3>{`This is the Campaign View at ${address}`}</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={11}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={5}>
            <ContributeFrom campaign={campaign} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link
              href="/campaign/[address]/requests"
              as={`/campaign/${address}/requests`}
            >
              <a>
                <Button primary={true}>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const web3 = await loadWeb3();
  const {
    params: { address },
  } = context;
  const campaignFactory = new web3.eth.Contract(abi, address);

  const summary = (await campaignFactory.methods.getSummary().call()) ?? [];

  return {
    props: {
      minimumContribution: summary[0],
      balance: web3.utils.fromWei(summary[1], "ether"),
      requestsLength: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    },
  };
}

export default CampaignView;
