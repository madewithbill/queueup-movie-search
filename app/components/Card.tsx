import type React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler;
  id?: string;
};

export default function Card({ children, className, onClick, id }: CardProps) {
  return (
    <article
      className={`relative text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900 border rounded-lg border-neutral-200 dark:border-neutral-800 p-4 ${className}`}
      onClick={onClick}
      id={id}
    >
      {children}
    </article>
  );
}
