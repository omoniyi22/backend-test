import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import Loader from "./Loader";
import { Header } from "./Header";
import Transactions from "./Transactions";

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
    <input
        placeholder={placeholder}
        type={type}
        step="0.0001"
        value={value}
        onChange={(e) => handleChange(e, name)}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);

export const PaymentPage = () => {
    const { currentAccount, connectWallet, disconnectWallet, handleChange, balance, sendTransaction, formData, isLoading } = useContext(TransactionContext);

    const handleSubmit = (e) => {
        const { addressTo, amount, keyword, message } = formData;

        e.preventDefault();

        if (!addressTo || !amount || !message) alert("Fill all fields.")
        

        sendTransaction();
    };

    return (
        <div className="payment-page min-h-full">
            <Header />
            <div className="flex w-full justify-center items-center flex-col">
                <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                    {currentAccount && <div className='data-details block  mt-0 min-w-100 min-w-[100%]'>
                        {/* <div className='p-1 mb-2'> Welcome to @{username}</div> */}
                        <div className='email flex gap-4 mb-4 mx-2 pb-3 border-b min-w-100 '>
                            <div className="text-left">
                                <span className="shadow bg-gray-100 px-2 text-gray-800 text-xs font-medium inline-flex text-left pl-0 py-0.5 rounded me-2 dark:bg-gray-700 dark:text-gray-400 border border-gray-500 flex flex-col">
                                    <span className="text-left  mx-0 px-0 py-0 -mb-2">Wallet Address</span>
                                    <br />
                                    <span className="text-bold">  {currentAccount && `${currentAccount.slice(0, 37)}...`}</span>
                                    {/* <div>{address}</div> */}
                                </span>
                            </div>
                            <div className="text-left ml-auto">
                                <span className="shadow bg-gray-100 px-2 text-gray-800 text-xs font-medium inline-flex text-left pl-0 py-0.5 rounded me-1 dark:bg-gray-700 dark:text-gray-400 border border-gray-500 flex flex-col">
                                    <span className="  mx-0 px-0 py-0 -mb-2 text-left">Balance</span>
                                    <br />
                                    <span className="text-bold">  {balance && (balance / 10 ** 18).toLocaleString()} ETH</span>
                                    {/* <div>{address}</div> */}
                                </span>
                            </div>
                        </div>
                    </div>}
                    <div className="flex flex-row flex-1 items-center justify-start w-full mf:mt-0 ">
                        <div className="px-5 pb-5 pt-4 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism shadow-2xl">
                            <div className="pb-4 py-2">
                                {!currentAccount ?
                                    <button
                                        type="button"
                                        className="flex font-bold flex-row justify-center items-center bg-[#E72173] mx-auto p-3 py-2 text-white rounded-full cursor-pointer hover:bg-[#E72173]"
                                        onClick={connectWallet}
                                    >
                                        Connect Wallet
                                    </button> :

                                    <button
                                        type="button"
                                        onClick={disconnectWallet}
                                        className="flex font-bold flex-row justify-center items-center bg-[#199ae5] mx-auto p-3 py-2 text-white rounded-full cursor-pointer hover:bg-[rgb(25,147,229)]"
                                    >
                                        Disconnect Wallet
                                    </button>
                                }
                            </div>
                            <Input placeholder="Address To" value={formData.addressTo} name="addressTo" type="text" handleChange={handleChange} />
                            <Input placeholder="Amount (ETH)" name="amount" type="number" value={formData.amount} handleChange={handleChange} />
                            {/* <Input placeholder="Keyword (Gif)" name="keyword" type="text" value={formData.keyword} handleChange={handleChange} /> */}
                            <Input placeholder="Enter Message" name="message" type="text" value={formData.message} handleChange={handleChange} />

                            <div className="h-[1px] w-full bg-gray-400 my-2" />

                            {isLoading
                                ? <Loader />
                                : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                                    >
                                        Send now
                                    </button>
                                )}
                        </div>
                    </div>

                </div>
            </div>

            <Transactions />
            Transaction
        </div>
    )
}