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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import MovieCard from "../components/MovieCard";
import {
  Movie,
  searchMovies,
} from "../services/movieApi";

export default function SearchScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setMovies([]);
      setError("Please enter a movie title.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchMovies(cleanQuery);

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

  const openMovie = (movieId: number) => {
    router.push({
      pathname: "/movie/[id]",
      params: {
        id: movieId.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Search Movies
      </Text>

      <Text style={styles.subtitle}>
        Find movies by title
      </Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={21}
          color="#94A3B8"
        />

        <TextInput
          style={styles.input}
          placeholder="Search movie title..."
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={(text) => {
            setQuery(text);

            if (error) {
              setError("");
            }
          }}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />

        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setMovies([]);
              setError("");
            }}
          >
            <Ionicons
              name="close-circle"
              size={21}
              color="#94A3B8"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Ionicons
            name="search"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#3B82F6"
          />

          <Text style={styles.loadingText}>
            Searching for movies...
          </Text>
        </View>
      )}

      {!loading && error !== "" && (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      {!loading &&
        error === "" &&
        movies.length === 0 && (
          <View style={styles.center}>
            <Ionicons
              name="film-outline"
              size={50}
              color="#475569"
            />

            <Text style={styles.emptyText}>
              Search for a movie to get started.
            </Text>
          </View>
        )}

      {!loading && movies.length > 0 && (
        <FlatList
          data={movies}
          keyExtractor={(item) =>
            item.id.toString()
          }
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    marginTop: 4,
    marginBottom: 20,
  },

  searchContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 14,
    paddingLeft: 14,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingHorizontal: 10,
  },

  searchButton: {
    height: 52,
    width: 52,
    backgroundColor: "#2563EB",
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
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

  emptyText: {
    color: "#94A3B8",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },

  errorText: {
    color: "#F87171",
    fontSize: 16,
    textAlign: "center",
  },
});