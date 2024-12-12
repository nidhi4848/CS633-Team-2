import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../LoginScreen';
import { loginUser } from '@/api/usersController';

jest.mock('@/api/usersController', () => ({
  loginUser: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('LoginScreen', () => {
  const renderWithNavigation = (ui: React.ReactElement) => (
    render(
      <NavigationContainer>
        {ui}
      </NavigationContainer>
    )
  );

  it('should display validation errors when fields are empty', async () => {
    const { getByText } = renderWithNavigation(<LoginScreen />);

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('should call loginUser API on valid input', async () => {
    (loginUser as jest.Mock).mockResolvedValue({ firstName: 'John', lastName: 'Doe' });

    const { getByText, getByPlaceholderText } = renderWithNavigation(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'nprj04@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('nprj04@gmail.com', 'password123');
    });
  });
});
