import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';

export default function Index() {
  return (
    <View style={styles.container}>
      <LoginScreen />
      <Link href="/RegistrationScreen" style={styles.link}>
        Don’t have an account? Register
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
    marginTop: 20,
  },
});
