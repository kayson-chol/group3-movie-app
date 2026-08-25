import { useCallback, useState } from "react";
import { searchMovies } from "../services/movieApi";
import type { Movie } from "../types";

export function useMovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async () => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setMovies([]);
      setError("Please enter a movie title.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await searchMovies(cleanQuery);
      setMovies(data.results);

      if (data.results.length === 0) {
        setError("No movies found.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Unable to search movies.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const clear = useCallback(() => {
    setQuery("");
    setMovies([]);
    setError("");
  }, []);

  return { query, setQuery, movies, loading, error, search, clear };
}
