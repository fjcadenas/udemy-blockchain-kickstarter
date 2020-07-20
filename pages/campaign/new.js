import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { useWeb3 } from "../../ethereum/Web3Context";

const CampaignNew = () => {
  const [contribution, setContribution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { factory, accounts } = useWeb3();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      // no need to specify gas amount when coming from a web3 browser
      await factory.methods
        .createCampaign(contribution)
        .send({ from: accounts[0] });
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  }

  return (
    <Layout>
      <h3>Create a campaign</h3>
      <Form
        onSubmit={onSubmit}
        error={!!errorMessage}
      >
        <Form.Field>
          <label>Minimum contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
          />
        </Form.Field>
        <Message error={true} header="Oops!" content={errorMessage} />
        <Button primary={true} loading={isLoading}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
