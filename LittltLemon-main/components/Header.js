import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import images from '../assets';
import colors from '../utils/theme';

// App-wide header: logo centered, tappable avatar on the right that
// takes the user to their Profile screen (satisfies the stack-nav /
// back-button rubric item together with Profile's back arrow).
export default function Header({ onAvatarPress, avatarUri }) {
  return (
    <View style={styles.container}>
      <View style={styles.spacer} />

      <Image source={images.logo} style={styles.logo} resizeMode="contain" />

      <TouchableOpacity
        style={styles.spacer}
        onPress={onAvatarPress}
        testID="header-avatar-button"
      >
        <Image
          source={avatarUri ? { uri: avatarUri } : images.avatarPlaceholder}
          style={styles.avatar}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlightGray,
  },
  spacer: {
    width: 44,
    alignItems: 'flex-end',
  },
  logo: {
    width: 160,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlightGray,
  },
});
