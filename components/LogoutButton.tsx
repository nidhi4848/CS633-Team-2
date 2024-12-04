import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useUser from '../hooks/userHook'; // Assuming the hook has a clearUser function
import { router } from 'expo-router';

const LogoutButton: React.FC = () => {
  const { clearUser } = useUser(); // Hook to clear user data

  const handleLogout = () => {
    clearUser(); // Clear user data from storage/context
    router.push('/LoginScreen'); // Navigate to login screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure it stays above other elements
  },
  logoutButton: {
    backgroundColor: '#ff870a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  
});

export default LogoutButton;
