import {
  useEffect,
  useState,
  useContext,
  type Dispatch,
  type SyntheticEvent,
} from "react";
import { useLocation, Link } from "react-router-dom";
import Card from "../components/Card";
import {
  PlusIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { QueueContext, type Context } from "../components/AppLayout";
import { watchlistToggle, getWatchlist } from "../utils";
import errorImg from "../assets/image-error-fallback.png";

type FullMovieObj = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
};

type NavLocation = {
  pathname: string;
  search: string;
  hash: string;
  state: {
    resultId: string;
    backPath: string;
  };
  key: string;
};

export default function MovieDetail() {
  const [currentMovie, setCurrentMovie] = useState<FullMovieObj | undefined>(
    undefined
  );
  const location: NavLocation = useLocation();
  const movieDetailId: string = location.state.resultId;

  const context: Context = useContext(QueueContext);
  const queue: string[] = context.queue;
  const setQueue: Dispatch<React.SetStateAction<string[]>> = context.setQueue;

  useEffect(() => {
    const omdbKey = import.meta.env.VITE_OMDB_KEY;
    try {
      async function getDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${omdbKey}&i=${movieDetailId}`
        );
        const data = await res.json();
        setCurrentMovie(data);
      }
      getDetails();
    } catch (error) {
      console.log(error);
    }
  }, []);

  //Set function parameters from current movie data
  const result = {
    Poster: currentMovie?.Poster,
    Title: currentMovie?.Title,
    Type: currentMovie?.Type,
    Year: currentMovie?.Year,
    imdbID: currentMovie?.imdbID,
  };
  const resultId: string = movieDetailId;

  //Check if current search result id is included in local watchlist
  const onWatchlist: boolean = getWatchlist({ queue }).includes(resultId);

  //Watchlist indicator toggle
  function handleToggleClick(e: SyntheticEvent) {
    watchlistToggle({ e, result, setQueue });
  }

  //Determine back link
  const backText =
    location.state.backPath === "/watchlist" ? "watchlist" : "results";

  return currentMovie ? (
    <>
      <Link
        to={`../${location.state.backPath}`}
        className="text-body-sm flex items-center gap-1 mb-4"
      >
        <ArrowLeftIcon className="size-3" /> {`Back to ${backText}`}
      </Link>
      <main className="flex flex-col gap-4">
        <section className="flex gap-4">
          <img
            className="max-w-32"
            src={currentMovie.Poster}
            alt={`Poster for ${currentMovie.Title}`}
            onError={(e) => {
              e.currentTarget.src = errorImg;
              e.currentTarget.onerror = null;
            }}
          />
          <div className="flex flex-col items-start gap-4">
            <div>
              <h1 className="text-heading-md">{currentMovie.Title}</h1>
              <div className="text-[0.625rem] text-neutral-700 dark:text-neutral-200 flex gap-2">
                <p>{currentMovie.Year}</p>
                <p>{currentMovie.Runtime}</p>
                <p>{currentMovie.Rated}</p>
              </div>
            </div>
            <div className="text-eyebrow">
              <p className="mb-2">{currentMovie.Genre}</p>
              <p>{`Starring: ${currentMovie.Actors}`}</p>
            </div>
            {onWatchlist ? (
              <button
                onClick={handleToggleClick}
                className="text-eyebrow text-green-500 flex items-center gap-1 border-[1.5px] rounded-full pl-2 pr-2.5 py-1"
              >
                <CheckIcon className="size-3" />
                Watchlist
              </button>
            ) : (
              <button
                onClick={handleToggleClick}
                className="text-eyebrow flex items-center gap-1 border-[1.5px] rounded-full pl-2 pr-2.5 py-1"
              >
                <PlusIcon className="size-3" />
                Watchlist
              </button>
            )}
          </div>
        </section>
        <section>
          <Card className="text-body-sm">
            <h2 className="mb-2">Synopsis</h2>
            <p className="opacity-65">{currentMovie.Plot}</p>
          </Card>
        </section>
        <section className="flex gap-2 text-center">
          <Card className="flex-1 bg-linear-140 from-[#666003]/0 from-30% to-[#666003]/8">
            <h2 className="text-[0.5rem]/[1.875]">IMDB</h2>
            <p className="text-[0.5625rem]/[1.875]">
              <span className="block text-heading-xl">
                {currentMovie.Ratings[0]?.Value?.slice(-6, -3) || `n/a`}
              </span>
              Audience Rating
            </p>
          </Card>
          <Card className="flex-1 bg-linear-140 from-[#661203]/0 from-30% to-[#661203]/8">
            <h2 className="text-[0.5rem]/[1.875]">Rotten Tomatoes</h2>
            <p className="text-[0.5625rem]/[1.875]">
              <span className="block text-heading-xl">
                {currentMovie.Ratings[1]?.Value || `n/a`}
              </span>
              Tomatometer
            </p>
          </Card>
          <Card className="flex-1 bg-linear-140 from-[#031566]/0 from-30% to-[#031566]/8">
            <h2 className="text-[0.5rem]/[1.875]">Metacritic</h2>
            <p className="text-[0.5625rem]/[1.875]">
              <span className="block text-heading-xl">
                {currentMovie.Ratings[2]?.Value.slice(-7, -4) || `n/a`}
              </span>
              Metascore
            </p>
          </Card>
        </section>
        <section>
          <Card className="text-body-sm">
            <h2 className="mb-2">Details</h2>
            <ul className="opacity-65 list-disc list-outside ms-4 leading-loose">
              <li>
                <span className="font-medium">Written By: </span>
                <span className="">{currentMovie.Writer}</span>
              </li>
              {currentMovie.BoxOffice && (
                <li>
                  <span className="font-medium">Domestic Box Office: </span>
                  <span className="">{currentMovie.BoxOffice}</span>
                </li>
              )}
              <li>
                <span className="font-medium">Awards: </span>
                <span className="">{currentMovie.Awards}</span>
              </li>
            </ul>
          </Card>
        </section>
      </main>
    </>
  ) : (
    <div className="opacity-20 flex items-center justify-center gap-4 w-full min-h-dvh">
      <ArrowPathIcon className="size-6 animate-spin" />
      <p>Loading...</p>
    </div>
  );
}
