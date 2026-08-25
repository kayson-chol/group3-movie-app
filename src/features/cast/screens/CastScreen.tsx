import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CastCard from "../components/CastCard";
import { useMovieCast } from "../hooks/useMovieCast";

export default function CastScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { cast, loading, error } = useMovieCast(id);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFFFFF" /><Text style={styles.loadingText}>Loading cast...</Text></View>;

  if (error) return <View style={styles.center}><Text style={styles.errorText}>{error}</Text><TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Text style={styles.backButtonText}>← Back</Text></TouchableOpacity></View>;

  return <View style={styles.container}>
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Text style={styles.backButtonText}>← Back</Text></TouchableOpacity>
    <Text style={styles.title}>Cast</Text>
    <FlatList
      data={cast}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <CastCard member={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", paddingTop: 45, paddingHorizontal: 16 },
  center: { flex: 1, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center", padding: 20 },
  backButton: { alignSelf: "flex-start", backgroundColor: "#1E293B", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, marginBottom: 20 },
  backButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  title: { color: "#FFFFFF", fontSize: 30, fontWeight: "800", marginBottom: 20 },
  list: { paddingBottom: 30 },
  loadingText: { color: "#CBD5E1", marginTop: 10, fontSize: 16 },
  errorText: { color: "#F87171", fontSize: 16, textAlign: "center", marginBottom: 20 },
});
