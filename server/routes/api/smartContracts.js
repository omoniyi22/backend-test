const express = require('express');
const ethers = require('ethers');
const { contractAddress, PRIVATE_KEY, SEPOLIA_RPC_URL, abi } = require("./../../utils/keys")
const router = express.Router();
const Moralis = require("moralis").default

const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL)

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contractInstance = new ethers.Contract(contractAddress, abi, wallet)



// @route    GET api/transactions/:address
// @desc     Get all my transactions

router.get('/transactions/:address', async (req, res) => {
    try {
        const { address } = req.params
        const availableTransactions = await contractInstance.getAllTransactions()
        console.log(availableTransactions[0])
        const structuredTransactions = await availableTransactions
            .map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: (Number(transaction.amount) / 1e18).toFixed(4)

            }))
            .filter(data => data.addressFrom.toLowerCase() == address.toLowerCase())
        console.log({ structuredTransactions })
        console.log({ address })

        res.json(structuredTransactions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// @route    GET api/wallet-balance/:address
// @desc     Get all an address wallet-balance


router.get('/wallet-balance/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const response = await Moralis.EvmApi.balance.getNativeBalance({
            chain: "0xaa36a7",
            address: address,
        })
        return res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
