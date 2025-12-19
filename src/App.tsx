import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import AppLayout from "./components/AppLayout";
import MovieDetail from "./pages/MovieDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="movies/:id" element={<MovieDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
