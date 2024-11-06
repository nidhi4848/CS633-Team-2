import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './(Authentication)/LoginScreen';

export default function Index() {
  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});