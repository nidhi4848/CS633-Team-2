import React from 'react';
import { Slot, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    // Add any custom fonts here if needed
    // 'CustomFont-Regular': require('../assets/fonts/CustomFont-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff870a" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RegistrationScreen"
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});