import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminPage from "./components/AdminPage";
import FarmerPage from "./components/FarmerPage";
import BuyerPage from "./components/BuyerPage";
import RoleSelectionPage from "./components/RoleSelectionPage";

// Import contract ABI and address
import FarmingAgreementABI from "./contracts/FarmingAgreement.json";
import contractAddress from "./contracts/contractAddress.json";

function App() {
  const [account, setAccount] = useState(null); // Track current account
  const [web3, setWeb3] = useState(null); // Track Web3 instance
  const [contract, setContract] = useState(null); // Track the contract instance
  const [etherAmount, setEtherAmount] = useState(""); // Track the Ether input field value
  const [transactionSuccess, setTransactionSuccess] = useState(""); // Track transaction success message

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      window.ethereum.request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccount(accounts[0]); // Set the current account on initial load
        })
        .catch((err) => {
          console.error("Error fetching accounts:", err);
        });

      const contractInstance = new web3Instance.eth.Contract(
        FarmingAgreementABI,
        contractAddress.address
      );
      setContract(contractInstance);

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
    } else {
      console.log("MetaMask is not installed!");
    }
  }, []);

  // Function to handle creating the agreement and sending Ether to the buyer
  const handleCreateAgreement = async (farmerAddress, buyerAddress, cropQuantity) => {
    if (!contract || !account || !etherAmount) {
      console.error("Contract, Account, or Ether Amount is not available");
      return;
    }

    const priceInWei = web3.utils.toWei(etherAmount, "ether"); // Convert Ether to Wei

    console.log("Account (sender):", account);
    console.log("Buyer address (receiver):", buyerAddress); // Ensure this is different from account

    try {
      // Create the agreement by interacting with the contract
      const response = await contract.methods.createAgreement(farmerAddress, buyerAddress, cropQuantity, priceInWei)
        .send({ from: account, value: priceInWei });

      // Send Ether to the buyer address
      const tx = await web3.eth.sendTransaction({
        from: account,
        to: buyerAddress, // Ensure this is the correct buyer address
        value: priceInWei, // Send the same amount in Wei
      });

      console.log("Transaction to buyer successful:", tx);
      console.log("Contract interaction response:", response);

      // Set success message
      setTransactionSuccess(`Transaction Successful! ${etherAmount} ETH sent to buyer.`);
    } catch (error) {
      console.error("Transaction failed:", error);
      setTransactionSuccess("Transaction Failed. Please try again.");
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Select Your Role</h1>
          <h3>Connected Account: {account ? account : "Not connected"}</h3>
          <Routes>
            <Route path="/" element={<RoleSelectionPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/farmer" element={<FarmerPage />} />
            <Route path="/buyer" element={<BuyerPage />} />
          </Routes>

          {/* Input field to specify the price (amount of Ether) */}
          <div>
            <label>Enter Price in ETH: </label>
            <input
              type="text"
              value={etherAmount}
              onChange={(e) => setEtherAmount(e.target.value)} // Update etherAmount when user types
              placeholder="Enter Ether amount"
            />
          </div>

          {/* Button to create the agreement with dynamic Ether amount */}
          <button
            onClick={() =>
              handleCreateAgreement(
                "0xa7B0424bf100D43811f05285cf15a6091c9d6717", // Farmer address (replace with actual address)
                "0x7c57b13190aDAC9EE2482eeCD8979D2274B652C5", // Buyer address (replace with actual address)
                1 // Crop Quantity (example, you can modify based on your input fields)
              )
            }
          >
            Create Agreement with {etherAmount} ETH
          </button>

          {/* Display the transaction success message */}
          {transactionSuccess && (
            <div style={{ marginTop: '20px', color: transactionSuccess.includes("Successful") ? 'green' : 'red' }}>
              {transactionSuccess}
            </div>
          )}
        </header>
      </div>
    </Router>
  );
}

export default App;
