import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Karla_400Regular, Karla_700Bold } from '@expo-google-fonts/karla';
import { MarkaziText_400Regular, MarkaziText_500Medium } from '@expo-google-fonts/markazi-text';

import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Profile from './screens/Profile';
import colors from './utils/theme';
import { isOnboardingCompleted } from './utils/storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Onboarding');

  // Little Lemon's brand style guide specifies Markazi Text for large
  // display headings and Karla for everything else. Loaded once at
  // the root so every screen can reference them via utils/theme.
  const [fontsLoaded] = useFonts({
    Karla_400Regular,
    Karla_700Bold,
    MarkaziText_400Regular,
    MarkaziText_500Medium,
  });

  // On launch, check whether onboarding was already completed in a
  // previous session so a returning user lands on Home, not the
  // onboarding form again.
  useEffect(() => {
    (async () => {
      const completed = await isOnboardingCompleted();
      setInitialRoute(completed ? 'Home' : 'Onboarding');
      setCheckingOnboarding(false);
    })();
  }, []);

  if (checkingOnboarding || !fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primaryGreen} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              title: 'Profile',
              headerStyle: { backgroundColor: colors.white },
              headerTintColor: colors.primaryGreen,
              headerTitleStyle: { fontWeight: '700' },
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
