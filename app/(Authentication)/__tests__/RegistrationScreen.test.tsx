import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegistrationScreen from '../RegistrationScreen';
import { registerUser } from '@/api/usersController';

jest.mock('@/api/usersController', () => ({
  registerUser: jest.fn(),
}));

describe('RegistrationScreen', () => {
  it('should display validation errors when fields are empty', async () => {
    const { getByTestId, getByText } = render(<RegistrationScreen />);

    fireEvent.press(getByTestId('registerButton'));

    await waitFor(() => {
      expect(getByText('First name is required')).toBeTruthy();
      expect(getByText('Last name is required')).toBeTruthy();
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
      expect(getByText('Please confirm your password')).toBeTruthy();
    });
  });

  it('should call registerUser API on valid input', async () => {
    const { getByPlaceholderText, getByTestId } = render(<RegistrationScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter your first name'), 'Nidhi');
    fireEvent.changeText(getByPlaceholderText('Enter your last name'), 'Desai');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'nprj04@gmail.com');
    fireEvent.changeText(getByPlaceholderText('Create password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm password'), 'password123');

    fireEvent.press(getByTestId('registerButton'));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith(
        'nprj04@gmail.com',
        'password123',
        'Nidhi',
        'Desai'
      );
    });
  });
});
