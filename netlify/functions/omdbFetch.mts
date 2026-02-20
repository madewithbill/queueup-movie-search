import type { Context } from "@netlify/functions";

export default async (request: Request, context: Context) => {
  const omdbKey = Netlify.env.get("OMDB_KEY");
  const query = new URL(request.url).searchParams.toString();

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${omdbKey}&${query}`,
  );
  const data = await res.json();
  return Response.json(data);
};
