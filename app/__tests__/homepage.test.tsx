import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Homepage from '@/app/homepage';
import { useRouter } from 'expo-router';
import useUser from '@/hooks/userHook';
import LogoutButton from '@/components/LogoutButton';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/userHook', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/components/LogoutButton', () => jest.fn());

describe('Homepage', () => {
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    mockRouterPush = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    (useUser as jest.Mock).mockReturnValue({
      user: { firstName: 'Nidhi', lastName: 'Desai' },
    });

    (LogoutButton as jest.Mock).mockImplementation(({ testID }) => (
      <button
        testID={testID}
        onClick={() => mockRouterPush('/LoginScreen')} // Simulate navigation on logout
      >
        Logout
      </button>
    ));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to MealPlan Calendar Page', () => {
    const { getByTestId } = render(<Homepage />);

    const mealPlanButton = getByTestId('meal-plans-button');
    fireEvent.press(mealPlanButton);

    expect(mockRouterPush).toHaveBeenCalledWith('/meal-plan/calendarpage');
  });

  it('should navigate to Recipes Page', () => {
    const { getByTestId } = render(<Homepage />);

    const recipesButton = getByTestId('recipes-button');
    fireEvent.press(recipesButton);

    expect(mockRouterPush).toHaveBeenCalledWith('/recipes');
  });

  it('should navigate to Fridge & Pantry Page', () => {
    const { getByTestId } = render(<Homepage />);

    const fridgePantryButton = getByTestId('fridge-pantry-button');
    fireEvent.press(fridgePantryButton);

    expect(mockRouterPush).toHaveBeenCalledWith('/Fridge_Pantry');
  });
});
