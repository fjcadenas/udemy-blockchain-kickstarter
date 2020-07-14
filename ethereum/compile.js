import path from "path";
import solc from "solc";
import fs from "fs-extra";

const CONTRACT_FILENAME = "Campaign.sol";

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);
const campaignPath = path.resolve(__dirname, "contracts", CONTRACT_FILENAME);
const source = fs.readFileSync(campaignPath, "utf-8");

const compilerInput = {
  language: "Solidity",
  sources: {
    [CONTRACT_FILENAME]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(compilerInput)));
fs.ensureDirSync(buildPath);

const compiledContracts = output.contracts[CONTRACT_FILENAME];
for (let contract in compiledContracts) {
  fs.outputJSONSync(
    path.resolve(buildPath, `${contract}.json`),
    compiledContracts[contract]
  );
}
