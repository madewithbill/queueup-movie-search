import { useState, useEffect, type SyntheticEvent, type JSX } from "react";
import { useNavigate, useSearchParams } from "react-router";
import InfiniteScroll from "react-infinite-scroll-component";
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

import { useHistory, useWatchlist } from "../store";
import { getWatchlist, handleToggleClick } from "../utils";
import useLocalStorage from "../hooks/useLocalStorage";

import Card from "../components/Card";
import NoResultsText from "../components/NoResultsText";
import errorImg from "../assets/image-error-fallback.png";

import type { CallResponse } from "../shared.types";

export default function Home() {
  useLocalStorage();
  //Context and query
  const watchlist: string[] = useWatchlist((s) => s.watchlist);
  const addMedia = useWatchlist((s) => s.addMedia);
  const removeMedia = useWatchlist((s) => s.removeMedia);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  //State
  const [callResponse, setCallResponse] = useState<CallResponse>();
  const [pagination, setPagination] = useState<number>(1);
  const setPath = useHistory((s) => s.setPath);

  //Derived state
  const mediaArray: CallResponse["Search"] | undefined = callResponse?.Search;
  const totalResults: number = Number(callResponse?.totalResults);
  const errorMessage: string | undefined = callResponse?.Error;

  //Search submit
  function handleSubmit(formData: FormData) {
    const urlQuery = new URLSearchParams(formData.get("query") as string);
    //capture query for store
    setSearchParams(urlQuery);
    setPath(`/?${urlQuery}`);
  }

  // Fetching Movies
  const fetchUrl = `/.netlify/functions/omdbFetch?s=${searchParams}&page=${pagination}`;
  useEffect(() => {
    try {
      if (!searchParams?.size) {
        setCallResponse(undefined);
        return;
      }
      async function getMedia() {
        const res = await fetch(fetchUrl);
        const data = await res.json();
        setCallResponse(data);
        setPagination((prevPage) => prevPage + 1);
      }
      getMedia();
    } catch (error) {
      console.log(error);
    }
  }, [searchParams]);

  async function fetchMoreMedia() {
    try {
      const res = await fetch(fetchUrl);
      const data = await res.json();
      mediaArray?.push(...data.Search);
      setPagination((prevPage) => prevPage + 1);
    } catch (error) {
      console.log(error);
    }
  }

  //Building results card list
  const cardElements: JSX.Element[] | undefined = mediaArray?.map(
    (watchlistItem) => {
      const watchlistItemId: string = watchlistItem.imdbID;

      //Check if current search result id is included in local watchlist
      const onWatchlist: boolean = getWatchlist({ watchlist }).includes(
        watchlistItemId,
      );

      //Navigate to movie detail page
      function handleClick(e: SyntheticEvent) {
        navigate(`titles/${e.currentTarget.id}`, {
          state: {
            watchlistItemId,
          },
        });
      }

      return (
        <Card
          id={watchlistItemId}
          key={watchlistItemId}
          className="flex items-center gap-4 cursor-pointer"
          onClick={handleClick}
        >
          <img
            className="max-w-12  min-h-18 object-contain"
            src={watchlistItem.Poster}
            alt={`Poster for ${watchlistItem.Title}`}
            onError={(e) => {
              e.currentTarget.src = errorImg;
              e.currentTarget.onerror = null;
            }}
          />
          <div className="flex flex-auto flex-col gap-4">
            <div className="flex items-center gap-2">
              <div>
                <h2 className="text-body-lg">{watchlistItem.Title}</h2>
                <p className="text-body-sm opacity-50">{watchlistItem.Year}</p>
              </div>
              {onWatchlist ? (
                <button
                  className="text-green-500 ml-auto z-50"
                  onClick={(e) =>
                    handleToggleClick(
                      e,
                      watchlist,
                      watchlistItem,
                      addMedia,
                      removeMedia,
                    )
                  }
                >
                  <CheckCircleIcon className="size-8" />
                </button>
              ) : (
                <button
                  className="ml-auto z-50"
                  onClick={(e) =>
                    handleToggleClick(
                      e,
                      watchlist,
                      watchlistItem,
                      addMedia,
                      removeMedia,
                    )
                  }
                >
                  <PlusCircleIcon className="size-8" />
                </button>
              )}
            </div>
          </div>
        </Card>
      );
    },
  );

  const resultsInfo = () => {
    if (!totalResults) {
      return "";
    }
    if (totalResults === 1) {
      return "1 result found";
    }
    if (totalResults > 1) {
      return `${totalResults} results found`;
    }
  };

  return (
    <>
      <title>QueueUp Movie and TV Search</title>
      <meta property="og:title" content="QueueUp Movie and TV Search" />
      <meta
        name="description"
        content="QueueUp helps you find the hottest movies and tv shows. Save them to your watchlist, sit back, and enjoy the show!"
      />
      <header className="text-center">
        <h1 className="text-heading-xl mb-8">Find Movies and TV</h1>
        <form action={handleSubmit}>
          <label htmlFor="query" className="sr-only">
            Search
          </label>
          <input
            id="query"
            className="bg-transparent border border-neutral-200 rounded-lg w-full py-2 px-4 mb-4"
            type="text"
            name="query"
            placeholder="Search for a movie..."
          />
          <button className="bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg w-full py-2 px-4">
            Search
          </button>
        </form>
        <p className="text-left text-body-sm opacity-50 py-4">
          {resultsInfo()}
        </p>
      </header>
      <main>
        {mediaArray && (
          <InfiniteScroll
            className="flex flex-col gap-4"
            dataLength={mediaArray.length}
            next={fetchMoreMedia}
            hasMore={totalResults > mediaArray.length}
            loader={
              <p className="opacity-50 text-body-sm text-center">Loading...</p>
            }
            endMessage={
              <p className="opacity-50 text-body-sm text-center">
                End of results.
              </p>
            }
          >
            {cardElements}
          </InfiniteScroll>
        )}
        {!mediaArray && !errorMessage && (
          <NoResultsText>
            Your next watch is just around the corner.
          </NoResultsText>
        )}
        {errorMessage && (
          <NoResultsText>{`Oh no! ${errorMessage}`}</NoResultsText>
        )}
        {totalResults === 0 && (
          <NoResultsText>Oh no! There’s nothing here for you.</NoResultsText>
        )}
      </main>
    </>
  );
}
