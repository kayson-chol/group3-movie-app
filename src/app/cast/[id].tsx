import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  CastMember,
  getMovieCast,
  getProfileUrl,
} from "../../services/movieApi";

export default function CastScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCast = async () => {
      try {
        setLoading(true);
        setError("");

        const movieId = Number(id);

        if (!movieId) {
          throw new Error("Invalid movie ID.");
        }

        const data = await getMovieCast(movieId);

        setCast(data.cast);
      } catch (err) {
        console.error("Cast error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load cast."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCast();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
        />

        <Text style={styles.loadingText}>
          Loading cast...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
         <Text style={styles.backButtonText}>
  ← Back
</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>
          ← Back
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Cast
      </Text>

      <FlatList
        data={cast}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => {
          const imageUrl = getProfileUrl(
            item.profile_path,
            "w185"
          );

          return (
            <View style={styles.castCard}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={[
                    styles.profileImage,
                    styles.noImage,
                  ]}
                >
                  <Text style={styles.noImageText}>
                    No Image
                  </Text>
                </View>
              )}

              <View style={styles.castInfo}>
                <Text style={styles.name}>
                  {item.name}
                </Text>

                <Text style={styles.character}>
                  as {item.character || "Unknown"}
                </Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingTop: 45,
    paddingHorizontal: 16,
  },

  center: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1E293B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 20,
  },

  list: {
    paddingBottom: 30,
  },

  castCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },

  profileImage: {
    width: 80,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#334155",
  },

  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: "#94A3B8",
    fontSize: 12,
  },

  castInfo: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },

  character: {
    color: "#94A3B8",
    fontSize: 14,
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
    marginBottom: 20,
  },
});