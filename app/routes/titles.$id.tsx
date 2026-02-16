import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  PlusIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

import { useHistory, useWatchlist } from "../store";
import { getWatchlist, handleToggleClick } from "../utils";

import Card from "../components/Card";
import errorImg from "../assets/image-error-fallback.png";

import type { Route } from "./+types/titles.$id";
import type { FullMediaObj, WatchlistItem } from "../shared.types";

export default function MediaDetail({ params }: Route.ComponentProps) {
  const [currentMedia, setCurrentMedia] = useState<FullMediaObj | null>(null);
  const mediaDetailId: string = params.id ?? "";

  const watchlist = useWatchlist((s) => s.watchlist);
  const addMedia = useWatchlist((s) => s.addMedia);
  const removeMedia = useWatchlist((s) => s.removeMedia);
  useEffect(() => {
    const omdbKey = import.meta.env.VITE_OMDB_KEY;

    async function getDetails() {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${omdbKey}&i=${mediaDetailId}`,
        );
        const data = await res.json();
        setCurrentMedia(data);
      } catch (error) {
        console.log(error);
      }
    }
    getDetails();
  }, []);

  //Check if current search result id is included in local watchlist
  const resultId: string = mediaDetailId;
  const onWatchlist: boolean = getWatchlist({ watchlist }).includes(resultId);

  //Determine back link
  const referralPath = useHistory((s) => s.referralPath);
  const backText = referralPath === "/watchlist" ? "watchlist" : "results";

  if (!currentMedia) {
    return (
      <div className="opacity-20 flex items-center justify-center gap-4 w-full min-h-dvh">
        <ArrowPathIcon className="size-6 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  const watchlistItem: WatchlistItem = {
    Poster: currentMedia.Poster,
    Title: currentMedia.Title,
    Type: currentMedia.Type,
    Year: currentMedia.Year,
    imdbID: currentMedia.imdbID,
  };

  return (
    <>
      <title>QueueUp | Title Details</title>
      <meta
        property="og:title"
        content={`Find ${currentMedia.Title} on QueueUp.`}
      />
      <meta
        name="description"
        content={`Get information about ${currentMedia.Title} and save it to your local watchlist with QueueUp.`}
      />
      <Link
        to={referralPath}
        className="text-body-sm flex items-center gap-1 mb-4"
      >
        <ArrowLeftIcon className="size-3" /> {`Back to ${backText}`}
      </Link>
      <main className="flex flex-col gap-4">
        <section className="flex gap-4">
          <img
            className="max-w-32"
            src={currentMedia.Poster}
            alt={`Poster for ${currentMedia.Title}`}
            onError={(e) => {
              e.currentTarget.src = errorImg;
              e.currentTarget.onerror = null;
            }}
          />
          <div className="flex flex-col items-start gap-4">
            <div>
              <h1 className="text-heading-md">{currentMedia.Title}</h1>
              <div className="text-[0.625rem] text-neutral-700 dark:text-neutral-200 flex gap-2">
                <p>{currentMedia.Year}</p>
                <p>{currentMedia.Runtime}</p>
                <p>{currentMedia.Rated}</p>
              </div>
            </div>
            <div className="text-eyebrow">
              <p className="mb-2">{currentMedia.Genre}</p>
              <p>{`Starring: ${currentMedia.Actors}`}</p>
            </div>
            {onWatchlist ? (
              <button
                onClick={(e) =>
                  handleToggleClick(
                    e,
                    watchlist,
                    watchlistItem,
                    addMedia,
                    removeMedia,
                  )
                }
                className="text-eyebrow text-green-500 flex items-center gap-1 border-[1.5px] rounded-full pl-2 pr-2.5 py-1"
              >
                <CheckIcon className="size-3" />
                Watchlist
              </button>
            ) : (
              <button
                onClick={(e) =>
                  handleToggleClick(
                    e,
                    watchlist,
                    watchlistItem,
                    addMedia,
                    removeMedia,
                  )
                }
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
            <p className="opacity-65">{currentMedia.Plot}</p>
          </Card>
        </section>
        <section className="flex gap-2 text-center">
          <Card className="flex-1 bg-linear-140 from-[#666003]/0 from-30% to-[#666003]/8">
            <h2 className="text-[0.5rem]/[1.875]">IMDB</h2>
            <p className="text-[0.5625rem]/[1.875]">
              <span className="block text-heading-xl">
                {currentMedia.Ratings[0]?.Value.slice(-6, -3) || `n/a`}
              </span>
              Audience Rating
            </p>
          </Card>
          <Card className="flex-1 bg-linear-140 from-[#661203]/0 from-30% to-[#661203]/8">
            <h2 className="text-[0.5rem]/[1.875]">Rotten Tomatoes</h2>
            <p className="text-[0.5625rem]/[1.875]">
              <span className="block text-heading-xl">
                {currentMedia.Ratings[1]?.Value || `n/a`}
              </span>
              Tomatometer
            </p>
          </Card>
          <Card className="flex-1 bg-linear-140 from-[#031566]/0 from-30% to-[#031566]/8">
            <h2 className="text-[0.5rem]/[1.875]">Metacritic</h2>
            <p className="text-[0.5625rem]/[1.875]">
              <span className="block text-heading-xl">
                {currentMedia.Ratings[2]?.Value.slice(-7, -4) || `n/a`}
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
                <span className="">{currentMedia.Writer}</span>
              </li>
              {currentMedia.BoxOffice && (
                <li>
                  <span className="font-medium">Domestic Box Office: </span>
                  <span className="">{currentMedia.BoxOffice}</span>
                </li>
              )}
              <li>
                <span className="font-medium">Awards: </span>
                <span className="">{currentMedia.Awards}</span>
              </li>
            </ul>
          </Card>
        </section>
      </main>
    </>
  );
}
