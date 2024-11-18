import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../ContractABI.json";

const AdminPage = () => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(
          contractABI.abi,
          contractABI.address
        );
        setContract(contractInstance);
      } else {
        alert("Please install MetaMask!");
      }
    };
    loadBlockchainData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Connected Account: {account}</p>
      {/* Admin functionalities, e.g., manage contracts, users, etc. */}
      <div>
        <h2>Admin Functions</h2>
        <button>Manage Agreements</button>
        <button>View All Users</button>
        {/* Other admin actions */}
      </div>
    </div>
  );
};

export default AdminPage;
