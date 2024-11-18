import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractABI from "../ContractABI.json";

const FarmerPage = () => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [cropQuantity, setCropQuantity] = useState("");
  const [price, setPrice] = useState("");

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

  const createAgreement = async () => {
    if (contract && account) {
      try {
        await contract.methods
          .createAgreement(account, cropQuantity, price)
          .send({ from: account });
        alert("Agreement created successfully!");
      } catch (error) {
        alert("Error creating agreement.");
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1>Farmer Dashboard</h1>
      <p>Connected Account: {account}</p>
      <input
        type="number"
        value={cropQuantity}
        onChange={(e) => setCropQuantity(e.target.value)}
        placeholder="Enter Crop Quantity"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter Price"
      />
      <button onClick={createAgreement}>Create Agreement</button>
    </div>
  );
};

export default FarmerPage;
