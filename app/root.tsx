import {
  Outlet,
  Scripts,
  useSearchParams,
  Links,
  type URLSearchParamsInit,
} from "react-router";
import Navbar from "./components/Navbar";
import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import "./global.css";

export type Context = {
  queue: string[];
  setQueue: Dispatch<React.SetStateAction<string[]>>;
  searchParams: URLSearchParams | undefined;
  setSearchParams: Dispatch<SetStateAction<URLSearchParamsInit>>;
};

const QueueContext = createContext<Context>({
  queue: [],
  setQueue: () => {},
  searchParams: undefined,
  setSearchParams: () => {},
});

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queue, setQueue] = useState(
    window
      ? (Array.from(
          JSON.parse(localStorage.getItem("watchlist") || '""'),
        ) as string[])
      : [],
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/queueup-favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:image" content="/queueup-thumbnail.jpg" />
        <Links />
        <title>queueup-movie-search</title>
      </head>
      <body>
        <div className="px-4">
          <Navbar />
          <QueueContext
            value={{ queue, setQueue, searchParams, setSearchParams }}
          >
            <Outlet />
          </QueueContext>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export { QueueContext };
