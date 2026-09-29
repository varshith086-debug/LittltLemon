import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MenuBreakdown from '../components/MenuBreakdown';
import MenuList from '../components/MenuList';
import { CATEGORIES, MENU_ITEMS } from '../data/menu';
import { STORAGE_KEYS, getValue } from '../utils/storage';
import colors from '../utils/theme';

export default function Home({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [activeCategories, setActiveCategories] = useState([]);
  const [avatarUri, setAvatarUri] = useState(null);

  // Re-read the avatar every time Home regains focus, so a photo
  // added on the Profile screen shows up in the header right away.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        const uri = await getValue(STORAGE_KEYS.AVATAR_URI);
        if (isActive) setAvatarUri(uri || null);
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const toggleCategory = (category) => {
    setActiveCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(item.category);
      const matchesSearch =
        query.length === 0 || item.name.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchText, activeCategories]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        avatarUri={avatarUri}
        onAvatarPress={() => navigation.navigate('Profile')}
      />

      <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
        <Hero searchText={searchText} onSearchChange={setSearchText} />

        <MenuBreakdown
          categories={CATEGORIES}
          activeCategories={activeCategories}
          onToggleCategory={toggleCategory}
        />

        <View style={styles.divider} />

        <MenuList items={filteredItems} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  body: {
    flex: 1,
    backgroundColor: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.highlightGray,
    marginHorizontal: 16,
  },
});
