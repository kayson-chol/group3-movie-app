import { TMDB_API_KEY, TMDB_BASE_URL } from "../config/apiConfig";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  runtime?: number;
  genres?: {
    id: number;
    name: string;
  }[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CastResponse {
  id: number;
  cast: CastMember[];
  crew: any[];
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MovieVideoResponse {
  id: number;
  results: MovieVideo[];
}
const checkApiKey = () => {
  if (!TMDB_API_KEY) {
    throw new Error(
      "TMDB API key is missing. Check your .env file."
    );
  }
};

// Get popular movies
export const getPopularMovies = async (
  page: number = 1
): Promise<MovieResponse> => {
  checkApiKey();

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("TMDB Popular Movies Error:", errorText);

    throw new Error(
      `TMDB request failed: ${response.status}`
    );
  }

  return response.json();
};

// Search movies by title
export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<MovieResponse> => {
  checkApiKey();

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

  console.log("Searching TMDB for:", cleanQuery);

  const response = await fetch(url);

  console.log("TMDB Search Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "TMDB Search Error:",
      errorText
    );

    throw new Error(
      `TMDB search failed: ${response.status}`
    );
  }

  const data: MovieResponse = await response.json();

  console.log(
    "TMDB Search Results:",
    data.results.length
  );

  return data;
};

// Get details of one movie by ID
export const getMovieDetails = async (
  movieId: number
): Promise<Movie> => {
  checkApiKey();

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("TMDB Movie Details Error:", errorText);

    throw new Error(
      `TMDB request failed: ${response.status}`
    );
  }

  return response.json();
};

// Get cast of one movie by ID
export const getMovieCast = async (
  movieId: number
): Promise<CastResponse> => {
  checkApiKey();

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("TMDB Cast Error:", errorText);

    throw new Error(
      `TMDB request failed: ${response.status}`
    );
  }

  return response.json();
};

// Get videos/trailers for one movie
export const getMovieVideos = async (
  movieId: number
): Promise<MovieVideoResponse> => {
  checkApiKey();

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "TMDB Movie Videos Error:",
      errorText
    );

    throw new Error(
      `TMDB videos request failed: ${response.status}`
    );
  }

  return response.json();
};

// Get movie poster URL
export const getPosterUrl = (
  posterPath: string | null,
  size: "w185" | "w342" | "w500" = "w342"
): string | null => {
  if (!posterPath) {
    return null;
  }

  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};

// Get actor profile image URL
export const getProfileUrl = (
  profilePath: string | null,
  size: "w185" | "w342" | "w500" = "w185"
): string | null => {
  if (!profilePath) {
    return null;
  }

  return `https://image.tmdb.org/t/p/${size}${profilePath}`;
};