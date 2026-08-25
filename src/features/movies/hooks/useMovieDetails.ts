import { useEffect, useState } from "react";
import { getMovieDetails, getMovieVideos } from "../services/movieApi";
import type { Movie, MovieVideo } from "../types";

function selectTrailer(videos: MovieVideo[]): MovieVideo | null {
  return (
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ??
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.find((v) => v.site === "YouTube" && v.type === "Teaser" && v.official) ??
    videos.find((v) => v.site === "YouTube") ??
    null
  );
}

export function useMovieDetails(id?: string) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<MovieVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const movieId = Number(id);
        if (!movieId) throw new Error("Invalid movie ID.");

        const [movieData, videoData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieVideos(movieId),
        ]);

        if (!active) return;
        setMovie(movieData);
        setTrailer(selectTrailer(videoData.results));
      } catch (err) {
        if (!active) return;
        console.error("Movie details error:", err);
        setError(
          err instanceof Error ? err.message : "Unable to load movie details."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [id]);

  return { movie, trailer, loading, error };
}
