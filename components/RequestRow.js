import React from "react";
import { Table, Button } from "semantic-ui-react";

import { useWeb3 } from "../ethereum/Web3Context";

const { Row, Cell } = Table;

const RequestRow = ({ campaign, request, id, approversCount, address }) => {
  const { description, value, recipient, approvalCount, complete } = request;
  const { web3, accounts } = useWeb3();

  const readyToApprove = approvalCount >= approversCount / 2;

  const onApproveRequest = async () => {
    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    });
  };

  const onFinalizeRequest = async () => {
    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0],
    });
  };
  return (
    <Row disabled={complete} positive={readyToApprove && !complete}>
      <Cell>{id}</Cell>
      <Cell>{description}</Cell>
      <Cell>
        {web3 ? web3.utils.fromWei(value.toString(), "ether") : "..."}
      </Cell>
      <Cell>{recipient}</Cell>
      <Cell>{`${approvalCount}/${approversCount}`}</Cell>
      <Cell>
        {!complete && (
          <Button color="green" basic={true} onClick={onApproveRequest}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {!complete && (
          <Button color="orange" basic={true} onClick={onFinalizeRequest}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
