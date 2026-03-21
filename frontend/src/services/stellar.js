/* global BigInt */

import * as StellarSdk from "@stellar/stellar-sdk";
import { connectWallet, signTx } from "../freighter";

const CONTRACT_ID = "CA7Q5MJS4QPBMHUG6Q2WOE3N666NADCGQN4RPMYU6Z5DZI5VHKPX6S4R";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.rpc.Server(RPC_URL);

export async function getCampaigns(address) {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account = await server.getAccount(address);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("get_campaigns"))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);

  if (StellarSdk.rpc.Api.isSimulationSuccess(sim)) {
    return StellarSdk.scValToNative(sim.result.retval);
  }

  return [];
}

export async function createCampaign(wallet, title, desc, goal) {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account = await server.getAccount(wallet);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "create_campaign",
        StellarSdk.nativeToScVal(title, { type: "string" }),
        StellarSdk.nativeToScVal(desc, { type: "string" }),
        StellarSdk.nativeToScVal(BigInt(goal * 10_000_000), { type: "i128" }),
        StellarSdk.nativeToScVal(BigInt(1000), { type: "u64" }),
        StellarSdk.nativeToScVal(wallet, { type: "address" })
      )
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  const prepared = StellarSdk.rpc.assembleTransaction(tx, sim).build();

  const signed = await signTx(prepared.toXDR());
  const finalTx = StellarSdk.TransactionBuilder.fromXDR(
    signed,
    NETWORK_PASSPHRASE
  );

  return server.sendTransaction(finalTx);
}

export async function donate(wallet, id, amount) {
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const account = await server.getAccount(wallet);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "donate",
        StellarSdk.nativeToScVal(id, { type: "u32" }),
        StellarSdk.nativeToScVal(BigInt(amount * 10_000_000), { type: "i128" }),
        StellarSdk.nativeToScVal(wallet, { type: "address" })
      )
    )
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  const prepared = StellarSdk.rpc.assembleTransaction(tx, sim).build();

  const signed = await signTx(prepared.toXDR());
  const finalTx = StellarSdk.TransactionBuilder.fromXDR(
    signed,
    NETWORK_PASSPHRASE
  );

  return server.sendTransaction(finalTx);
}

export { connectWallet };
