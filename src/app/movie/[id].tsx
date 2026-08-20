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
import { Ionicons } from "@expo/vector-icons";
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
          // Prefer official trailer
          videoData.results.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer" &&
              video.official === true
          ) ||
          // Any trailer
          videoData.results.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer"
          ) ||
          // Official teaser
          videoData.results.find(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Teaser" &&
              video.official === true
          ) ||
          // Last available YouTube video
          videoData.results.find(
            (video) => video.site === "YouTube"
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
          color="#3B82F6"
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
          style={styles.errorBackButton}
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

  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "Unknown";

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={20}
          color="#FFFFFF"
        />

        <Text style={styles.backButtonText}>
          Back
        </Text>
      </TouchableOpacity>

      {/* Movie Poster */}
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noPoster}>
          <Ionicons
            name="image-outline"
            size={50}
            color="#64748B"
          />

          <Text style={styles.noPosterText}>
            No poster available
          </Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Movie Title */}
        <Text style={styles.title}>
          {movie.title}
        </Text>

        {/* Rating + Year */}
        <View style={styles.mainMetaRow}>
          <View style={styles.ratingBadge}>
            <Ionicons
              name="star"
              size={17}
              color="#FACC15"
            />

            <Text style={styles.ratingText}>
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>

          <View style={styles.metaBadge}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#CBD5E1"
            />

            <Text style={styles.metaBadgeText}>
              {releaseYear}
            </Text>
          </View>

          {movie.runtime ? (
            <View style={styles.metaBadge}>
              <Ionicons
                name="time-outline"
                size={16}
                color="#CBD5E1"
              />

              <Text style={styles.metaBadgeText}>
                {movie.runtime} min
              </Text>
            </View>
          ) : null}
        </View>

        {/* Genres */}
        {movie.genres &&
          movie.genres.length > 0 && (
            <View style={styles.genreContainer}>
              {movie.genres.map((genre) => (
                <View
                  key={genre.id}
                  style={styles.genreBadge}
                >
                  <Text style={styles.genreText}>
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          )}

        {/* Trailer */}
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
            <Ionicons
              name="videocam-off-outline"
              size={35}
              color="#64748B"
            />

            <Text style={styles.noTrailerText}>
              No trailer available for this movie.
            </Text>
          </View>
        )}

        {/* Overview */}
        <Text style={styles.sectionTitle}>
          Overview
        </Text>

        <Text style={styles.overview}>
          {movie.overview ||
            "No overview available for this movie."}
        </Text>

        {/* View Cast */}
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
          <Ionicons
            name="people"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.castButtonText}>
            View Cast
          </Text>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#FFFFFF"
          />
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
    marginTop: 12,
    fontSize: 16,
  },

  errorText: {
    color: "#F87171",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#1E293B",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 15,
    gap: 7,
  },

  errorBackButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  poster: {
    width: "100%",
    height: 500,
    backgroundColor: "#1E293B",
  },

  noPoster: {
    height: 400,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },

  noPosterText: {
    color: "#94A3B8",
    marginTop: 10,
  },

  content: {
    padding: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
    lineHeight: 36,
    marginBottom: 14,
  },

  mainMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },

  ratingText: {
    color: "#FACC15",
    fontSize: 14,
    fontWeight: "700",
  },

  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },

  metaBadgeText: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
  },

  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 5,
  },

  genreBadge: {
    backgroundColor: "#1D4ED8",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },

  genreText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 26,
    marginBottom: 12,
  },

  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000000",
    borderRadius: 14,
    overflow: "hidden",
  },

  noTrailer: {
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  noTrailerText: {
    color: "#94A3B8",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },

  overview: {
    color: "#CBD5E1",
    fontSize: 16,
    lineHeight: 25,
  },

  castButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 28,
    marginBottom: 35,
    gap: 10,
  },

  castButtonText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
});