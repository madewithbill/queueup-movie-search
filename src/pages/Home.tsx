import {
  useState,
  useEffect,
  useContext,
  type SyntheticEvent,
  type Dispatch,
  type JSX,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../components/Card";
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { QueueContext, type Context } from "../components/AppLayout";
import { watchlistToggle, getWatchlist } from "../utils";
import NoResultsText from "../components/NoResultsText";
import errorImg from "../assets/image-error-fallback.png";

export type CallResponse = {
  Search: {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
  }[];
  totalResults: string;
  Response: boolean;
  Error?: string;
};

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [queryResponse, setQueryResponse] = useState<CallResponse>();
  const [pagination, setPagination] = useState<number>(2);
  //Derived state
  const movieArray: CallResponse["Search"] | undefined = queryResponse?.Search;
  const totalResults: number = Number(queryResponse?.totalResults);
  const errorMessage: string | undefined = queryResponse?.Error;

  //Context
  const context: Context = useContext(QueueContext);
  const queue: string[] = context.queue;
  const setQueue: Dispatch<React.SetStateAction<string[]>> = context.setQueue;
  const searchParams = context.searchParams;
  const setSearchParams = context.setSearchParams;

  //Search submit
  function handleSubmit(formData: FormData) {
    const formQuery: string = encodeURIComponent(
      formData.get("query") as string
    );
    setSearchParams(formQuery);
  }

  // Fetching Movies
  const omdbKey = import.meta.env.VITE_OMDB_KEY;

  useEffect(() => {
    try {
      console.log(searchParams);
      if (!searchParams?.size) {
        setQueryResponse(undefined);
        return;
      }
      async function getMovie() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${omdbKey}&s=${searchParams}`
        );
        const data = await res.json();

        setQueryResponse(data);
      }
      getMovie();
    } catch (error) {
      console.log(error);
    }
  }, [searchParams]);

  async function fetchMoreMovies() {
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${omdbKey}&s=${searchParams}&page=${pagination}`
    );
    const data = await res.json();
    movieArray?.push(...data.Search);
    setPagination((prevPage) => prevPage + 1);
  }

  //Building results card list
  const cardElements: JSX.Element[] | undefined = movieArray?.map((result) => {
    const resultId: string = result.imdbID;

    //Check if current search result id is included in local watchlist
    const onWatchlist: boolean = getWatchlist({ queue }).includes(resultId);

    //Navigate to movie detail page
    function handleClick(e: SyntheticEvent) {
      navigate(`movies/${e.currentTarget.id}`, {
        state: {
          resultId,
          backPath: location.search,
        },
      });
    }

    //Watchlist indicator toggle
    function handleToggleClick(e: SyntheticEvent) {
      watchlistToggle({ e, result, setQueue });
    }

    return (
      <>
        <Card
          id={resultId}
          key={resultId}
          className="flex items-center gap-4 cursor-pointer"
          onClick={handleClick}
        >
          <img
            className="max-w-12  min-h-18 object-contain"
            src={result.Poster}
            alt={`Poster for ${result.Title}`}
            onError={(e) => {
              e.currentTarget.src = errorImg;
              e.currentTarget.onerror = null;
            }}
          />
          <div className="flex flex-auto flex-col gap-4">
            <div className="flex items-center gap-2">
              <div>
                <h2 className="text-body-lg">{result.Title}</h2>
                <p className="text-body-sm opacity-50">{result.Year}</p>
              </div>
              {onWatchlist ? (
                <button
                  className="text-green-500 ml-auto z-50"
                  onClick={handleToggleClick}
                >
                  <CheckCircleIcon className="size-8" />
                </button>
              ) : (
                <button className="ml-auto z-50" onClick={handleToggleClick}>
                  <PlusCircleIcon className="size-8" />
                </button>
              )}
            </div>
          </div>
        </Card>
      </>
    );
  });

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
        {movieArray && (
          <InfiniteScroll
            className="flex flex-col gap-4"
            dataLength={movieArray.length}
            next={fetchMoreMovies}
            hasMore={totalResults > movieArray.length}
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
        {!movieArray && !errorMessage && (
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
