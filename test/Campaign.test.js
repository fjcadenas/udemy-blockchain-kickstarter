import assert from "assert";
import ganache from "ganache-cli";
import Web3 from "web3";

import compiledFactory from "../ethereum/build/CampaignFactory.json";
import compiledCampaign from "../ethereum/build/Campaign.json";

// const { abi, evm } = lottery;
const provider = ganache.provider();
const web3 = new Web3(provider);

describe("Campaigns Contract", () => {
  let accounts;
  let factory;
  let campaignAddress;
  let campaign;
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object })
      .send({ from: accounts[0], gas: "5000000" });
    await factory.methods.createCampaign("100").send({
      from: accounts[0],
      gas: "5000000",
    });
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
    factory.setProvider(provider);
    campaign.setProvider(provider);
  });

  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("allows people tp contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "90",
        from: accounts[2],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "1000", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy batteries", request.description);
    assert.equal("1000", request.value);
    assert.equal(accounts[1], request.recipient);
    assert.equal(false, request.complete);
  });

  it("processes requesst", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    const recipient = accounts[4];
    const transferAmount = web3.utils.toWei("5", "ether");
    await campaign.methods.createRequest("a", transferAmount, recipient).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    const initialBalance = +web3.utils.toWei("100", "ether");
    const resultBalance = await web3.eth.getBalance(recipient);

    assert.equal(initialBalance + +transferAmount, +resultBalance);
  });
});
