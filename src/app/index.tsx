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
    console.log("Opening movie:", movieId);

    router.push(`/movie/${movieId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie App</Text>

      <Text style={styles.subtitle}>
        Discover popular movies
      </Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#FFFFFF"
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => openMovie(item.id)}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
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
    paddingTop: 60,
    paddingHorizontal: 15,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    color: "#CBD5E1",
    marginBottom: 20,
  },

  list: {
    paddingBottom: 30,
  },

  row: {
    justifyContent: "space-between",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 15,
  },

  retry: {
    color: "#60A5FA",
    fontSize: 16,
    fontWeight: "bold",
  },
});