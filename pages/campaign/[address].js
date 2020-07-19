import React from "react";
import { useRouter } from "next/router";

const CampaignView = () => {
  const router = useRouter();
  const {
    query: { address },
  } = router;
  return <h1>{`This is the Campaign View at ${address}`}</h1>;
};

export default CampaignView;
