import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors, { fonts } from '../utils/theme';

function MenuRow({ item }) {
  return (
    <View style={styles.row} testID={`menu-item-${item.id}`}>
      <View style={styles.textColumn}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
    </View>
  );
}

// A "summarized view" of each item: name, a two-line description,
// price, and a thumbnail — not the full detail page.
// Rendered as a plain View (not a FlatList) because it lives inside
// Home's outer ScrollView, and the list is short enough that a
// second virtualized list would only add complexity and trigger
// React Native's "VirtualizedLists should never be nested" warning.
export default function MenuList({ items }) {
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No dishes match your search.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContent}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <MenuRow item={item} />
          {index < items.length - 1 && <View style={styles.separator} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  textColumn: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: colors.highlightBlack,
    marginBottom: 6,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 8,
    lineHeight: 19,
  },
  price: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.primaryGreen,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: colors.highlightGray,
  },
  separator: {
    height: 1,
    backgroundColor: colors.highlightGray,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b6b6b',
    fontSize: 15,
  },
});
