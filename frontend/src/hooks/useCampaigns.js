import { useEffect, useState, useCallback } from "react";
import { getCampaigns } from "../services/stellar";

export function useCampaigns(wallet) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    const data = await getCampaigns(wallet);
    setCampaigns(data || []);
    setLoading(false);
  }, [wallet]);

  useEffect(() => {
    load();
  }, [load]);

  return { campaigns, loading, reload: load };
}
