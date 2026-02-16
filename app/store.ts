import { create } from "zustand";
import type { WatchlistItem } from "./shared.types";

interface UseHistory {
  referralPath: string;
  setPath: (pathname: string) => void;
}

export interface UseWatchlist {
  watchlist: string[];
  addMedia: (mediaItem: WatchlistItem) => void;
  removeMedia: (mediaItem: WatchlistItem) => void;
}

export const useHistory = create<UseHistory>()((set) => ({
  referralPath: "",
  setPath: (pathname) => set({ referralPath: pathname }),
}));

export const useWatchlist = create<UseWatchlist>()((set) => ({
  watchlist: Array.from(
    JSON.parse(localStorage.getItem("watchlist") || '""'),
  ) as string[],
  addMedia: (mediaItem: WatchlistItem) =>
    set((state) => ({
      watchlist: [...state.watchlist, JSON.stringify(mediaItem)],
    })),
  removeMedia: (mediaItem: WatchlistItem) =>
    set((state) => {
      const currentArr = state.watchlist;
      const newArr = currentArr.filter(
        (item) => JSON.parse(item).imdbID !== mediaItem.imdbID,
      );
      return { watchlist: newArr };
    }),
}));
