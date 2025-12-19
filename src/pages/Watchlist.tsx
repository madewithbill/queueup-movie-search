import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { type CallResponse } from "./Home";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import InfiniteScroll from "react-infinite-scroll-component";
import NoResultsText from "../components/NoResultsText";
import errorImg from "../assets/image-error-fallback.png";

export default function Watchlist() {
  const [watchlistSlice, setWatchlistSlice] = useState(10);
  const [filter, setFilter] = useState("choose-filter");

  const watchlistArr = () => {
    //parse baseline array to manipulate
    const defaultArr: string[] = Array.from(
      JSON.parse(localStorage.getItem("watchlist") || '""')
    );
    //compareFn for sort methods
    const compare = (a: string, b: string) => {
      const titleA = JSON.parse(a).Title.toLowerCase();
      const titleB = JSON.parse(b).Title.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      // if equal return 0
      return 0;
    };

    //return array version based on select input
    if (filter === "newest-first") {
      return defaultArr.reverse();
    }
    if (filter === "oldest-first") {
      return defaultArr;
    }
    if (filter === "a-z") {
      return defaultArr.sort(compare);
    }
    if (filter === "z-a") {
      return defaultArr.sort(compare).reverse();
    }
    return defaultArr;
  };

  //initiate current rendered list based on slice state. begins with 10 results before Infinite Scroll loads more
  const renderedArr = [...watchlistArr().slice(0, watchlistSlice)];

  //Infinite scroller function and hasMore check
  function fetchMoreWatchlist() {
    renderedArr.push(
      ...watchlistArr().slice(watchlistSlice, watchlistSlice + 10)
    );
    setWatchlistSlice((prevSlice) => prevSlice + 10);
  }

  // this also conditionally renders end of results text
  const listHasMore = watchlistArr().length > renderedArr.length;

  //create poster tiles
  const watchlistElements = renderedArr.map((movie) => {
    const result: CallResponse["Search"][0] = JSON.parse(movie as string);
    const resultId: string = result.imdbID;

    return (
      <Link
        to={`../movies/${resultId}`}
        state={{ resultId, backPath: location.pathname }}
        className="relative"
      >
        <img
          className="h-full object-cover "
          src={result.Poster}
          alt={`Poster for ${result.Title}`}
          onError={(e) => {
            e.currentTarget.src = errorImg;
            e.currentTarget.onerror = null;
          }}
        />
      </Link>
    );
  });

  //header form and detail functions, including select state setter
  function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    setFilter(e.target.value);
  }

  const selectDynamicColor =
    filter !== "choose-filter" ? "text-neutral-950! dark:text-neutral-50!" : "";

  const resultsInfo = () => {
    if (!watchlistArr().length) {
      return "";
    }
    if (watchlistArr().length === 1) {
      return "1 result found";
    }
    if (watchlistArr().length > 1) {
      return `${watchlistArr().length} results found`;
    }
  };

  return (
    <>
      <header className="text-center">
        <h1 className="text-heading-xl mb-8">Watchlist</h1>
        <form>
          <label htmlFor="query" className="sr-only">
            Filter
          </label>
          <div className="relative">
            <select
              name="filter"
              id="filter"
              value={filter}
              className={`appearance-none text-neutral-950/50 dark:text-neutral-50/50 bg-transparent border border-neutral-200 rounded-lg w-full py-2 px-4 ${selectDynamicColor}`}
              onChange={handleSelect}
            >
              {}
              <option value="choose-filter" disabled>
                Choose a filter
              </option>
              <option value="newest-first">Newest First</option>
              <option value="oldest-first">Oldest First</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
            <ChevronDownIcon className="size-4 absolute top-0 right-4 bottom-0 h-full pointer-events-none" />
          </div>
        </form>
        <p className="text-left text-body-sm opacity-50 py-4">
          {resultsInfo()}
        </p>
      </header>
      <main>
        {renderedArr.length > 0 ? (
          <>
            <InfiniteScroll
              className="grid grid-cols-3 sm:grid-cols-4 gap-2"
              dataLength={renderedArr.length}
              next={fetchMoreWatchlist}
              hasMore={listHasMore}
              loader={null}
            >
              {watchlistElements}
            </InfiniteScroll>
            {!listHasMore && (
              <p className="opacity-50 text-body-sm text-center mt-8">
                End of watchlist.
              </p>
            )}
          </>
        ) : (
          <NoResultsText>
            Nothing here just yet.
            <br />
            <Link to="/" className="underline">
              Start searching for movies now.
            </Link>
          </NoResultsText>
        )}
      </main>
    </>
  );
}
