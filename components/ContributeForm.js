import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { useWeb3 } from "../ethereum/Web3Context";

const ContributeForm = ({ campaign }) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { web3, accounts } = useWeb3();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether"),
      });
      router.replace(`/campaign/${campaign.options.address}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };
  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Field>
      <Message error={true} header="Oops!" content={errorMessage} />
      <Button primary={true} loading={isLoading}>
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;
