import type { SetStateAction, SyntheticEvent, Dispatch } from "react";

//Capture local watchlist
export function getWatchlist({ queue }: { queue: string[] }) {
  const currentWatchlist: string[] = queue.map((movie) => {
    const movieObj = JSON.parse(movie as string);
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

//Watchlist add/remove function
export function watchlistToggle({ e, result, setQueue }: watchlistToggleProps) {
  e.stopPropagation();
  const currentWatchlist: string[] = Array.from(
    JSON.parse(localStorage.getItem("watchlist") || '""')
  );
  const parsedWatchlist = currentWatchlist.map((movie) => {
    return JSON.parse(movie);
  });
  if (parsedWatchlist.every((item) => item.imdbID !== result.imdbID)) {
    console.log("new one added");
    currentWatchlist.push(JSON.stringify(result));
    localStorage.setItem("watchlist", JSON.stringify(currentWatchlist));
    setQueue(currentWatchlist);
  } else {
    console.log("already in");
    const newArr = currentWatchlist.filter(
      (movie) => JSON.parse(movie).imdbID !== result.imdbID
    );
    localStorage.setItem("watchlist", JSON.stringify(newArr));
    setQueue(newArr);
  }
}
