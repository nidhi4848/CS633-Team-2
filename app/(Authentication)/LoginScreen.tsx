import React, { useState } from 'react';
import { loginUser } from '../../api/usersController';
import useUser from '../../hooks/userHook'; // Update the path as necessary
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigation = useNavigation();
  const { saveUser } = useUser();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
        const userData = await loginUser(email, password); // Assuming this returns the user object
        if (userData) {
            saveUser(userData); // Save the user to AsyncStorage and context
            Alert.alert('Success', 'Login successful!');
            navigation.navigate('homepage'); // Navigate to homepage
        } else {
            Alert.alert('Error', 'Invalid credentials.');
        }
    } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
        setIsLoading(false);
    }
};


  const handleRegister = () => {
    //navigate to Registration Screen
    navigation.navigate('(Authentication)/RegistrationScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors(prev => ({ ...prev, email: '' }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors(prev => ({ ...prev, password: '' }));
              }}
              secureTextEntry
              placeholderTextColor="#666"
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.registerTextBold}>Register</Text>
            </Text>
          </TouchableOpacity>

          {/* Development Skip Login Button */}
          <Button
            title="Skip Login (Dev)"
            onPress={() => navigation.navigate('homepage')}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
    marginBottom: 8,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: '#ff870a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerTextBold: {
    color: '#ff870a',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
