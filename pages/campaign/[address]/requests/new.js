import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "semantic-ui-react";

import Layout from "components/Layout";
import RequestForm from "components/RequestForm";
import campaignContract from "ethereum/build/Campaign.json";
import { useWeb3 } from "ethereum/Web3Context";

const { abi } = campaignContract;

const NewRequest = () => {
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

  return (
    <Layout>
      <Link
        href="/campaign/[address]/requests"
        as={`/campaign/${address}/requests`}
      >
        <a>
          <Button>Back</Button>
        </a>
      </Link>
      <h3>Create a new Request</h3>
      <RequestForm campaign={campaign} />
    </Layout>
  );
};

export default NewRequest;
