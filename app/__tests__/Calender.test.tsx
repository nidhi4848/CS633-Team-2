import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router'; 
import CalendarPage from '@/app/meal-plan/calendarpage'; // Adjust the import as per your file structure
import { Calendar } from 'react-native-calendars';

// Mocking the useRouter hook
jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({
      push: jest.fn(),
    })),
  }));  
jest.mock('react-native-calendars', () => {
    return {
      Calendar: () => <div>Mocked Calendar</div>,
    };
  });  
describe('CalendarPage', () => {
  let routerPushMock;

  beforeEach(() => {
    routerPushMock = jest.fn();
    useRouter.mockReturnValue({
      push: routerPushMock,
    });
  });

  it('renders the calendar page correctly', () => {
    render(<CalendarPage />);
  
    // Check if other UI elements are rendered after rendering the page
    expect(screen.getByText('Planner')).toBeTruthy();
    expect(screen.getByTestId('calendar')).toBeTruthy();  // Assuming the testID is correct
  });
  
  it('handles date selection and redirects to the correct page', async () => {
    render(<CalendarPage />);

    const dayToSelect = '2024-12-15';  // Example date for selection
    fireEvent.press(screen.getByText(dayToSelect));  // Simulate clicking a day

    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith(`/meal-plan/${dayToSelect}`); // Check if navigation happened with the correct date
    });
  });

  it('handles bottom navigation and redirects correctly', async () => {
    render(<CalendarPage />);

    // Test Home button
    fireEvent.press(screen.getByText('Home'));  // Assuming each BottomNav item has text
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith('/homepage'); // Check if navigation happens correctly
    });

    // Test Pantry button
    fireEvent.press(screen.getByText('Pantry'));
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith('/Fridge_Pantry');
    });

    // Test Meals button
    fireEvent.press(screen.getByText('Meals'));
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith('/meal-plan/calendarpage');
    });

    // Test Recipes button
    fireEvent.press(screen.getByText('Recipes'));
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith('/recipes');
    });

    // Test Profile button
    fireEvent.press(screen.getByText('Profile'));
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith('/ProfilePage');
    });
  });
});
