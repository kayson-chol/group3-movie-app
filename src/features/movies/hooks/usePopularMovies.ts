import { useCallback, useEffect, useState } from "react";
import { getPopularMovies } from "../services/movieApi";
import type { Movie } from "../types";

export function usePopularMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPopularMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPopularMovies();
      setMovies(data.results);
    } catch (err) {
      console.error("Home movie error:", err);
      setError(err instanceof Error ? err.message : "Unable to load movies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPopularMovies();
  }, [loadPopularMovies]);

  return { movies, loading, error, reload: loadPopularMovies };
}
