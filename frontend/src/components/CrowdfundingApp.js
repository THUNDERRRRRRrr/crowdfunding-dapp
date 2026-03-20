/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { connectWallet, signTx } from "../freighter.js";
import * as StellarSdk from "@stellar/stellar-sdk";

const CONTRACT_ID = "CA7Q5MJS4QPBMHUG6Q2WOE3N666NADCGQN4RPMYU6Z5DZI5VHKPX6S4R";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const ALICE_ADDRESS = "GBG3W7PXLJTJJRTL7KSORWALYZPISUBDBOBPIBVEDDBNOGHTABBQ5CBO";

const server = new StellarSdk.rpc.Server(RPC_URL);

const D = {
  appBg: "linear-gradient(145deg,#141414,#1f1f1f,#191919)",
  navBg: "rgba(20,20,20,0.8)", navBorder: "1px solid rgba(255,255,255,0.07)",
  logo: "#e8e8e8", heroTitle: "#f2f2f2", heroSub: "rgba(255,255,255,0.35)",
  statsBg: "rgba(255,255,255,0.05)", statsBorder: "1px solid rgba(255,255,255,0.08)",
  statNum: "#e8e8e8", statLabel: "rgba(255,255,255,0.3)", statDiv: "rgba(255,255,255,0.07)",
  secLabel: "rgba(255,255,255,0.28)",
  cardBg: "rgba(255,255,255,0.05)", cardBorder: "1px solid rgba(255,255,255,0.09)",
  cardShadow: "0 16px 48px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.06)",
  cardTitle: "#f2f2f2", cardDesc: "rgba(255,255,255,0.4)",
  creatorBg: "rgba(255,255,255,0.06)", creatorBorder: "rgba(255,255,255,0.09)", creatorColor: "rgba(200,200,200,0.55)",
  sboxBg: "rgba(255,255,255,0.06)", sboxBorder: "rgba(255,255,255,0.09)", sboxNum: "#d4d4d4", sboxLabel: "rgba(255,255,255,0.28)",
  progBg: "rgba(255,255,255,0.07)", progFill: "rgba(255,255,255,0.45)",
  badgeBg: "rgba(255,255,255,0.07)", badgeBorder: "rgba(255,255,255,0.14)", badgeColor: "#ccc",
  doneBg: "rgba(180,180,180,0.1)", doneBorder: "rgba(180,180,180,0.22)", doneColor: "#aaa",
  donateBg: "rgba(255,255,255,0.1)", donateBorder: "rgba(255,255,255,0.18)", donateColor: "#fff",
  fundedText: "rgba(190,190,190,0.5)",
  themeBg: "rgba(255,255,255,0.07)", themeBorder: "1px solid rgba(255,255,255,0.12)", themeColor: "#ccc",
  walletBg: "rgba(255,255,255,0.1)", walletBorder: "1px solid rgba(255,255,255,0.18)", walletColor: "#fff",
  launchBg: "rgba(255,255,255,0.1)", launchBorder: "1px solid rgba(255,255,255,0.18)", launchColor: "#fff",
  inputBg: "rgba(255,255,255,0.06)", inputBorder: "1px solid rgba(255,255,255,0.1)", inputColor: "#f1f1f1",
};

const L = {
  appBg: "linear-gradient(145deg,#f5f5f5,#ececec,#f0f0f0)",
  navBg: "rgba(255,255,255,0.85)", navBorder: "1px solid rgba(0,0,0,0.07)",
  logo: "#111", heroTitle: "#111", heroSub: "rgba(0,0,0,0.4)",
  statsBg: "#ffffff", statsBorder: "1px solid #e0e0e0",
  statNum: "#111", statLabel: "rgba(0,0,0,0.38)", statDiv: "#e8e8e8",
  secLabel: "rgba(0,0,0,0.3)",
  cardBg: "#ffffff", cardBorder: "1px solid #e4e4e4",
  cardShadow: "0 4px 24px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  cardTitle: "#111", cardDesc: "rgba(0,0,0,0.5)",
  creatorBg: "#f4f4f4", creatorBorder: "#e4e4e4", creatorColor: "#666",
  sboxBg: "#f7f7f7", sboxBorder: "#e8e8e8", sboxNum: "#111", sboxLabel: "rgba(0,0,0,0.38)",
  progBg: "#ebebeb", progFill: "#111",
  badgeBg: "#f4f4f4", badgeBorder: "#ddd", badgeColor: "#444",
  doneBg: "#f4f4f4", doneBorder: "#ddd", doneColor: "#444",
  donateBg: "#111", donateBorder: "#111", donateColor: "#fff",
  fundedText: "rgba(0,0,0,0.38)",
  themeBg: "#f0f0f0", themeBorder: "1px solid #ddd", themeColor: "#111",
  walletBg: "#111", walletBorder: "1px solid #111", walletColor: "#fff",
  launchBg: "#111", launchBorder: "1px solid #111", launchColor: "#fff",
  inputBg: "#ffffff", inputBorder: "1px solid #e2e2e2", inputColor: "#111",
};

export default function CrowdfundingApp() {
  const [dark, setDark] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [donateAmount, setDonateAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const t = dark ? D : L;

  useEffect(() => { loadCampaigns(); }, []);

  const loadCampaigns = async () => {
    try {
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      const account = await server.getAccount(ALICE_ADDRESS);
      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: "100", networkPassphrase: NETWORK_PASSPHRASE,
      }).addOperation(contract.call("get_campaigns")).setTimeout(30).build();
      const sim = await server.simulateTransaction(tx);
      if (StellarSdk.rpc.Api.isSimulationSuccess(sim)) {
        setCampaigns(StellarSdk.scValToNative(sim.result.retval));
      }
    } catch (e) { console.error(e); }
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
        fee: "100", networkPassphrase: NETWORK_PASSPHRASE,
      }).addOperation(contract.call(
        "create_campaign",
        StellarSdk.nativeToScVal(title, { type: "string" }),
        StellarSdk.nativeToScVal(description, { type: "string" }),
        StellarSdk.nativeToScVal(BigInt(parseFloat(goal) * 10_000_000), { type: "i128" }),
        StellarSdk.nativeToScVal(BigInt(1000), { type: "u64" }),
        StellarSdk.nativeToScVal(wallet, { type: "address" }),
      )).setTimeout(30).build();
      const sim = await server.simulateTransaction(tx);
      const prepTx = StellarSdk.rpc.assembleTransaction(tx, sim).build();
      const signed = await signTx(prepTx.toXDR());
      const finalTx = StellarSdk.TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE);
      await server.sendTransaction(finalTx);
      setTitle(""); setDescription(""); setGoal(""); setDeadline("");
      setTimeout(loadCampaigns, 3000);
      alert("Campaign created!");
    } catch (e) { alert("Error: " + e.message); }
    setLoading(false);
  };

  const handleDonate = async (campaignId) => {
    if (!wallet) return alert("Connect wallet first!");
    setLoading(true);
    try {
      const contract = new StellarSdk.Contract(CONTRACT_ID);
      const account = await server.getAccount(wallet);
      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: "100", networkPassphrase: NETWORK_PASSPHRASE,
      }).addOperation(contract.call(
        "donate",
        StellarSdk.nativeToScVal(campaignId, { type: "u32" }),
        StellarSdk.nativeToScVal(BigInt(parseFloat(donateAmount) * 10_000_000), { type: "i128" }),
        StellarSdk.nativeToScVal(wallet, { type: "address" }),
      )).setTimeout(30).build();
      const sim = await server.simulateTransaction(tx);
      const prepTx = StellarSdk.rpc.assembleTransaction(tx, sim).build();
      const signed = await signTx(prepTx.toXDR());
      const finalTx = StellarSdk.TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE);
      await server.sendTransaction(finalTx);
      setTimeout(loadCampaigns, 3000);
      alert("Donated!");
    } catch (e) { alert("Error: " + e.message); }
    setLoading(false);
  };

  const inputStyle = {
    display: "block", width: "100%", padding: "15px 20px", marginBottom: "12px",
    borderRadius: "14px", border: t.inputBorder, background: t.inputBg,
    color: t.inputColor, fontSize: "14px", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit", transition: "all 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: t.appBg, fontFamily: "'Sora','Segoe UI',sans-serif", transition: "all 0.4s", paddingBottom: "60px" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 36px", background: t.navBg, backdropFilter: "blur(24px)", borderBottom: t.navBorder, position: "sticky", top: 0, zIndex: 100, transition: "all 0.4s" }}>
        <div style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-0.5px", color: t.logo }}>◈ FundChain</div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={() => setDark(!dark)} style={{ background: t.themeBg, border: t.themeBorder, borderRadius: "50px", padding: "9px 18px", cursor: "pointer", color: t.themeColor, fontSize: "12px", fontWeight: 700, fontFamily: "inherit" }}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          {!wallet ? (
            <button onClick={handleConnect} style={{ background: t.walletBg, border: t.walletBorder, borderRadius: "50px", padding: "9px 20px", cursor: "pointer", color: t.walletColor, fontSize: "12px", fontWeight: 700, fontFamily: "inherit" }}>
              Connect Wallet
            </button>
          ) : (
            <div style={{ background: dark ? "rgba(120,120,120,0.12)" : "#f0f0f0", border: dark ? "1px solid rgba(120,120,120,0.2)" : "1px solid #ddd", borderRadius: "50px", padding: "9px 20px", color: dark ? "#bbb" : "#333", fontSize: "12px", fontWeight: 700 }}>
              ● {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "52px 20px 38px" }}>
        <div style={{ fontSize: "44px", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "10px", color: t.heroTitle }}>Fund the Future</div>
        <div style={{ fontSize: "15px", color: t.heroSub }}>Decentralized crowdfunding on Stellar & Soroban</div>
        <div style={{ display: "inline-flex", marginTop: "28px", borderRadius: "20px", padding: "18px 36px", background: t.statsBg, border: t.statsBorder }}>
          {[["Campaigns", campaigns.length], ["XLM Raised", "—"], ["Donors", "—"]].map(([label, val], i, arr) => (
            <div key={label} style={{ textAlign: "center", padding: "0 28px", borderRight: i < arr.length - 1 ? `1px solid ${t.statDiv}` : "none" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: t.statNum }}>{val}</div>
              <div style={{ fontSize: "10px", color: t.statLabel, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "3px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>

        {/* Create */}
        <div style={{ background: t.cardBg, backdropFilter: "blur(24px)", border: t.cardBorder, borderRadius: "28px", padding: "36px 40px", marginBottom: "32px", boxShadow: t.cardShadow, transition: "all 0.3s" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: t.secLabel, marginBottom: "22px" }}>Launch a Campaign</div>
          <input style={inputStyle} placeholder="Campaign title" value={title} onChange={e => setTitle(e.target.value)} />
          <input style={inputStyle} placeholder="What are you raising funds for?" value={description} onChange={e => setDescription(e.target.value)} />
          <div style={{ display: "flex", gap: "12px" }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Goal (XLM)" value={goal} onChange={e => setGoal(e.target.value)} type="number" />
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Deadline (days)" value={deadline} onChange={e => setDeadline(e.target.value)} type="number" />
          </div>
          <button onClick={handleCreate} disabled={loading} style={{ width: "100%", background: t.launchBg, border: t.launchBorder, borderRadius: "14px", padding: "16px", color: t.launchColor, fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: "4px" }}>
            {loading ? "Creating..." : "Launch Campaign →"}
          </button>
        </div>

        {/* Campaigns */}
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: t.secLabel, marginBottom: "20px" }}>Active Campaigns</div>

        {campaigns.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: t.secLabel, fontSize: "15px" }}>
            No campaigns yet — be the first to launch one!
          </div>
        ) : campaigns.map((camp, i) => {
          const pct = Number(camp.goal) > 0 ? Math.min((Number(camp.raised) / Number(camp.goal)) * 100, 100) : 0;
          const done = Number(camp.raised) >= Number(camp.goal) && Number(camp.goal) > 0;
          return (
            <div key={i} style={{ background: t.cardBg, backdropFilter: "blur(24px)", border: t.cardBorder, borderRadius: "28px", padding: "34px 38px", marginBottom: "24px", boxShadow: t.cardShadow, transition: "all 0.3s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: t.cardTitle, letterSpacing: "-0.4px" }}>{camp.title}</div>
                <span style={{ background: done ? t.doneBg : t.badgeBg, border: `1px solid ${done ? t.doneBorder : t.badgeBorder}`, borderRadius: "50px", padding: "5px 14px", fontSize: "10px", fontWeight: 700, color: done ? t.doneColor : t.badgeColor, letterSpacing: "1.5px", whiteSpace: "nowrap", marginLeft: "12px" }}>
                  {done ? "FUNDED" : "ACTIVE"}
                </span>
              </div>
              <div style={{ fontSize: "14px", color: t.cardDesc, marginBottom: "18px", lineHeight: 1.65 }}>{camp.description}</div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: t.creatorColor, background: t.creatorBg, border: `1px solid ${t.creatorBorder}`, borderRadius: "10px", padding: "6px 12px", display: "inline-block", marginBottom: "22px" }}>
                {String(camp.creator).slice(0, 12)}...
              </div>
              <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
                {[["Goal", `${(Number(camp.goal) / 10_000_000).toFixed(0)} XLM`], ["Raised", `${(Number(camp.raised) / 10_000_000).toFixed(2)} XLM`], ["Progress", `${pct.toFixed(0)}%`]].map(([label, val]) => (
                  <div key={label} style={{ flex: 1, background: t.sboxBg, border: `1px solid ${t.sboxBorder}`, borderRadius: "18px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: t.sboxLabel, marginBottom: "5px", letterSpacing: "1px", textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontSize: "17px", fontWeight: 700, color: t.sboxNum }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: "7px", background: t.progBg, borderRadius: "50px", marginBottom: "22px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: t.progFill, borderRadius: "50px", transition: "width 0.6s ease" }} />
              </div>
              {!done ? (
                <div style={{ display: "flex", gap: "12px" }}>
                  <input style={{ ...inputStyle, flex: 1, marginBottom: 0 }} placeholder="Amount in XLM" value={donateAmount} onChange={e => setDonateAmount(e.target.value)} type="number" />
                  <button onClick={() => handleDonate(camp.id)} disabled={loading} style={{ background: t.donateBg, border: `1px solid ${t.donateBorder}`, borderRadius: "14px", padding: "14px 26px", cursor: "pointer", color: t.donateColor, fontSize: "14px", fontWeight: 700, whiteSpace: "nowrap", fontFamily: "inherit" }}>
                    {loading ? "..." : "Donate ✦"}
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "12px", color: t.fundedText, fontWeight: 600, fontSize: "13px", letterSpacing: "0.5px" }}>
                  ✓ Goal reached — fully funded
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
