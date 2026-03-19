# 🚀 Crowdfunding dApp on Stellar

## Project Description
A decentralized crowdfunding platform built on the Stellar blockchain using Soroban smart contracts and a React frontend. Anyone can create a campaign or donate to existing ones — transparently and without any middleman.

## What it does
- Creators can launch a crowdfunding campaign with a title, description, goal amount, and deadline
- Donors can contribute XLM to any campaign
- All data is stored on-chain — transparent and immutable
- Anyone can read all campaigns and their current raised amount
- Users connect their Freighter wallet to interact with the dApp

## Features
- ✅ Create a campaign with goal and deadline
- ✅ Donate XLM to any campaign
- ✅ Read all campaigns and their status
- ✅ Fully on-chain — no central server
- ✅ Built with Rust + Soroban SDK
- ✅ React frontend with Freighter wallet integration
- ✅ Deployed on Stellar Testnet

## Tech Stack
- **Smart Contract**: Rust + Soroban SDK
- **Frontend**: React.js
- **Wallet**: Freighter
- **Network**: Stellar Testnet
- **SDK**: @stellar/stellar-sdk

## Deployed Smart Contract
[View on Stellar Lab](https://lab.stellar.org/r/testnet/contract/CA7Q5MJS4QPBMHUG6Q2WOE3N666NADCGQN4RPMYU6Z5DZI5VHKPX6S4R)

Contract ID: `CA7Q5MJS4QPBMHUG6Q2WOE3N666NADCGQN4RPMYU6Z5DZI5VHKPX6S4R`

## How to Run

### Smart Contract
```bash
cd crowdfunding-dapp
cargo test
stellar contract build
stellar contract deploy --wasm target/wasm32v1-none/release/crowdfunding.wasm --source-account alice --network testnet --alias crowdfunding
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Screenshots

![Contract Deploy](https://github.com/user-attachments/assets/71365838-7a27-4d2a-ad38-a236a8636592)

<img width="1896" height="1019" alt="image" src="https://github.com/user-attachments/assets/a867a2d5-095d-458d-ae41-648f12f686f3" />
