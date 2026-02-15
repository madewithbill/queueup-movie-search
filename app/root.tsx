import type { ReactNode } from "react";
import { Outlet, Scripts, Links, ScrollRestoration } from "react-router";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import "./global.css";
import Navbar from "./components/Navbar";

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
  return <Outlet />;
}
