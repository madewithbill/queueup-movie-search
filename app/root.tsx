import {
  Outlet,
  Scripts,
  useSearchParams,
  Links,
  type URLSearchParamsInit,
  ScrollRestoration,
} from "react-router";
import Navbar from "./components/Navbar";
import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import "./global.css";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

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

export function HydrateFallback() {
  return (
    <div className="w-full flex flex-col items-center gap-2 min-h-32">
      <ArrowPathIcon className="block size-6 animate-spin" />
      <h1 className="text-xl">Loading...</h1>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/queueup-favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:image" content="/queueup-thumbnail.jpg" />
        <Links />
        <title>QueueUp Movie and TV Search</title>
      </head>
      <body className="px-4">
        <Navbar />
        {children}
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}

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
    <QueueContext value={{ queue, setQueue, searchParams, setSearchParams }}>
      <Outlet />
    </QueueContext>
  );
}

export { QueueContext };
