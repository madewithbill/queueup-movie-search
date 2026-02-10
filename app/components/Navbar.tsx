import { Link } from "react-router";
import {
  MagnifyingGlassIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <nav className="flex items-center gap-4 py-4 mb-8">
      <Link className="text-heading-md mr-auto" to="/">
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
