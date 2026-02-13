import { create } from "zustand";

interface UseHistory {
  referralPath: string;
  setPath: (pathname: string) => void;
}

interface Result {
  Poster?: string;
  Title?: string;
  Type?: string;
  Year?: string;
  imdbID?: string;
}

interface UseWatchlist {
  watchlist: string[];
  addMedia: (mediaItem: Result) => void;
  removeMedia: (mediaItem: Result) => void;
}

export const useHistory = create<UseHistory>()((set) => ({
  referralPath: "",
  setPath: (pathname) => set({ referralPath: pathname }),
}));

export const useWatchlist = create<UseWatchlist>()((set) => ({
  watchlist: Array.from(
    JSON.parse(localStorage.getItem("watchlist") || '""'),
  ) as string[],
  addMedia: (mediaItem: Result) =>
    set((state) => ({
      watchlist: [...state.watchlist, JSON.stringify(mediaItem)],
    })),
  removeMedia: (mediaItem: Result) =>
    set((state) => {
      const currentArr = state.watchlist;
      const newArr = currentArr.filter(
        (item) => JSON.parse(item).imdbID !== mediaItem.imdbID,
      );
      return { watchlist: newArr };
    }),
}));
