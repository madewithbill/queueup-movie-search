# QueueUp - OMDB Movie and TV Search

A React-based app to find and save favorite movies and tv shows. This is based on a Scrimba porject challenge, with some personal stretch goals to try out new tooling and techniques.

Currently, two official plugins are available:

## Functionality

- User can search for a movie or TV show in OMDB database. Total results are shown, with each card clickable to show a detail page.
- Detail pages for each result, providing additional information such as summaries and ratings.
- Watchlist of saved movies, with the ability to sort with a dropdown filter.

## Key Techniques

- Design system buildout with static mobile prototypes. Created with Tailwind in mind for general styling, in addition to custom properties custom theme variables.
- Mobile first styling with Tailwind and custom CSS, mostly for the typography system.
- Fetch requests to the OMDB API, with dynamic pagination to call and show more results on demand.
- Local storage management to save/retrieve watchlist movie data.
- React Router v6 and useContext for navigation, dynamic routes, and passing state to nested routes.

## Tooling

- Figma, VSCode, Netlify
- React
- React Router v6
- Typescript
- Tailwind
- [react-infinite-scroll-component](https://www.npmjs.com/package/react-infinite-scroll-component)

- [Heroicons](https://heroicons.com/outline)
