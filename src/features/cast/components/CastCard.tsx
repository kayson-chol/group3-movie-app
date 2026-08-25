import { Image, StyleSheet, Text, View } from "react-native";
import { getProfileUrl } from "../services/castApi";
import type { CastMember } from "../types";

export default function CastCard({ member }: { member: CastMember }) {
  const imageUrl = getProfileUrl(member.profile_path, "w185");

  return (
    <View style={styles.castCard}>
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.profileImage} /> : <View style={[styles.profileImage, styles.noImage]}><Text style={styles.noImageText}>No Image</Text></View>}
      <View style={styles.castInfo}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.character}>as {member.character || "Unknown"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  castCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E293B", borderRadius: 12, padding: 10, marginBottom: 12 },
  profileImage: { width: 80, height: 100, borderRadius: 10, backgroundColor: "#334155" },
  noImage: { justifyContent: "center", alignItems: "center" },
  noImageText: { color: "#94A3B8", fontSize: 12 },
  castInfo: { flex: 1, marginLeft: 14 },
  name: { color: "#FFFFFF", fontSize: 17, fontWeight: "700", marginBottom: 6 },
  character: { color: "#94A3B8", fontSize: 14 },
});
