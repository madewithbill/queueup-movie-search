// import { Children } from "react";

import type { ReactNode } from "react";

export default function NoResultsText({ children }: { children: ReactNode }) {
  return (
    <h2 className="opacity-50 text-heading-lg text-neutral-700 dark:text-neutral-200">
      {children}
    </h2>
  );
}
