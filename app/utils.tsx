import type { SetStateAction, SyntheticEvent, Dispatch } from "react";
import { useHistory, useWatchlist } from "./store";

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

type watchlistToggleProps = {
  e: SyntheticEvent;
  result: {
    Poster?: string;
    Title?: string;
    Type?: string;
    Year?: string;
    imdbID?: string;
  };
  setQueue: Dispatch<SetStateAction<string[]>>;
};

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

//Watchlist add/remove function
// export function watchlistToggle({ e, result, setQueue }: watchlistToggleProps) {
//   e.stopPropagation();
//   const currentWatchlist: string[] = Array.from(
//     JSON.parse(localStorage.getItem("watchlist") || '""'),
//   );
//   const parsedWatchlist = currentWatchlist.map((movie) => {
//     return JSON.parse(movie);
//   });
//   if (parsedWatchlist.every((item) => item.imdbID !== result.imdbID)) {
//     currentWatchlist.push(JSON.stringify(result));
//     localStorage.setItem("watchlist", JSON.stringify(currentWatchlist));
//     setQueue(currentWatchlist);
//   } else {
//     const newArr = currentWatchlist.filter(
//       (movie) => JSON.parse(movie).imdbID !== result.imdbID,
//     );
//     localStorage.setItem("watchlist", JSON.stringify(newArr));
//     setQueue(newArr);
//   }
// }
