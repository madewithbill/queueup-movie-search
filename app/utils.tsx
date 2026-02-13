import type { SyntheticEvent } from "react";
import { useWatchlist } from "./store";

const addMedia = useWatchlist((s) => s.addMedia);
const removeMedia = useWatchlist((s) => s.removeMedia);

//Capture local watchlist
export function getWatchlist({ watchlist }: { watchlist: string[] }) {
  const currentWatchlist: string[] = watchlist.map((item) => {
    const movieObj = JSON.parse(item as string);
    return movieObj.imdbID;
  });
  return currentWatchlist;
}

type Result = {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
};

//Watchlist indicator toggle
export function handleToggleClick(
  e: SyntheticEvent,
  watchlist: string[],
  result: Result,
) {
  e.stopPropagation();
  const parsedWatchlist = watchlist.map((item: string) => {
    return JSON.parse(item);
  });
  if (parsedWatchlist.every((item) => item.imdbID !== result.imdbID)) {
    watchlist.push(JSON.stringify(result));
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    addMedia(result);
  } else {
    removeMedia(result);
  }
}
