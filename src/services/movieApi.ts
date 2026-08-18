import { TMDB_API_KEY, TMDB_BASE_URL } from "../config/apiConfig";

export const getPopularMovies = async () => {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is missing.");
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
};

export const getMovieDetails = async (movieId: number) => {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is missing.");
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
};

export const searchMovies = async (query: string) => {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is missing.");
  }

  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
};