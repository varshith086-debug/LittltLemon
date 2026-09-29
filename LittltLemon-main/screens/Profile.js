import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import images from '../assets';
import colors from '../utils/theme';
import Checkbox from '../components/Checkbox';
import { STORAGE_KEYS, getProfile, saveMultiple, clearAllData } from '../utils/storage';

const emptyProfile = {
  [STORAGE_KEYS.FIRST_NAME]: '',
  [STORAGE_KEYS.LAST_NAME]: '',
  [STORAGE_KEYS.EMAIL]: '',
  [STORAGE_KEYS.PHONE]: '',
  [STORAGE_KEYS.AVATAR_URI]: '',
  [STORAGE_KEYS.NOTIF_ORDER_STATUSES]: 'false',
  [STORAGE_KEYS.NOTIF_PASSWORD_CHANGES]: 'false',
  [STORAGE_KEYS.NOTIF_OFFERS]: 'false',
  [STORAGE_KEYS.NOTIF_NEWSLETTER]: 'false',
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function Profile({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);

  // Load whatever onboarding (or a previous visit to this screen)
  // wrote to storage. Runs every time the screen gains focus, so
  // "restarting" the app (re-mounting the navigator) or simply
  // returning to this tab always reflects the latest saved data.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        setLoading(true);
        const profile = await getProfile();
        const merged = { ...emptyProfile, ...profile };
        if (isActive) {
          setSaved(merged);
          setDraft(merged);
          setLoading(false);
        }
      })();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const updateField = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));
  const toggleField = (key, value) => updateField(key, value ? 'true' : 'false');

  const hasChanges = JSON.stringify(saved) !== JSON.stringify(draft);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Little Lemon needs access to your photos to set a profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      updateField(STORAGE_KEYS.AVATAR_URI, result.assets[0].uri);
    }
  };

  const removeImage = () => updateField(STORAGE_KEYS.AVATAR_URI, '');

  const handleSave = async () => {
    if (draft[STORAGE_KEYS.FIRST_NAME].trim().length === 0) {
      Alert.alert('First name required', 'Please enter a first name.');
      return;
    }
    if (!isValidEmail(draft[STORAGE_KEYS.EMAIL])) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    await saveMultiple(draft);
    setSaved(draft);
    Alert.alert('Saved', 'Your changes have been saved.');
  };

  const handleDiscard = () => setDraft(saved);

  const handleLogout = () => {
    Alert.alert('Log out', 'This will clear all your saved data. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await clearAllData();
          navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primaryGreen} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Personal information</Text>

        <View style={styles.avatarRow}>
          <Image
            source={
              draft[STORAGE_KEYS.AVATAR_URI]
                ? { uri: draft[STORAGE_KEYS.AVATAR_URI] }
                : images.avatarPlaceholder
            }
            style={styles.avatar}
            testID="profile-avatar-image"
          />
          <View style={styles.avatarButtons}>
            <TouchableOpacity
              style={styles.primarySmallButton}
              onPress={pickImage}
              testID="profile-change-photo-button"
            >
              <Text style={styles.primarySmallButtonText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondarySmallButton}
              onPress={removeImage}
              testID="profile-remove-photo-button"
            >
              <Text style={styles.secondarySmallButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Field
          label="First Name"
          value={draft[STORAGE_KEYS.FIRST_NAME]}
          onChangeText={(v) => updateField(STORAGE_KEYS.FIRST_NAME, v)}
          testID="profile-first-name"
        />
        <Field
          label="Last Name"
          value={draft[STORAGE_KEYS.LAST_NAME]}
          onChangeText={(v) => updateField(STORAGE_KEYS.LAST_NAME, v)}
          testID="profile-last-name"
        />
        <Field
          label="Email"
          value={draft[STORAGE_KEYS.EMAIL]}
          onChangeText={(v) => updateField(STORAGE_KEYS.EMAIL, v)}
          keyboardType="email-address"
          autoCapitalize="none"
          testID="profile-email"
        />
        <Field
          label="Phone Number"
          value={draft[STORAGE_KEYS.PHONE]}
          onChangeText={(v) => updateField(STORAGE_KEYS.PHONE, v)}
          keyboardType="phone-pad"
          placeholder="(000) 000-0000"
          testID="profile-phone"
        />

        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>
          Email notifications
        </Text>

        <Checkbox
          label="Order statuses"
          value={draft[STORAGE_KEYS.NOTIF_ORDER_STATUSES] === 'true'}
          onToggle={(v) => toggleField(STORAGE_KEYS.NOTIF_ORDER_STATUSES, v)}
          testID="profile-notif-order-statuses"
        />
        <Checkbox
          label="Password changes"
          value={draft[STORAGE_KEYS.NOTIF_PASSWORD_CHANGES] === 'true'}
          onToggle={(v) => toggleField(STORAGE_KEYS.NOTIF_PASSWORD_CHANGES, v)}
          testID="profile-notif-password-changes"
        />
        <Checkbox
          label="Special offers"
          value={draft[STORAGE_KEYS.NOTIF_OFFERS] === 'true'}
          onToggle={(v) => toggleField(STORAGE_KEYS.NOTIF_OFFERS, v)}
          testID="profile-notif-offers"
        />
        <Checkbox
          label="Newsletter"
          value={draft[STORAGE_KEYS.NOTIF_NEWSLETTER] === 'true'}
          onToggle={(v) => toggleField(STORAGE_KEYS.NOTIF_NEWSLETTER, v)}
          testID="profile-notif-newsletter"
        />

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          testID="profile-logout-button"
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>

        <View style={styles.saveRow}>
          <TouchableOpacity
            style={[styles.discardButton, !hasChanges && styles.buttonDisabled]}
            onPress={handleDiscard}
            disabled={!hasChanges}
            testID="profile-discard-button"
          >
            <Text style={styles.discardButtonText}>Discard changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, !hasChanges && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={!hasChanges}
            testID="profile-save-button"
          >
            <Text style={styles.saveButtonText}>Save changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, testID, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#9a9a9a"
        testID={testID}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlightGray,
    marginRight: 20,
  },
  avatarButtons: {
    flexDirection: 'row',
  },
  primarySmallButton: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    marginRight: 10,
  },
  primarySmallButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  secondarySmallButton: {
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  secondarySmallButtonText: {
    color: colors.primaryGreen,
    fontWeight: '600',
    fontSize: 13,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.highlightBlack,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.highlightBlack,
  },
  logoutButton: {
    backgroundColor: colors.primaryYellow,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 28,
  },
  logoutButtonText: {
    fontWeight: '700',
    color: colors.highlightBlack,
    fontSize: 15,
  },
  saveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  discardButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  discardButtonText: {
    color: colors.primaryGreen,
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primaryGreen,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
