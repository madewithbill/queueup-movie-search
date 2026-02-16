import { useEffect } from "react";
import { useWatchlist } from "~/store";

export default function useLocalStorage() {
  const watchlist = useWatchlist((s) => s.watchlist);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, []);
  return;
}
