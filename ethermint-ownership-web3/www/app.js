var express = require("express");
var app = express();  
var server = require("http").createServer(app);
var abi = require('../build/Proof.json').abi;
var io = require("socket.io")(server);
var port = 8080;
var contractInfo = require('../info/ContractInfo.json');

server.listen(port);
// app.listen(port);

console.log('web server started at ', port);

app.use(express.static("public"));
app.get("/", (req, res)=> {
	res.sendFile(__dirname + "/public/html/index.html");
})

var Web3 = require("web3");
const BN = Web3.utils.BN;

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));	

web3.eth.getAccounts((err, accounts) => {
	if(err)
		process.exit(1);
	const proof = new web3.eth.Contract(abi, contractInfo.address);

	app.get("/submit", (req, res) => {
		var fileHash = req.query.hash;
		var owner = req.query.owner;

		proof.methods.set(owner, fileHash).estimateGas((err, gas) => {
			if(err)
				res.send(err);
			else {
				proof.methods.set(owner, fileHash).send({
					from: accounts[0],
					gas: new BN(gas).mul(new BN('1.5')).toString()
				})
				.on('transactionHash', txHash => res.send(txHash))
				.on('receipt', receipt => io.send(receipt))
				.on('error', err => console.log(err));
			}
		});
	});

	app.get("/getInfo", (req, res) => {
		var fileHash = req.query.hash;
		proof.methods.get(fileHash).call()
			.then(result => res.send(result))
			.catch(err => console.log(error));
	});
});