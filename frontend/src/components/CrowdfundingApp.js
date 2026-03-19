/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { connectWallet, signTx } from "../freighter.js";
import * as StellarSdk from "@stellar/stellar-sdk";

const CONTRACT_ID = "CA7Q5MJS4QPBMHUG6Q2WOE3N666NADCGQN4RPMYU6Z5DZI5VHKPX6S4R";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const ALICE_ADDRESS = "GBG3W7PXLJTJJRTL7KSORWALYZPISUBDBOBPIBVEDDBNOGHTABBQ5CBO";

const server = new StellarSdk.rpc.Server(RPC_URL);

function CrowdfundingApp() {
  const [wallet, setWallet] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [donateAmount, setDonateAmount] = useState("");

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      const account = await server.getAccount(ALICE_ADDRESS);
      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call("get_campaigns"))
        .setTimeout(30)
        .build();

      const sim = await server.simulateTransaction(tx);
      if (StellarSdk.rpc.Api.isSimulationSuccess(sim)) {
        const result = StellarSdk.scValToNative(sim.result.retval);
        setCampaigns(result);
      }
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
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      const account = await server.getAccount(wallet);

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call(
          "create_campaign",
          StellarSdk.nativeToScVal(title, { type: "string" }),
          StellarSdk.nativeToScVal(description, { type: "string" }),
          StellarSdk.nativeToScVal(BigInt(parseFloat(goal) * 10_000_000), { type: "i128" }),
          StellarSdk.nativeToScVal(BigInt(1000), { type: "u64" }),
          StellarSdk.nativeToScVal(wallet, { type: "address" }),
        ))
        .setTimeout(30)
        .build();

      const sim = await server.simulateTransaction(tx);
      const prepTx = StellarSdk.rpc.assembleTransaction(tx, sim).build();
      const signed = await signTx(prepTx.toXDR());
      const finalTx = StellarSdk.TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE);
      await server.sendTransaction(finalTx);

      setTitle(""); setDescription(""); setGoal("");
      setTimeout(loadCampaigns, 3000);
      alert("Campaign created!");
    } catch (e) {
      console.error(e);
      alert("Error: " + e.message);
    }
    setLoading(false);
  };

  const handleDonate = async (campaignId) => {
    if (!wallet) return alert("Connect wallet first!");
    setLoading(true);
    try {
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      const account = await server.getAccount(wallet);

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call(
          "donate",
          StellarSdk.nativeToScVal(campaignId, { type: "u32" }),
          StellarSdk.nativeToScVal(BigInt(parseFloat(donateAmount) * 10_000_000), { type: "i128" }),
          StellarSdk.nativeToScVal(wallet, { type: "address" }),
        ))
        .setTimeout(30)
        .build();

      const sim = await server.simulateTransaction(tx);
      const prepTx = StellarSdk.rpc.assembleTransaction(tx, sim).build();
      const signed = await signTx(prepTx.toXDR());
      const finalTx = StellarSdk.TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE);
      await server.sendTransaction(finalTx);

      setTimeout(loadCampaigns, 3000);
      alert("Donated!");
    } catch (e) {
      console.error(e);
      alert("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🚀 Crowdfunding dApp</h1>
      <p style={{ color: "gray" }}>Powered by Stellar & Soroban</p>

      <div style={{ marginBottom: "30px" }}>
        {!wallet ? (
          <button onClick={handleConnect} style={btnStyle("#6366f1")}>
            Connect Freighter Wallet
          </button>
        ) : (
          <p>✅ Connected: <code>{wallet.slice(0, 10)}...{wallet.slice(-6)}</code></p>
        )}
      </div>

      <div style={cardStyle}>
        <h2>Create Campaign</h2>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
        <input placeholder="Goal (in XLM)" value={goal} onChange={e => setGoal(e.target.value)} style={inputStyle} type="number" />
        <button onClick={handleCreate} disabled={loading} style={btnStyle("#22c55e")}>
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </div>

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
            <p>👤 Creator: <code>{String(c.creator).slice(0, 10)}...</code></p>
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
