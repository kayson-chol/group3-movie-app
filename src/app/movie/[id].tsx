import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import YoutubePlayer from "react-native-youtube-iframe";
import {
  getMovieDetails,
  getMovieVideos,
  getPosterUrl,
  Movie,
  MovieVideo,
} from "../../services/movieApi";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<MovieVideo | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const movieId = Number(id);

        if (!movieId) {
          throw new Error("Invalid movie ID.");
        }

        const [movieData, videoData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieVideos(movieId),
        ]);

        setMovie(movieData);

        const selectedTrailer =
  // 1. Best choice: official YouTube trailer
  videoData.results.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      video.official === true
  ) ||

  // 2. Any YouTube trailer
  videoData.results.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer"
  ) ||

  // 3. Fallback: official teaser
  videoData.results.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Teaser" &&
      video.official === true
  ) ||

  // 4. Last fallback: any YouTube video
  videoData.results.find(
    (video) =>
      video.site === "YouTube"
  ) ||

  null;

        setTrailer(selectedTrailer);
      } catch (err) {
        console.error("Movie details error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load movie details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
        />

        <Text style={styles.loadingText}>
          Loading movie details...
        </Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error || "Movie not found."}
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const posterUrl = getPosterUrl(
    movie.poster_path,
    "w500"
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>
          ← Back
        </Text>
      </TouchableOpacity>

      {posterUrl && (
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>
          {movie.title}
        </Text>

        <Text style={styles.rating}>
          ⭐ {movie.vote_average.toFixed(1)}
        </Text>

        <Text style={styles.info}>
          Release Date:{" "}
          {movie.release_date || "Unknown"}
        </Text>

        {movie.runtime && (
          <Text style={styles.info}>
            Runtime: {movie.runtime} minutes
          </Text>
        )}

        {movie.genres &&
          movie.genres.length > 0 && (
            <Text style={styles.info}>
              Genres:{" "}
              {movie.genres
                .map((genre) => genre.name)
                .join(", ")}
            </Text>
          )}

        <Text style={styles.sectionTitle}>
  Official Trailer
</Text>
{trailer ? (
  <View style={styles.videoContainer}>
    <YoutubePlayer
      height={220}
      videoId={trailer.key}
      play={false}
    />
  </View>
) : (
  <View style={styles.noTrailer}>
    <Text style={styles.noTrailerText}>
      No trailer available for this movie.
    </Text>
  </View>
)}

<Text style={styles.sectionTitle}>
  Overview
</Text>
       <TouchableOpacity
  style={styles.castButton}
  onPress={() => {
    router.push({
      pathname: "/cast/[id]",
      params: {
        id: movie.id.toString(),
      },
    });
  }}
>
  <Text style={styles.castButtonText}>
    View Cast
  </Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  center: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loadingText: {
    color: "#CBD5E1",
    marginTop: 10,
    fontSize: 16,
  },

  errorText: {
    color: "#F87171",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1E293B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 15,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  poster: {
    width: "100%",
    height: 500,
    backgroundColor: "#1E293B",
  },

  content: {
    padding: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  rating: {
    color: "#FACC15",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  info: {
    color: "#CBD5E1",
    fontSize: 15,
    marginBottom: 8,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 10,
  },

  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000000",
    borderRadius: 12,
    overflow: "hidden",
  },

  
  noTrailer: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },

  noTrailerText: {
    color: "#94A3B8",
    fontSize: 15,
    textAlign: "center",
  },

  overview: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 24,
  },

  castButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
  },

  castButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});