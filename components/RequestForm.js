import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Message, Input } from "semantic-ui-react";

import { useWeb3 } from "../ethereum/Web3Context";

const RequestForm = ({ campaign }) => {
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { accounts, web3 } = useWeb3();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });
      router.replace(`/campaign/${campaign.options.address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Value in Ether</label>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </Form.Field>
      <Form.Field>
        <label>Recipient</label>
        <Input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </Form.Field>
      <Button primary={true} loading={isLoading}>
        Create Request
      </Button>
      <Message error={true} header="Oops!" content={errorMessage} />
    </Form>
  );
};

export default RequestForm;
