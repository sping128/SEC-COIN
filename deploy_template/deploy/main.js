const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://tendermint-dev.sec.or.th/"));
const BN = web3.utils.BN;
const abi = require("../build/WhoCoin2.json").abi;
const Common = require('ethereumjs-common');    // used to sign transaction
const Tx = require('ethereumjs-tx').Transaction;    // used to sign transaction

// Get main account #0
async function getCurrentAccount() {
    const currentAccounts = await web3.eth.getAccounts();
    console.log("Unlocked account address: \t", currentAccounts[0]);
    return currentAccounts[0];
}

// Get all accounts => array of account address
async function getAccounts() {
    return web3.eth.getAccounts()
        .catch(err => console.error(err));
}

// Get ether balance
// Parameter: account (address)
async function getBalance(account) {
    return web3.eth.getBalance(account)
        .catch(err => console.error(err));
}

async function getTokenBalances(ci) {
    const accounts = await getAccounts();
    result = [];
    for (let account of accounts) {
        const balance = await getTokenBalance(ci, account);
        result.push({ 'address': account, 'balance': balance });
    }
    return result;
}

async function getTokenBalance(ci, account) {
    return ci.methods.balanceOf(account).call().catch(err => console.log(err));
}

// Get balances of all accounts
async function getBalances() {
    const accounts = await getAccounts();
    result = [];
    for (let account of accounts) {
        const balance = await getBalance(account);
        result.push({ 'address': account, 'balance': balance });
    }
    return result;
}

async function transferToken(ci, from, to, amount, fromPrivateKey) {
    const encodedTx = ci.methods.transfer(to, amount).encodeABI();
    const gas = await ci.methods.transfer(to, amount).estimateGas();
    const privateKey = Buffer.from(fromPrivateKey, 'hex');
    const nonce = await web3.eth.getTransactionCount(from); // # transactions ที่เคยส่งจาก from

    // สร้าง transaction ดิบ ยังไม่มีการ sign
    const rawTx = {
        nonce: nonce,
        from: from,
        to: ci.options.address,  // ส่งไปหา contract address
        data: encodedTx,
        gas: new BN(gas).mul(new BN('1.5')) // BN (Big number) จ่าย gas เผื่อ 50%
    }

    const customCommon = Common.default.forCustomChain(
        'mainnet', {
            name: 'localtestnet',
            chainId: 8
        },
        'petersburg'
    )
    const tx = new Tx(rawTx, { common: customCommon } );
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('transactionHash', txHash => console.log(txHash))
        .catch(error => console.log(error));
}


async function run() {
    const myAccount = '0x98b52Cbab029de03BABDc30d33020c65F9214cF0';
    const myPrivateKey = '1ABCF8E92DE2392ED04902677A0822A26F1F993AE359FCE7A5FA98725400B0C1';
    const tokenAddress = '0xf42035FfAbB32e9439cBea2B21F656Dbfad85F8A';
    const balances = await getBalances();
    // console.log(balances);
    // console.log(abi);

    const cInstance = new web3.eth.Contract(abi, tokenAddress);
    // console.log(cInstance);
    
    const myTokenBalance = await getTokenBalances(cInstance, myAccount);
    // console.log(myTokenBalance);

    const allTokenBalances = await getTokenBalances(cInstance);
    console.log(allTokenBalances)

    // const transferResult = await transferToken(cInstance, myAccount, '0x85a9E0Cc63481655a589a0D9EFCc5eb299647171', '22', myPrivateKey);
}

run();