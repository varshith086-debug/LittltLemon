import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../assets';
import colors, { fonts } from '../utils/theme';
import { STORAGE_KEYS, saveMultiple } from '../utils/storage';

// Very small, dependency-free validators — good enough to gate the
// Next button without pulling in a whole form library.
const isNonEmpty = (value) => value.trim().length > 0;
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function Onboarding({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const firstNameValid = isNonEmpty(firstName);
  const emailValid = isValidEmail(email);
  const canContinue = firstNameValid && emailValid;

  const handleNext = async () => {
    if (!canContinue) return;

    await saveMultiple({
      [STORAGE_KEYS.FIRST_NAME]: firstName.trim(),
      [STORAGE_KEYS.EMAIL]: email.trim(),
      [STORAGE_KEYS.ONBOARDED]: 'true',
      // Sensible defaults so the Profile screen has something to show
      // for notification preferences right away.
      [STORAGE_KEYS.NOTIF_ORDER_STATUSES]: 'true',
      [STORAGE_KEYS.NOTIF_PASSWORD_CHANGES]: 'true',
      [STORAGE_KEYS.NOTIF_OFFERS]: 'false',
      [STORAGE_KEYS.NOTIF_NEWSLETTER]: 'false',
    });

    // Reset the stack so the user can't "go back" into onboarding.
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Let's get to know you</Text>
          <Text style={styles.subtitle}>
            Tell us a little about yourself so we can personalize your Little
            Lemon experience.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              placeholderTextColor="#9a9a9a"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              returnKeyType="next"
              testID="onboarding-first-name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9a9a9a"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
              testID="onboarding-email"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, !canContinue && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!canContinue}
            testID="onboarding-next-button"
          >
            <Text
              style={[
                styles.nextButtonText,
                !canContinue && styles.nextButtonTextDisabled,
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlightGray,
  },
  logo: {
    width: 180,
    height: 50,
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.primaryGreen,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.highlightBlack,
    marginBottom: 32,
    lineHeight: 21,
  },
  form: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.highlightBlack,
    marginTop: 18,
    marginBottom: 6,
  },
  input: {
    fontFamily: fonts.body,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.highlightBlack,
    backgroundColor: colors.white,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.highlightGray,
  },
  nextButton: {
    backgroundColor: colors.primaryYellow,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.highlightGray,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryGreen,
  },
  nextButtonTextDisabled: {
    color: '#a9a9a9',
  },
});
