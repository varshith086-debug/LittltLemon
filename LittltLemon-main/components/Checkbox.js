import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../utils/theme';

// A tiny checkbox row used for the notification preferences on the
// Profile screen — avoids pulling in a whole form/checkbox library
// for four toggles.
export default function Checkbox({ label, value, onToggle, testID }) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onToggle(!value)}
      activeOpacity={0.7}
      testID={testID}
    >
      <View style={[styles.box, value && styles.boxChecked]}>
        {value && <Ionicons name="checkmark" size={14} color={colors.white} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primaryGreen,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.primaryGreen,
  },
  label: {
    fontSize: 14,
    color: colors.highlightBlack,
  },
});
