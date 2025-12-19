import {
  Outlet,
  useSearchParams,
  type URLSearchParamsInit,
} from "react-router-dom";
import Navbar from "./Navbar";
import {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export type Context = {
  queue: string[];
  setQueue: Dispatch<React.SetStateAction<string[]>>;
  searchParams: URLSearchParams | undefined;
  setSearchParams: Dispatch<SetStateAction<URLSearchParamsInit>>;
};

export const QueueContext = createContext<Context>({
  queue: [],
  setQueue: () => {},
  searchParams: undefined,
  setSearchParams: () => {},
});

export default function AppLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queue, setQueue] = useState(
    Array.from(
      JSON.parse(localStorage.getItem("watchlist") || '""')
    ) as string[]
  );

  return (
    <div className="px-4">
      <Navbar />
      <QueueContext value={{ queue, setQueue, searchParams, setSearchParams }}>
        <Outlet />
      </QueueContext>
    </div>
  );
}
