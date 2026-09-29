import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import colors, { fonts } from '../utils/theme';

// Category chips. Multiple categories can be active at once (that's
// how the real Little Lemon app behaves — tapping a chip toggles it
// on/off and the list below shows the union of the active categories).
export default function MenuBreakdown({ categories, activeCategories, onToggleCategory }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ORDER FOR DELIVERY!</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => {
          const isActive = activeCategories.includes(category);
          return (
            <TouchableOpacity
              key={category}
              onPress={() => onToggleCategory(category)}
              style={[styles.chip, isActive && styles.chipActive]}
              testID={`category-chip-${category}`}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  heading: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.highlightBlack,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  chip: {
    backgroundColor: colors.highlightGray,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: colors.primaryGreen,
  },
  chipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.highlightBlack,
  },
  chipTextActive: {
    color: colors.white,
  },
});
