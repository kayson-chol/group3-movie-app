import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import YoutubePlayer from "react-native-youtube-iframe";
import { getPosterUrl } from "../services/movieApi";
import { useMovieDetails } from "../hooks/useMovieDetails";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { movie, trailer, loading, error } = useMovieDetails(id);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#3B82F6" /><Text style={styles.loadingText}>Loading movie details...</Text></View>;

  if (error || !movie) {
    return <View style={styles.center}>
      <Text style={styles.errorText}>{error || "Movie not found."}</Text>
      <TouchableOpacity style={styles.errorBackButton} onPress={() => router.back()}><Text style={styles.backButtonText}>Go Back</Text></TouchableOpacity>
    </View>;
  }

  const posterUrl = getPosterUrl(movie.poster_path, "w500");
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : "Unknown";

  return <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={20} color="#FFFFFF" /><Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>

    {posterUrl ? <Image source={{ uri: posterUrl }} style={styles.poster} resizeMode="cover" /> : <View style={styles.noPoster}><Ionicons name="image-outline" size={50} color="#64748B" /><Text style={styles.noPosterText}>No poster available</Text></View>}

    <View style={styles.content}>
      <Text style={styles.title}>{movie.title}</Text>
      <View style={styles.mainMetaRow}>
        <View style={styles.ratingBadge}><Ionicons name="star" size={17} color="#FACC15" /><Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text></View>
        <View style={styles.metaBadge}><Ionicons name="calendar-outline" size={16} color="#CBD5E1" /><Text style={styles.metaBadgeText}>{releaseYear}</Text></View>
        {movie.runtime ? <View style={styles.metaBadge}><Ionicons name="time-outline" size={16} color="#CBD5E1" /><Text style={styles.metaBadgeText}>{movie.runtime} min</Text></View> : null}
      </View>

      {movie.genres && movie.genres.length > 0 && <View style={styles.genreContainer}>{movie.genres.map((genre) => <View key={genre.id} style={styles.genreBadge}><Text style={styles.genreText}>{genre.name}</Text></View>)}</View>}

      <Text style={styles.sectionTitle}>Official Trailer</Text>
      {trailer ? <View style={styles.videoContainer}><YoutubePlayer height={220} videoId={trailer.key} play={false} /></View> : <View style={styles.noTrailer}><Ionicons name="videocam-off-outline" size={35} color="#64748B" /><Text style={styles.noTrailerText}>No trailer available for this movie.</Text></View>}

      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.overview}>{movie.overview || "No overview available for this movie."}</Text>

      <TouchableOpacity style={styles.castButton} onPress={() => router.push(`/cast/${movie.id}`)}>
        <Ionicons name="people" size={21} color="#FFFFFF" /><Text style={styles.castButtonText}>View Cast</Text><Ionicons name="chevron-forward" size={21} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  center: { flex: 1, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { color: "#CBD5E1", marginTop: 12, fontSize: 16 },
  errorText: { color: "#F87171", fontSize: 16, textAlign: "center", marginBottom: 20 },
  backButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", backgroundColor: "#1E293B", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, margin: 15, gap: 7 },
  errorBackButton: { backgroundColor: "#2563EB", paddingHorizontal: 20, paddingVertical: 11, borderRadius: 10 },
  backButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  poster: { width: "100%", height: 520, backgroundColor: "#1E293B" },
  noPoster: { height: 520, justifyContent: "center", alignItems: "center", backgroundColor: "#1E293B" },
  noPosterText: { color: "#64748B", marginTop: 10 },
  content: { padding: 20 },
  title: { color: "#FFFFFF", fontSize: 30, fontWeight: "800", lineHeight: 36, marginBottom: 15 },
  mainMetaRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },
  ratingBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#1E293B", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  ratingText: { color: "#FFFFFF", fontWeight: "700" },
  metaBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#1E293B", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  metaBadgeText: { color: "#CBD5E1" },
  genreContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  genreBadge: { backgroundColor: "#334155", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  genreText: { color: "#CBD5E1", fontSize: 13 },
  sectionTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", marginTop: 10, marginBottom: 12 },
  videoContainer: { overflow: "hidden", borderRadius: 12, backgroundColor: "#000000", marginBottom: 10 },
  noTrailer: { minHeight: 110, backgroundColor: "#1E293B", borderRadius: 12, justifyContent: "center", alignItems: "center", padding: 20, marginBottom: 10 },
  noTrailerText: { color: "#94A3B8", marginTop: 8 },
  overview: { color: "#CBD5E1", fontSize: 15, lineHeight: 24, marginBottom: 25 },
  castButton: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#2563EB", padding: 15, borderRadius: 12, marginBottom: 35 },
  castButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 },
});
