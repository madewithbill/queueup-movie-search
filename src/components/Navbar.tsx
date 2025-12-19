import { useContext } from "react";
import { QueueContext } from "./AppLayout";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const context = useContext(QueueContext);
  const setSearchParams = context.setSearchParams;

  return (
    <nav className="flex items-center gap-4 py-4 mb-8">
      <Link
        className="text-heading-md mr-auto"
        to="/"
        onClick={() => {
          setSearchParams("");
        }}
      >
        QueueUp
      </Link>
      <Link to="/">
        <MagnifyingGlassIcon className="size-6" />
      </Link>
      <Link to="/watchlist">
        <QueueListIcon className="size-6" />
      </Link>
    </nav>
  );
}
