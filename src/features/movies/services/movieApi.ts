import { TMDB_API_KEY, TMDB_BASE_URL } from "../../../config/apiConfig";
import type {
  Movie,
  MovieResponse,
  MovieVideoResponse,
} from "../types";
import type { CastResponse } from "../../cast/types";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const checkApiKey = () => {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is missing. Check your .env file.");
  }
};

const request = async <T>(url: string, errorLabel: string): Promise<T> => {
  checkApiKey();

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`${errorLabel}:`, errorText);
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const getPopularMovies = async (page = 1): Promise<MovieResponse> => {
  const url =
    `${TMDB_BASE_URL}/movie/popular` +
    `?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;

  return request<MovieResponse>(url, "TMDB Popular Movies Error");
};

export const searchMovies = async (
  query: string,
  page = 1
): Promise<MovieResponse> => {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  const url =
    `${TMDB_BASE_URL}/search/movie` +
    `?api_key=${TMDB_API_KEY}` +
    `&language=en-US` +
    `&query=${encodeURIComponent(cleanQuery)}` +
    `&page=${page}` +
    `&include_adult=false`;

  return request<MovieResponse>(url, "TMDB Search Error");
};

export const getMovieDetails = async (movieId: number): Promise<Movie> => {
  const url =
    `${TMDB_BASE_URL}/movie/${movieId}` +
    `?api_key=${TMDB_API_KEY}&language=en-US`;

  return request<Movie>(url, "TMDB Movie Details Error");
};

export const getMovieCast = async (movieId: number): Promise<CastResponse> => {
  const url =
    `${TMDB_BASE_URL}/movie/${movieId}/credits` +
    `?api_key=${TMDB_API_KEY}&language=en-US`;

  return request<CastResponse>(url, "TMDB Cast Error");
};

export const getMovieVideos = async (
  movieId: number
): Promise<MovieVideoResponse> => {
  const url =
    `${TMDB_BASE_URL}/movie/${movieId}/videos` +
    `?api_key=${TMDB_API_KEY}&language=en-US`;

  return request<MovieVideoResponse>(url, "TMDB Movie Videos Error");
};

export const getPosterUrl = (
  posterPath: string | null,
  size: "w185" | "w342" | "w500" = "w342"
): string | null => {
  if (!posterPath) return null;
  return `${IMAGE_BASE_URL}/${size}${posterPath}`;
};

export const getProfileUrl = (
  profilePath: string | null,
  size: "w185" | "w342" | "w500" = "w185"
): string | null => {
  if (!profilePath) return null;
  return `${IMAGE_BASE_URL}/${size}${profilePath}`;
};
