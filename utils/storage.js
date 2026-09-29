import AsyncStorage from '@react-native-async-storage/async-storage';

// A single, well-known set of keys so the rest of the app never
// hardcodes storage strings.
export const STORAGE_KEYS = {
  FIRST_NAME: 'll_firstName',
  LAST_NAME: 'll_lastName',
  EMAIL: 'll_email',
  PHONE: 'll_phone',
  AVATAR_URI: 'll_avatarUri',
  ONBOARDED: 'll_isOnboardingCompleted',
  NOTIF_ORDER_STATUSES: 'll_notif_orderStatuses',
  NOTIF_PASSWORD_CHANGES: 'll_notif_passwordChanges',
  NOTIF_OFFERS: 'll_notif_offers',
  NOTIF_NEWSLETTER: 'll_notif_newsletter',
};

// Fields that make up a user's profile. Centralised so onboarding and
// the profile screen agree on exactly what "the user's data" means.
export const PROFILE_FIELDS = [
  STORAGE_KEYS.FIRST_NAME,
  STORAGE_KEYS.LAST_NAME,
  STORAGE_KEYS.EMAIL,
  STORAGE_KEYS.PHONE,
  STORAGE_KEYS.AVATAR_URI,
  STORAGE_KEYS.NOTIF_ORDER_STATUSES,
  STORAGE_KEYS.NOTIF_PASSWORD_CHANGES,
  STORAGE_KEYS.NOTIF_OFFERS,
  STORAGE_KEYS.NOTIF_NEWSLETTER,
];

export async function saveValue(key, value) {
  try {
    await AsyncStorage.setItem(key, String(value));
  } catch (e) {
    console.warn(`Failed to save ${key}`, e);
  }
}

export async function getValue(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (e) {
    console.warn(`Failed to read ${key}`, e);
    return null;
  }
}

export async function saveMultiple(pairs) {
  try {
    // pairs: { key: value, ... } -> AsyncStorage wants [[k, v], ...]
    const entries = Object.entries(pairs).map(([k, v]) => [k, String(v ?? '')]);
    await AsyncStorage.multiSet(entries);
  } catch (e) {
    console.warn('Failed to save multiple values', e);
  }
}

export async function getProfile() {
  try {
    const entries = await AsyncStorage.multiGet(PROFILE_FIELDS);
    const profile = {};
    entries.forEach(([key, value]) => {
      profile[key] = value ?? '';
    });
    return profile;
  } catch (e) {
    console.warn('Failed to read profile', e);
    return {};
  }
}

export async function isOnboardingCompleted() {
  const value = await getValue(STORAGE_KEYS.ONBOARDED);
  return value === 'true';
}

// Clears everything the app ever wrote — used by Log out so the
// Profile screen genuinely has nothing left to show.
export async function clearAllData() {
  try {
    await AsyncStorage.multiRemove([...PROFILE_FIELDS, STORAGE_KEYS.ONBOARDED]);
  } catch (e) {
    console.warn('Failed to clear data', e);
  }
}
