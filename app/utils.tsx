import type { SyntheticEvent } from "react";

import type { UseWatchlist } from "./store";
import type { WatchlistItem } from "./shared.types";

//Capture local watchlist
export function getWatchlist({ watchlist }: { watchlist: string[] }) {
  const currentWatchlist: string[] = watchlist.map((item) => {
    const movieObj = JSON.parse(item as string);
    return movieObj.imdbID;
  });
  return currentWatchlist;
}

//Watchlist toggle
export function handleToggleClick(
  e: SyntheticEvent,
  watchlist: string[],
  watchlistItem: WatchlistItem,
  addMedia: UseWatchlist["addMedia"],
  removeMedia: UseWatchlist["removeMedia"],
) {
  e.stopPropagation();
  const parsedWatchlist = watchlist.map((item: string) => {
    return JSON.parse(item);
  });
  if (parsedWatchlist.every((item) => item.imdbID !== watchlistItem.imdbID)) {
    watchlist.push(JSON.stringify(watchlistItem));
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    addMedia(watchlistItem);
  } else {
    removeMedia(watchlistItem);
  }
}
