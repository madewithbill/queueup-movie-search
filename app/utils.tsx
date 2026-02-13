import type { SyntheticEvent } from "react";
import type { UseWatchlist } from "./store";
import type { FullMovieObj } from "./routes/movies.$id";

//Capture local watchlist
export function getWatchlist({ watchlist }: { watchlist: string[] }) {
  const currentWatchlist: string[] = watchlist.map((item) => {
    const movieObj = JSON.parse(item as string);
    return movieObj.imdbID;
  });
  return currentWatchlist;
}

type Result = Pick<
  FullMovieObj,
  "Poster" | "Title" | "Type" | "Year" | "imdbID"
>;

//Watchlist indicator toggle
export function handleToggleClick(
  e: SyntheticEvent,
  watchlist: string[],
  result: Result,
  addMedia: UseWatchlist["addMedia"],
  removeMedia: UseWatchlist["removeMedia"],
) {
  e.stopPropagation();
  console.log(e);
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
