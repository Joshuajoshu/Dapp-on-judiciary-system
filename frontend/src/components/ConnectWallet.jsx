import React, { useState, useEffect } from "react";
import { connectWallet, checkWalletConnection } from "../blockchain";

const ConnectWallet = () => {
    console.log("hai");
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      const account = await checkWalletConnection();
      if (account) setWalletAddress(account);
    };
    fetchWallet();
  }, []);

  const handleConnect = async () => {
    const account = await connectWallet();
    if (account) setWalletAddress(account);
  };

  return (
    
    <div>
        
      {walletAddress ? (
        <p>🟢 Connected: {walletAddress}</p>
      ) : (
        <button onClick={handleConnect}>🔗 Connect Metamask</button>
      )}
    </div>
  );
};

export default ConnectWallet;
