import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Movie, getPosterUrl } from "../services/movieApi";

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

export default function MovieCard({ movie, onPress }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path, "w342");

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Text style={styles.noPosterText}>No Image</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>

        <Text style={styles.rating}>
          ⭐ {movie.vote_average.toFixed(1)}
        </Text>

        <Text style={styles.year}>
          {movie.release_date
            ? movie.release_date.substring(0, 4)
            : "Unknown"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 15,
    marginBottom: 20,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    overflow: "hidden",
  },

  poster: {
    width: "100%",
    height: 230,
    backgroundColor: "#334155",
  },

  noPoster: {
    justifyContent: "center",
    alignItems: "center",
  },

  noPosterText: {
    color: "#94A3B8",
    fontSize: 14,
  },

  info: {
    padding: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  rating: {
    color: "#FACC15",
    fontSize: 14,
    marginBottom: 4,
  },

  year: {
    color: "#94A3B8",
    fontSize: 13,
  },
});