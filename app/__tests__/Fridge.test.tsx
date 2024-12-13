import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import Fridge_Pantry from '@/app/Fridge_Pantry'; // Adjust path accordingly
import * as fridgeController from '@/api/fridgeController';
import * as pantryController from '@/api/pantryController';
import * as searchController from '@/api/searchController';
import useUser from '@/hooks/userHook';
import { useRouter } from 'expo-router'; // Correct import

// Mocking API calls and hooks
jest.mock('@/api/fridgeController');
jest.mock('@/api/pantryController');
jest.mock('@/api/searchController');
jest.mock('@/hooks/userHook');

// Mocking useRouter from expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {},
  }),
}));

describe('Fridge_Pantry Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { token: 'test-token' } });
    
    // Mocking API responses for fridge and pantry
    fridgeController.getUserFridge.mockResolvedValue({
      ingredients: [
        { _id: '1', foodName: 'Milk', quantity: '1 liter', calories: 150 },
      ],
    });
    pantryController.getUserPantry.mockResolvedValue({
      ingredients: [
        { _id: '2', foodName: 'Rice', quantity: '1 kg', calories: 1200 },
      ],
    });

    // Mocking search API responses
    searchController.searchAllItems.mockResolvedValue([
      { name: 'Apple' },
      { name: 'Banana' },
    ]);
    searchController.searchOneItem.mockResolvedValue([
      {
        foodName: 'Apple',
        brandName: 'Fresh',
        calories: 52,
        servingWeightGrams: 100,
        altMeasures: [
          { measure: '1 medium', serving_weight: 182 },
          { measure: '1 large', serving_weight: 220 },
        ],
      },
    ]);

    // Mocking delete function
    fridgeController.deleteFromFridge.mockResolvedValue({});
  });

  it('renders the fridge and pantry items', async () => {
    render(<Fridge_Pantry />);
    await waitFor(() => {
      expect(screen.getByTestId('fridge-item')).toBeTruthy();  // Ensure fridge items are rendered
      expect(screen.getByTestId('pantry-item')).toBeTruthy();  // Ensure pantry items are rendered
    });
  });

  it('searches for items and displays search results', async () => {
    render(<Fridge_Pantry />);

    fireEvent.changeText(screen.getByPlaceholderText('Search for an ingredient'), 'Apple');
    await waitFor(() => {
      expect(searchController.searchAllItems).toHaveBeenCalledWith('Apple');
    });

    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Banana')).toBeTruthy();
  });

  it('opens the modal when an item is selected', async () => {
    render(<Fridge_Pantry />);
  
    // Trigger the search input
    fireEvent.changeText(screen.getByTestId('searchInput'), 'Apple');
    await waitFor(() => {
      expect(searchController.searchAllItems).toHaveBeenCalledWith('Apple');
    });
  
    // Get all elements that match the testID for "Apple"
    const appleResults = screen.getAllByTestId('searchItem-Apple');  // Get all "Apple" search items
    fireEvent.press(appleResults[0]);  // Click on the first "Apple" result (or specify which one to select)
  
    // Wait for the modal to appear
    await waitFor(() => {
      const modal = screen.getByTestId('itemModal');
      expect(modal).toBeTruthy();
    });
  });
  
  it('deletes an item from the fridge', async () => {
    render(<Fridge_Pantry />);
    
    await waitFor(() => {
      expect(screen.getByTestId('fridge-item')).toBeTruthy();
    });
  
    fireEvent.press(screen.getByTestId('deleteFridgeItem-Milk'));  // Trigger delete
    await waitFor(() => {
      expect(fridgeController.deleteFromFridge).toHaveBeenCalledWith('1', 'test-token'); // Check if delete function is called
    });
  });  
  
  it('navigates to different tabs', () => {
    render(<Fridge_Pantry />);

    fireEvent.press(screen.getByText('Home')); // Press 'Home' to navigate
    expect(screen.getByText('Home')).toBeTruthy();
  });
});
