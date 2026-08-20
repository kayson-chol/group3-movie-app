import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import MovieCard from "../components/MovieCard";
import { getPopularMovies, Movie } from "../services/movieApi";

export default function HomeScreen() {
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPopularMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPopularMovies();
      setMovies(data.results);
    } catch (err) {
      console.error("Home movie error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load movies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopularMovies();
  }, []);

  const openMovie = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Movie Explorer
        </Text>

        <Text style={styles.subtitle}>
          Discover popular movies
        </Text>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#3B82F6"
          />

          <Text style={styles.loadingText}>
            Loading movies...
          </Text>
        </View>
      )}

      {!loading && error !== "" && (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <Text
            style={styles.retry}
            onPress={loadPopularMovies}
          >
            Tap here to try again
          </Text>
        </View>
      )}

      {!loading && error === "" && (
        <FlatList
          data={movies}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <MovieCard
                movie={item}
                onPress={() =>
                  openMovie(item.id)
                }
              />
            </View>
          )}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingTop: 55,
    paddingHorizontal: 16,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 15,
    color: "#94A3B8",
    marginTop: 4,
  },

  list: {
    paddingBottom: 100,
  },

  row: {
    justifyContent: "flex-start",
    gap: 14,
  },

  cardWrapper: {
    flex: 1,
    maxWidth: 190,
    marginBottom: 18,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  loadingText: {
    color: "#CBD5E1",
    marginTop: 12,
    fontSize: 15,
  },

  errorText: {
    color: "#F87171",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },

  retry: {
    color: "#60A5FA",
    fontSize: 16,
    fontWeight: "700",
  },
});