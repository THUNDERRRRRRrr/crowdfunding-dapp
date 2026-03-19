import React, { useState, useEffect } from "react";
import { connectWallet } from "../freighter.js";
import * as Client from "crowdfunding";

const contract = new Client.Client({
  ...Client.networks.testnet,
  rpcUrl: "https://soroban-testnet.stellar.org:443",
});

function CrowdfundingApp() {
  const [wallet, setWallet] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [donateAmount, setDonateAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const { result } = await contract.get_campaigns();
      setCampaigns(result);
    } catch (e) {
      console.error("Error loading campaigns:", e);
    }
  };

  const handleConnect = async () => {
    const address = await connectWallet();
    setWallet(address);
  };

  const handleCreate = async () => {
    if (!wallet) return alert("Connect wallet first!");
    setLoading(true);
    try {
      const tx = await contract.create_campaign({
        title,
        description,
        goal: BigInt(parseFloat(goal) * 10_000_000),
        deadline: BigInt(1000),
        creator: wallet,
      });
      await tx.signAndSend();
      setTitle("");
      setDescription("");
      setGoal("");
      await loadCampaigns();
      alert("Campaign created!");
    } catch (e) {
      console.error(e);
      alert("Error creating campaign");
    }
    setLoading(false);
  };

  const handleDonate = async (campaignId) => {
    if (!wallet) return alert("Connect wallet first!");
    setLoading(true);
    try {
      const tx = await contract.donate({
        campaign_id: campaignId,
        amount: BigInt(parseFloat(donateAmount) * 10_000_000),
        donor: wallet,
      });
      await tx.signAndSend();
      await loadCampaigns();
      alert("Donated successfully!");
    } catch (e) {
      console.error(e);
      alert("Error donating");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🚀 Crowdfunding dApp</h1>
      <p style={{ color: "gray" }}>Powered by Stellar & Soroban</p>

      {/* Wallet Connect */}
      <div style={{ marginBottom: "30px" }}>
        {!wallet ? (
          <button onClick={handleConnect} style={btnStyle("#6366f1")}>
            Connect Freighter Wallet
          </button>
        ) : (
          <p>✅ Connected: <code>{wallet.slice(0, 10)}...{wallet.slice(-6)}</code></p>
        )}
      </div>

      {/* Create Campaign */}
      <div style={cardStyle}>
        <h2>Create Campaign</h2>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
        <input placeholder="Goal (in XLM)" value={goal} onChange={e => setGoal(e.target.value)} style={inputStyle} type="number" />
        <button onClick={handleCreate} disabled={loading} style={btnStyle("#22c55e")}>
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </div>

      {/* Campaigns List */}
      <h2>All Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns yet. Create one!</p>
      ) : (
        campaigns.map((c, i) => (
          <div key={i} style={cardStyle}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p>🎯 Goal: {(Number(c.goal) / 10_000_000).toFixed(2)} XLM</p>
            <p>💰 Raised: {(Number(c.raised) / 10_000_000).toFixed(2)} XLM</p>
            <p>👤 Creator: <code>{c.creator.slice(0, 10)}...</code></p>
            <input
              placeholder="Donate amount (XLM)"
              value={donateAmount}
              onChange={e => setDonateAmount(e.target.value)}
              style={inputStyle}
              type="number"
            />
            <button onClick={() => handleDonate(c.id)} disabled={loading} style={btnStyle("#f59e0b")}>
              {loading ? "Donating..." : "Donate"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const cardStyle = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "20px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  boxSizing: "border-box",
};

const btnStyle = (color) => ({
  background: color,
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
});

export default CrowdfundingApp;
