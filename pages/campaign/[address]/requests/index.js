import React, { useEffect, useState } from "react";
import { Button, Table } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";

import Layout from "components/Layout";
import RequestRow from "components/RequestRow";
import campaignContract from "ethereum/build/Campaign.json";
import { useWeb3 } from "ethereum/Web3Context";
import { loadWeb3 } from "ethereum/web3Utils";

const { abi } = campaignContract;
const { Header, Row, HeaderCell, Body } = Table;
const Requests = ({ requests, requestsCount, approversCount }) => {
  const [campaign, setCampaign] = useState(null);
  const { web3 } = useWeb3();
  const router = useRouter();
  const {
    query: { address },
  } = router;

  useEffect(() => {
    if (web3) {
      const contract = new web3.eth.Contract(abi, address);
      setCampaign(contract);
    }
  }, [web3]);
  return (
    <Layout>
      <h3>Requests</h3>
      <Link
        href="/campaign/[address]/requests/new"
        as={`/campaign/${address}/requests/new`}
      >
        <a>
          <Button primary={true} floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {requests.map((request, index) => (
            <RequestRow
              key={index}
              campaign={campaign}
              id={index}
              request={request}
              address={address}
              approversCount={approversCount}
            />
          ))}
        </Body>
      </Table>
      <div>{`Found ${requestsCount} requests`}</div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const web3 = await loadWeb3();
  const {
    params: { address },
  } = context;
  const campaign = new web3.eth.Contract(abi, address);
  const requestsCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  console.log(requestsCount);
  const requests = await Promise.all(
    Array(+requestsCount)
      .fill()
      .map(async (element, index) => {
        // this returns a tupple with the type in position 0
        const request = await campaign.methods.requests(index).call();
        return JSON.parse(JSON.stringify(request));
      })
  );

  return {
    props: {
      requests,
      requestsCount,
      approversCount,
    },
  };
}

export default Requests;
