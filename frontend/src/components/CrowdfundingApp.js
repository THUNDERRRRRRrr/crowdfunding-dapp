import React, { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";

import {
  connectWallet,
  createCampaign,
  donate,
} from "../services/stellar";

import { useCampaigns } from "../hooks/useCampaigns";

// ---------------- CONTEXT ----------------
const AppContext = createContext();

function AppProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [dark, setDark] = useState(true);

  return (
    <AppContext.Provider value={{ wallet, setWallet, dark, setDark }}>
      {children}
    </AppContext.Provider>
  );
}

const useApp = () => useContext(AppContext);

// ---------------- NAVBAR ----------------
function Navbar() {
  const { wallet, setWallet, dark, setDark } = useApp();

  const handleConnect = async () => {
    const addr = await connectWallet();
    setWallet(addr);
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="
        flex justify-between items-center px-8 py-4
        border-b border-gray-200/50 dark:border-white/10
        backdrop-blur-2xl sticky top-0 z-50
        bg-white/70 dark:bg-neutral-900/60
        shadow-sm transition-all duration-300
      "
    >
      <h1 className="text-xl font-bold">FundChain</h1>

      <div className="flex gap-3 items-center">
        <button
          onClick={() => setDark(prev => !prev)}
          className="px-4 py-2 rounded-full bg-gray-200 dark:bg-white/10 hover:scale-105 transition"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {!wallet ? (
          <button
            onClick={handleConnect}
            className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black hover:scale-105 hover:shadow-lg transition"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="px-4 py-2 rounded-full bg-gray-200 dark:bg-white/10 text-sm">
            {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </div>
        )}
      </div>
    </motion.nav>
  );
}

// ---------------- HERO ----------------
function Hero({ campaigns }) {
  return (
    <section className="text-center py-16">
      <h2 className="
        text-6xl font-extrabold tracking-tight mb-4
        bg-gradient-to-r from-black to-gray-600 
        dark:from-white dark:to-gray-400
        bg-clip-text text-transparent
      ">
        Fund the Future
      </h2>

      <p className="text-gray-600 dark:text-white/60 mb-8">
        Decentralized crowdfunding on Stellar
      </p>

      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
        <Stat label="Campaigns" value={campaigns.length} />
        <Stat label="Raised" value="—" />
        <Stat label="Donors" value="—" />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="
      bg-white/70 dark:bg-white/5
      border border-gray-200 dark:border-white/10
      backdrop-blur-md
      shadow-sm hover:shadow-md
      rounded-2xl py-6 transition
    ">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 dark:text-white/50 uppercase">
        {label}
      </p>
    </div>
  );
}

// ---------------- CREATE ----------------
function CreateCampaign({ reload }) {
  const { wallet } = useApp();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [goal, setGoal] = useState("");

  const handleCreate = async () => {
    if (!wallet) return alert("Connect wallet first");

    await createCampaign(wallet, title, desc, goal);

    setTitle("");
    setDesc("");
    setGoal("");

    reload();
  };

  const inputStyle = `
    w-full p-4 rounded-2xl
    bg-white/80 dark:bg-white/5
    border border-gray-200 dark:border-white/10
    backdrop-blur-md
    text-black dark:text-white
    placeholder-gray-500 dark:placeholder-white/40
    focus:ring-2 focus:ring-black dark:focus:ring-white
    focus:border-transparent
    outline-none
    transition-all duration-200
  `;

  return (
    <div className="max-w-3xl mx-auto px-6 mb-14">
      <div className="
        bg-white/70 dark:bg-white/5
        border border-gray-200 dark:border-white/10
        backdrop-blur-2xl
        shadow-xl
        rounded-3xl p-8
        space-y-6
      ">

        {/* Title */}
        <h3 className="
          text-lg font-semibold
          text-gray-700 dark:text-white/80
          tracking-wide
        ">
          Launch Campaign
        </h3>

        {/* Title Input */}
        <input
          className={inputStyle}
          placeholder="Campaign title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <textarea
          className={inputStyle + " h-28 resize-none"}
          placeholder="What are you raising funds for?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* Row: Goal + Deadline */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className={inputStyle}
            placeholder="Goal (XLM)"
            value={goal}
            type="number"
            onChange={(e) => setGoal(e.target.value)}
          />

          <div className="
            flex items-center justify-center
            text-sm text-gray-400 dark:text-white/30
            border border-dashed border-gray-300 dark:border-white/10
            rounded-2xl
          ">
            (deadline later)
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleCreate}
          className="
            w-full py-4 rounded-2xl
            bg-gradient-to-r from-black to-gray-700
            dark:from-white dark:to-gray-300
            text-white dark:text-black
            font-semibold tracking-wide
            hover:scale-[1.02] hover:shadow-xl
            active:scale-[0.98]
            transition-all duration-200
          "
        >
          Launch Campaign
        </button>

      </div>
    </div>
  );
}
// ---------------- STAT BOX ----------------
function StatBox({ label, value }) {
  return (
    <div className="
      bg-white/70 dark:bg-white/5
      border border-gray-200 dark:border-white/10
      backdrop-blur-md
      shadow-sm hover:shadow-md
      rounded-xl p-3 text-center transition
    ">
      <p className="text-xs text-gray-500 dark:text-white/50">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

// ---------------- CARD ----------------
function CampaignCard({ camp, reload }) {
  const { wallet } = useApp();
  const [amount, setAmount] = useState("");

  const goal = Number(camp.goal) / 1e7;
  const raised = Number(camp.raised) / 1e7;
  const pct = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const funded = raised >= goal;

  const handleDonate = async () => {
    if (!wallet) return alert("Connect wallet first");
    await donate(wallet, camp.id, amount);
    reload();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      className="
        group bg-white/80 dark:bg-white/5
        border border-gray-200 dark:border-white/10
        rounded-3xl p-6 space-y-5
        backdrop-blur-xl shadow-lg hover:shadow-2xl
        transition-all duration-300 hover:-translate-y-1
      "
    >
      <div className="flex justify-between">
        <h4 className="text-xl font-bold">{camp.title}</h4>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-white/10">
          {funded ? "FUNDED" : "ACTIVE"}
        </span>
      </div>

      <p className="text-gray-600 dark:text-white/60">
        {camp.description}
      </p>

      <div className="text-xs text-gray-500 dark:text-white/50">
        Creator: {String(camp.creator).slice(0, 10)}...
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Goal" value={`${goal.toFixed(0)} XLM`} />
        <StatBox label="Raised" value={`${raised.toFixed(2)} XLM`} />
        <StatBox label="Progress" value={`${pct.toFixed(0)}%`} />
      </div>

      <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="
            h-full 
            bg-gradient-to-r from-black to-gray-600 
            dark:from-white dark:to-gray-300
            transition-all duration-700
          "
          style={{ width: `${pct}%` }}
        />
      </div>

      {!funded && (
        <div className="flex gap-3">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="
              flex-1 p-3 rounded-xl
              bg-gray-100 dark:bg-white/5
              border border-gray-200 dark:border-white/10
              focus:ring-2 focus:ring-black dark:focus:ring-white
              outline-none
            "
          />
          <button
            onClick={handleDonate}
            className="
              px-6 py-3 rounded-xl
              bg-black text-white
              dark:bg-white dark:text-black
              hover:scale-105 hover:shadow-lg
              transition
            "
          >
            Donate
          </button>
        </div>
      )}

      {funded && (
        <div className="text-center text-green-600 font-semibold">
          Goal reached
        </div>
      )}
    </motion.div>
  );
}

// ---------------- LIST ----------------
function CampaignList({ campaigns, reload, loading }) {
  if (loading) return <p className="text-center">Loading...</p>;
  if (!campaigns.length)
    return <p className="text-center">No campaigns yet</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-6">
      {campaigns.map((camp) => (
        <CampaignCard key={camp.id} camp={camp} reload={reload} />
      ))}
    </div>
  );
}

// ---------------- MAIN ----------------
function MainApp() {
  const { wallet, dark } = useApp();
  const { campaigns, loading, reload } = useCampaigns(wallet);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="
        min-h-screen
        bg-gradient-to-br
        from-gray-50 via-white to-gray-100
        dark:from-neutral-950 dark:via-neutral-900 dark:to-black
        text-black dark:text-white
        transition-all duration-500
      ">
        <Navbar />
        <Hero campaigns={campaigns} />
        <CreateCampaign reload={reload} />
        <CampaignList campaigns={campaigns} reload={reload} loading={loading} />
      </div>
    </div>
  );
}

// ---------------- EXPORT ----------------
export default function CrowdfundingApp() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
