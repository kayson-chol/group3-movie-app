import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MovieDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Movie Details</Text>
      <Text>Movie Details Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});