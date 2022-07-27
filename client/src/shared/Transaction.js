import { ethers } from "ethers";
import { setGlobalState } from "../store";

import { trContractAbi, trContractAddress } from "../utils/constants";

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  if (signer)
    signer.getBalance().then((balance) => {
      const ETHBalance = ethers.utils.formatEther(balance);
      setGlobalState("balance", ETHBalance);
    });
  const transactionContract = new ethers.Contract(trContractAddress, trContractAbi, signer);

  return transactionContract;
};

const isWalletConnected = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length) {
      setGlobalState("connectedAccount", accounts[0]);
    } else {
      console.log("No accounts found.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("No ethereum object.");
  }
};

const checkIfTransactionExist = async () => {
  try {
    const transactionContract = getEthereumContract();
    const transactionCount = await transactionContract.getTransactionsCount();

    window.localStorage.setItem("transactionCount", transactionCount);
  } catch (error) {
    console.log(error);
    throw new Error("No ethereum object.");
  }
};

const connectWallet = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setGlobalState("connectedAccount", accounts[0]);
  } catch (error) {
    console.log(error);
    throw new Error("No ethereum object.");
  }
};

const sendMoney = async ({ connectedAccount, address, amount, remark }) => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const transactionContract = getEthereumContract();
    const parsedAmount = ethers.utils.parseEther(amount);

    await ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: connectedAccount,
          to: address,
          gas: "0x5208",
          value: parsedAmount._hex,
        },
      ],
    });

    const transactionHash = await transactionContract.sendMoney(address, parsedAmount, remark);
    await transactionHash.wait();

    const transactionCount = await transactionContract.getTransactionsCount();
    setGlobalState("transactionCount", transactionCount.toNumber());

    window.location.reload();
  } catch (error) {
    console.log(error);
    throw new Error("No ethereum object.");
  }
};

const getAllTransactions = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const transactionContract = getEthereumContract();
    const availableTransactions = await transactionContract.getAllTransactions();

    const structuredTransactions = availableTransactions
      .map((tr) => ({
        receiver: tr.receiver,
        sender: tr.sender,
        timestamp: new Date(tr.timestamp.toNumber() * 1000).toLocaleString(),
        remark: tr.remark,
        amount: parseInt(tr.amount._hex) / 10 ** 18,
      }))
      .reverse();

    setGlobalState("transactions", structuredTransactions);
    return structuredTransactions;
  } catch (error) {
    console.log(error);
    throw new Error("No ethereum object.");
  }
};

export {
  getEthereumContract,
  isWalletConnected,
  checkIfTransactionExist,
  connectWallet,
  sendMoney,
  getAllTransactions,
};
