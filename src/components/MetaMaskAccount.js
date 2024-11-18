// src/components/MetaMaskAccount.js
import React, { useState, useEffect } from "react";

const MetaMaskAccount = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccount(accounts[0]);
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      setError("Please install MetaMask to use this app.");
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {account ? (
        <div>
          <h3>Connected Account:</h3>
          <p>{account}</p>
        </div>
      ) : (
        <p>Connecting to MetaMask...</p>
      )}
    </div>
  );
};

export default MetaMaskAccount;
