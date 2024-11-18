import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../ContractABI.json";

const BuyerPage = () => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [agreementId, setAgreementId] = useState("");

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

  const viewAgreement = async () => {
    if (contract && agreementId) {
      try {
        const agreement = await contract.methods
          .agreements(agreementId)
          .call();
        alert(`Agreement Details: Farmer: ${agreement.farmer}, Price: ${agreement.price}`);
      } catch (error) {
        alert("Error fetching agreement.");
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1>Buyer Dashboard</h1>
      <p>Connected Account: {account}</p>
      <input
        type="number"
        value={agreementId}
        onChange={(e) => setAgreementId(e.target.value)}
        placeholder="Enter Agreement ID"
      />
      <button onClick={viewAgreement}>View Agreement</button>
    </div>
  );
};

export default BuyerPage;
