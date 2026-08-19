import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import MovieCard from "../components/MovieCard";
import { Movie, searchMovies } from "../services/movieApi";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setMovies([]);
      setError("Please enter a movie title.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchMovies(query.trim());

      setMovies(data.results);

      if (data.results.length === 0) {
        setError("No movies found.");
      }
    } catch (err) {
      console.error("Search error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to search movies."
      );

      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Movies</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search movie title..."
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSearch}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFFFFF" />

          <Text style={styles.loadingText}>
            Searching for movies...
          </Text>
        </View>
      )}

      {!loading && error !== "" && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && error === "" && movies.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            Search for a movie to get started.
          </Text>
        </View>
      )}

      {!loading && movies.length > 0 && (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => {
                console.log("Selected movie:", item.id);
              }}
            />
          )}
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#1E293B",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: 10,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
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
    paddingHorizontal: 20,
  },

  loadingText: {
    color: "#CBD5E1",
    marginTop: 10,
    fontSize: 16,
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: 16,
    textAlign: "center",
  },

  errorText: {
    color: "#F87171",
    fontSize: 16,
    textAlign: "center",
  },
});