import React from 'react';
import { View, Text, Image, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import images from '../assets';
import colors, { fonts } from '../utils/theme';

// The hero section: restaurant name/location, a short description,
// the hero image, and a search bar that filters the menu list below.
export default function Hero({ searchText, onSearchChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Little Lemon</Text>
      <Text style={styles.subtitle}>Chicago</Text>

      <View style={styles.row}>
        <Text style={styles.description}>
          We are a family owned Mediterranean restaurant, focused on
          traditional recipes served with a modern twist.
        </Text>
        <Image source={images.heroImage} style={styles.heroImage} resizeMode="cover" />
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.highlightBlack} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu"
          placeholderTextColor="#6b6b6b"
          value={searchText}
          onChangeText={onSearchChange}
          testID="hero-search-input"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryGreen,
    padding: 20,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.primaryYellow,
  },
  subtitle: {
    fontFamily: fonts.displayRegular,
    fontSize: 24,
    color: colors.white,
    marginTop: -6,
  },
  row: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  description: {
    flex: 1,
    fontFamily: fonts.body,
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    marginRight: 16,
  },
  heroImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 18,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.highlightBlack,
  },
});
