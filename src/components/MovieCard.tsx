import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Movie,
  getPosterUrl,
} from "../services/movieApi";

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

export default function MovieCard({
  movie,
  onPress,
}: MovieCardProps) {
  const posterUrl = getPosterUrl(
    movie.poster_path,
    "w342"
  );

  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "Unknown";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.poster,
            styles.noPoster,
          ]}
        >
          <Text style={styles.noPosterText}>
            No Image
          </Text>
        </View>
      )}

      <View style={styles.info}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {movie.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.rating}>
            ⭐ {movie.vote_average.toFixed(1)}
          </Text>

          <Text style={styles.year}>
            {releaseYear}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#1E293B",
    borderRadius: 14,
    overflow: "hidden",
  },

  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
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
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
    minHeight: 40,
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rating: {
    color: "#FACC15",
    fontSize: 13,
    fontWeight: "600",
  },

  year: {
    color: "#94A3B8",
    fontSize: 13,
  },
});