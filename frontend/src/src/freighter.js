import { setAllowed, getAddress } from "@stellar/freighter-api";

export const connectWallet = async () => {
  await setAllowed();
  const { address } = await getAddress();
  return address;
};
