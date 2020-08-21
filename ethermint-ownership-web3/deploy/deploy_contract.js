const Web3 = require("web3");
const utils = require("./compile_utils");
const {names, main} = require('./contract_names.json');
const fs = require('fs');
const beautify = require('json-beautify')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const BN = web3.utils.BN;

const privKey = "5E05FE74825D916FCF882E81F8A4589C685EBA941C9DDE5D9E72CBD166C8F811";
const user1_privKey = '4B38C30D2306884CDD03A4F13CFABD2B4E43DA7EC33832D8045D5D5D71114EBA';
const user2_privkey = 'A5BCD59F7FED3F336007390A31857230563F2C293FEDCE9927384B71D1765965';

// const local_privKey = "F9E62C50C94C540D7AEFAE128E26282117DF9D17D8922A5FC928F4A9BCE5A65B";
// const local_user1 = "8BF109C2F9CDBA211599AE488F9567EB3383269ED48FBAAAC347CACF5058BB03";
// const local_user2 = "0907D1E2EC46482F94140FC4D3BA11566FD066A270A8C7223595DB72491870DD";

async function getCurrentAccount() {
  const currentAccounts = await web3.eth.getAccounts();
  console.log("Unlocked account address: \t", currentAccounts[0]);
  return currentAccounts[0];
}

async function deployContract(contractData, sender) {
  const contract = new web3.eth.Contract(contractData.abi);
  const deployData = "0x" + contractData.bytecode;
  const estimatedGas = await contract.deploy({ data: deployData }).estimateGas();
  console.log('Estimated gas', estimatedGas)
  return contract
    .deploy({ data: deployData })
    .send({ // work with docker tendermint
      from: sender,
      gas: new BN(estimatedGas).mul(new BN('1.5')).toString()
    })
    .on('error', err => {
      console.log('FAILED: there are errors:', err);
        process.exit();
    })
    .on('transactionHash', txHash => console.log('tx hash:', txHash))
    .on('receipt', recpt => console.log('contract addres:', recpt.contractAddress))
    .then(function (contractInstance) {
      console.log(
        "Deployed contract Address: \t",
        contractInstance.options.address
      );
      const contractInfo = {};
      contractInfo['address'] = contractInstance.options.address;
      fs.writeFileSync('info/ContractInfo.json', beautify(contractInfo, null, 2, 80));
      return contractInstance;
    })
    .catch(function (err) {
      console.error(err);
      process.exit();
    })
}

async function getAccounts() {
  return web3.eth.getAccounts()
    .catch(err => console.error(err));
}

async function getBalance(account) {
  return web3.eth.getBalance(account)
    .catch(err => console.error(err));
}

async function getBalances() {
  const accounts = await getAccounts();
  result = [];
  for(let account of accounts) {
    const balance = await getBalance(account);
    result.push({ 'address': account, 'balance': balance });
  }
  return result;
}

async function run(cNames, mainContract) {
  // Compile contract
  console.log("Compiling contract code...");
  const config = utils.createConfiguration(cNames);
  const compiled = utils.compileSources(config);
  utils.printCompileErrors(compiled);
  // contractData = utils.getCounterContractData(compiled);
  const contractData = utils.getContractDataList(compiled, cNames)[mainContract];
  if (contractData == undefined) {
    console.log("could not retrieve compiled contract data");
    process.exit();
  }

  // Deploy and interact with accounts on node
  const sender = await getCurrentAccount();
  console.log("Deploying contract...");
  const contract = await deployContract(contractData, sender);  
  const accounts = await getAccounts(contract);
  console.log("Accounts: ", accounts);

  const balances = await getBalances();
  console.log("Balances\n", balances);
}

run(names, main);
