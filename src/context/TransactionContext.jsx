import React, { useState } from "react";

import { ethers } from "ethers";

import { toast } from 'react-toastify';

import { API_URL, contractABI, contractAddress } from "../utils/constant"
import axios from "axios";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = async () => {
    try {
        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner();
        const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

        return ({
            provider,
            signer,
            transactionContract
        })
    } catch (error) {
        console.log(error)
    }
}

export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState("")
    const [balance, setBalance] = useState(0)
    const [transactions, setCurrentTransactions] = useState([])
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" })
    const [trasactions, setTransactions] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"))

    const handleChange = (e, name) => {
        setFormData((prevState) => ({
            ...prevState, [name]: e.target.value
        }))
    }

    const disconnectWallet = async () => {
        setCurrentAccount("");
        setCurrentTransactions([]);
        toast("Wallet disconnected");
        localStorage.removeItem("transactionCount");

    };


    const getAllTransactions = async () => {
        try {
            if (currentAccount) {                
                let response = await axios.get(`${API_URL}/api/smart-contracts/transactions/${currentAccount}`)
                const data = await response.data
                setCurrentTransactions(data)
            } else {
                toast("No accounts found")
            }
        } catch (error) {
            console.log({ balance: error })
            toast("No ethereum object.")
        }
    }



    const checkBalance = async () => {
        try {

            if (currentAccount) {
                // setCurrentAccount(accounts[0])

                let response = await axios.get(`${API_URL}/api/smart-contracts/wallet-balance/${currentAccount}`)
                const data = await response.data.balance

                setBalance(data)
            } else {
                toast("No accounts found")
            }
        } catch (error) {
            console.log({ balance: error })
            toast("No ethereum object.")
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return toast("Please install metamask");
            // get the data from the form...
            const { addressTo, amount, message } = formData;

            const parsedAmount = ethers.parseEther(amount)
            // console.log({ parsedAmount, addressTo, amount, keyword, message })

            const { transactionContract } = await getEthereumContract();
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", // 21000 GWEI
                    value: parsedAmount._hex, // 0.00001
                }]
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, "keyword");
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait();
            setIsLoading(false);
            const transactionCount = await transactionContract.getTransactionCount()
            console.log({ transactionCount })
            setTransactionCount(transactionCount)
            await getAllTransactions()
            toast(`${amount} Sent successfully. Check your latest transaction section to view details`)
            setFormData({ addressTo: "", amount: "", keyword: "", message: "" })
        } catch (error) {
            console.log({ error })
        }
    }




    const checkIfTransactionExist = async () => {
        try {
            const { transactionContract } = await getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount()

            window.localStorage.setItem("transactionCount", transactionCount)
        } catch (error) {
            console.log(error)
            toast("No ethereum object.")
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return toast(" Please install metamask")
            const accounts = await ethereum.request({ method: "eth_requestAccounts" })

            setCurrentAccount(accounts[0])

            await getAllTransactions();
            toast("Wallet Connected")
            console.log(accounts)
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object.")
        }
    }

    React.useEffect(() => {
        // checkIfWalletIsConnected();
        checkBalance()
        getAllTransactions()
        checkIfTransactionExist();
    }, [currentAccount])

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, sendTransaction, transactions, isLoading, disconnectWallet, balance }}>
            {children}
        </TransactionContext.Provider>
    )
}