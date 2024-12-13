import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Recipes from "@/app/recipes"; // Adjust the path to your component
import * as recipeController from "@/api/recipeController";
import useUser from "@/hooks/userHook";

jest.mock("@/api/recipeController");
jest.mock("@/hooks/userHook");
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

beforeEach(() => {
  jest.clearAllMocks();
  useUser.mockReturnValue({ user: { token: "mock-token" } });
  global.alert = jest.fn();  // Mock the global alert function
});

describe("Recipes Component", () => {
  it("renders the Recipes component correctly", () => {
    const { getByTestId } = render(<Recipes />);
    expect(getByTestId("recipes-header")).toBeTruthy();
  });  

  it("fetches and displays user recipes", async () => {
    recipeController.getUserRecipes.mockResolvedValue({
      recipes: [
        { _id: "1", recipeName: "Recipe 1", ingredients: [], calories: 200 },
        { _id: "2", recipeName: "Recipe 2", ingredients: [], calories: 300 },
      ],
    });

    const { findByText } = render(<Recipes />);
    expect(await findByText("Recipe 1")).toBeTruthy();
    expect(await findByText("Recipe 2")).toBeTruthy();
  });

  it("opens the Add Recipe modal", () => {
    const { getByText, getByPlaceholderText } = render(<Recipes />);
    fireEvent.press(getByText("+"));

    expect(getByPlaceholderText("Recipe Title")).toBeTruthy();
    expect(getByText("Add New Recipe")).toBeTruthy();
  });

  it("adds a new ingredient to the list", async () => {
    const { getByText, getAllByPlaceholderText } = render(<Recipes />);
  
    // Wait for the "+ Add Ingredient" button to appear
    await waitFor(() => getByText("+ Add Ingredient"));
    
    // Interact with the "+ Add Ingredient" button
    fireEvent.press(getByText("+ Add Ingredient"));
    
    // Check that an ingredient input field was added
    const ingredientInputs = getAllByPlaceholderText("Ingredient Name");
    expect(ingredientInputs.length).toBe(2);  // Initial + 1 added
  });
  
   

  it("adds a new recipe successfully", async () => {
    recipeController.addRecipe.mockResolvedValue({
      recipe: { _id: "3", recipeName: "New Recipe", ingredients: [], calories: 400 },
    });
  
    const { getByText, getByPlaceholderText, findByText } = render(<Recipes />);
    
    // Open the modal
    fireEvent.press(getByText("+"));
    
    // Ensure modal is open and input fields are available
    await waitFor(() => {
      expect(getByPlaceholderText("Recipe Title")).toBeTruthy();
      expect(getByPlaceholderText("Add instructions here...")).toBeTruthy();
    });
  
    // Enter text into inputs
    fireEvent.changeText(getByPlaceholderText("Recipe Title"), "New Recipe");
    fireEvent.changeText(getByPlaceholderText("Add instructions here..."), "Some instructions");
  
    // Trigger save action
    fireEvent.press(getByText("Save"));
  
    // Wait for the mock function to be called with the correct arguments
    await waitFor(() => {
      expect(recipeController.addRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          recipeName: "New Recipe",
          instructions: "Some instructions",
        }),
        "mock-token"
      );
    });
  });
  
  it("deletes a recipe", async () => {
    const mockRecipes = [
      { _id: "1", recipeName: "Recipe 1", ingredients: [], calories: 200 },
    ];
    recipeController.getUserRecipes.mockResolvedValue({ recipes: mockRecipes });
    recipeController.deleteRecipe.mockResolvedValue();

    const { getByText, queryByText } = render(<Recipes />);
    fireEvent.press(await waitFor(() => getByText("Recipe 1")));
    fireEvent.press(getByText("Delete"));

    await waitFor(() => {
      expect(recipeController.deleteRecipe).toHaveBeenCalledWith("1", "mock-token");
      expect(queryByText("Recipe 1")).toBeNull();
    });
  });
});
