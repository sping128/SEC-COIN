const path = require("path");
const solc = require("solc");
const fs = require("fs");
const beautify = require("json-beautify");

module.exports = {
  createConfiguration: cNames => {
    console.log('Contract filename list', cNames);
    const config = {};
    config['language'] = "Solidity";
    config['sources'] = {};
    for(let cName of cNames) {
      config['sources'][cName + ".sol"] = {
        content: fs.readFileSync(path.resolve(__dirname, "..", "contracts", cName + ".sol"), "utf8")
      }
    }
    config['settings'] = {
          outputSelection: {
            // return everything
            "*": {
              "*": ["*"]
            }
          }
        };
    return config;
  },
  compileSources: config => {
    try {
      return JSON.parse(solc.compile(JSON.stringify(config)));
    } catch (e) {
      console.log(e);
    }
  },
  printCompileErrors: compiledSources => {
    if (!compiledSources) {
      console.error("No compiled output for contract");
    } else if (compiledSources.errors) {
      // something went wrong.
      compiledSources.errors.map(error =>
        console.error(error.formattedMessage)
      );
    }
  },
  getContractDataList: (compiledSource, cNames) => {
    if (compiledSource) {
      try {
        const dataList = {};
        let artifact;
        for (let cName of cNames) {
          dataList[cName] = {
            "abi":      compiledSource.contracts[cName + ".sol"][cName]['abi'],
            "bytecode": compiledSource.contracts[cName + ".sol"][cName]['evm']['bytecode']['object']
          };
          artifact = {};
          artifact["contractName"] = cName;
          artifact["abi"] = compiledSource.contracts[cName + ".sol"][cName]['abi'];
          artifact["evm"] = {};
          artifact["evm"]["bytecode"] = compiledSource.contracts[cName + ".sol"][cName]['evm']['bytecode'];
          artifact["evm"]["deployedBytecode"] = compiledSource.contracts[cName + ".sol"][cName]['evm']['deployedBytecode'];
          artifact["evm"]["gasEstimates"] = compiledSource.contracts[cName + ".sol"][cName]['evm']['gasEstimates'];
          artifact["evm"]["external"] = compiledSource.contracts[cName + ".sol"][cName]['evm']['external'];
          artifact["evm"]["internal"] = compiledSource.contracts[cName + ".sol"][cName]['evm']['internal'];
          delete artifact["evm"]["bytecode"]["opcodes"];
          delete artifact["evm"]["deployedBytecode"]["opcodes"];
          const content = beautify(artifact, null, 2, 80);
          fs.writeFileSync('build/' + cName + '.json', content);
        }
        return dataList;
      } catch (err) {
        console.error("could not retrieve contract data", err)
      }
    }
  }
};
