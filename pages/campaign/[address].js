import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const CampaignView = () => {
  const router = useRouter();
  const {
    query: { address },
  } = router;
  return (
    <Layout>
      <h3>{`This is the Campaign View at ${address}`}</h3>
    </Layout>
  );
};

export default CampaignView;
