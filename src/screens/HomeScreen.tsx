import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getPopularMovies } from '../services/movieApi';

export default function HomeScreen() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await getPopularMovies();
      setMovies(data);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovie = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.movieCard}>
        <Image
          source={{
            uri: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : 'https://via.placeholder.com/300x450',
          }}
          style={styles.poster}
        />

        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.rating}>
          ⭐ {item.vote_average?.toFixed(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Movie App</Text>
      <Text style={styles.subtitle}>Popular Movies</Text>

      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.movieList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },

  movieList: {
    paddingBottom: 20,
  },

  movieCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 6,
    borderRadius: 10,
    padding: 8,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  poster: {
    width: '100%',
    height: 230,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },

  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },

  rating: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});