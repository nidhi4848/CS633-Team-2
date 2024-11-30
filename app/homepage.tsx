import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useUser from '../hooks/userHook';

const Homepage: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useUser(); // Use the user data from the hook

  console.log(user);

  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'U';

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
      <View style={styles.container}>
        {/* User Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome back, {userName}</Text>
          <Text style={styles.welcomeText}>What would you like to do today</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Fridge_Pantry')}>
            <Text style={styles.buttonText}>Fridge & Pantry</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Meal_Plans')}>
            <Text style={styles.buttonText}>Meal Plans</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Recipes')}>
            <Text style={styles.buttonText}>Recipes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Exp_Gemini')}>
            <Text style={styles.buttonText}>Experiment with Gemini</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff870a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 30,
    color: '#fff',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff870a',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ff870a',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Homepage;
