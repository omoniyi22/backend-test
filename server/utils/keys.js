require('dotenv').config();



module.exports.PRIVATE_KEY = process.env.PRIVATE_KEY
module.exports.SEPOLIA_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/j4oWSHx2NBXE2c6PGR770iSxmyNC_reU"

module.exports.contractAddress = "0xc3Ee820D2DbDa89BeB5cEA7E90D67079Bec0dC24"
module.exports.abi = require("./Transactions.json").abi
module.exports.MORALIS_API_KEY = process.env.MORALIS_API_KEY;
