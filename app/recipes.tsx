import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { searchAllItems, searchOneItem } from "../api/searchController";
import useUser from '../hooks/userHook';
import {getUserRecipes} from '../api/recipeController';

const Recipes: React.FC = () => {
  const router = useRouter();
  const [recipesData, setRecipesData] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [newRecipeTitle, setNewRecipeTitle] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", measure: "grams", calories: 0, searchResults: [], measurements: [] },
  ]);
  const [instructions, setInstructions] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  

  useEffect(() => {
    fetchUserRecipes();
  }, [user?.token]);

  const fetchUserRecipes = async () => {

    const fetchItems = async () => {
      try {
      
        if (!user.token) {
          Alert.alert('Error', 'No authentication token found');
          return;
        }
  
        setIsLoading(true);
        const recipes = await getUserRecipes(user.token);
        console.log("ingredients: ", recipes.recipes[0].ingredients);
        setRecipesData(recipes.recipes);
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (user?.token) {
      fetchItems();
    }
  };

  const toggleAddModal = () => {
    setAddModalVisible(!isAddModalVisible);
  };

  const toggleViewModal = (recipe = null, index = null) => {
    if (recipe !== null && index !== null) {
      setSelectedRecipe({ recipe, index });
    } else {
      setSelectedRecipe(null);
    }
    setViewModalVisible(!!recipe);
  };

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", quantity: "", measure: "grams", calories: 0, searchResults: [], measurements: [] },
    ]);
  };

  const handleSearchChange = async (index: number, query: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].name = query;
    
    if (query.trim()) {
      try {
        const results = await searchAllItems(query.trim());
        updatedIngredients[index].searchResults = results;
      } catch (error) {
        console.error("Search error:", error);
        updatedIngredients[index].searchResults = [];
      }
    }
    
    setIngredients(updatedIngredients);
  };

  const handleSelectItem = async (index: number, item) => {
    const updatedIngredients = [...ingredients];
    try {
      const details = await searchOneItem(item.name);
      const selectedItem = details[0];

      if (selectedItem && selectedItem.altMeasures) {
        updatedIngredients[index] = {
          ...updatedIngredients[index],
          name: item.name,
          measure: selectedItem.altMeasures[0].measure,
          calories: 0,
          searchResults: [],
          measurements: selectedItem.altMeasures
        };
        
        // Calculate calories for the first measure
        const calories = calculateCaloriesForIngredient(
          selectedItem, 
          1, 
          selectedItem.altMeasures[0].measure
        );
        updatedIngredients[index].calories = calories;

        setIngredients(updatedIngredients);
        calculateTotalCalories(updatedIngredients);
      }
    } catch (error) {
      console.error("Error selecting item:", error);
    }
  };

  const calculateCaloriesForIngredient = (selectedItem, quantity, measure) => {
    const selectedMeasure = selectedItem.altMeasures.find(
      (m) => m.measure === measure
    );
    
    if (selectedMeasure) {
      const servingWeight = selectedMeasure.serving_weight;
      return (selectedItem.calories * (quantity * servingWeight)) / 
             selectedItem.servingWeightGrams;
    }
    return 0;
  };

  const handleQuantityChange = (index: number, quantity: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].quantity = quantity;

    const selectedItem = updatedIngredients[index].name 
      ? searchOneItem(updatedIngredients[index].name).then(details => {
          const item = details[0];
          if (item) {
            const calories = calculateCaloriesForIngredient(
              item, 
              parseFloat(quantity), 
              updatedIngredients[index].measure
            );
            updatedIngredients[index].calories = calories;
            setIngredients(updatedIngredients);
            calculateTotalCalories(updatedIngredients);
          }
        })
      : null;
  };

  const handleMeasureChange = (index: number, measure: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].measure = measure;

    // Recalculate calories for this specific ingredient
    const selectedIngredient = updatedIngredients[index];
    
    if (selectedIngredient.name) {
      searchOneItem(selectedIngredient.name).then(details => {
        const item = details[0];
        if (item) {
          const calories = calculateCaloriesForIngredient(
            item, 
            parseFloat(selectedIngredient.quantity), 
            measure
          );
          selectedIngredient.calories = calories;
          setIngredients(updatedIngredients);
          calculateTotalCalories(updatedIngredients);
        }
      });
    }
  };

  const calculateTotalCalories = (ingredientList) => {
    const total = ingredientList.reduce((sum, ingredient) => 
      sum + (ingredient.calories || 0), 0);
    setTotalCalories(total);
  };

  const handleAddRecipe = () => {
    if (
      newRecipeTitle.trim() &&
      instructions.trim() &&
      ingredients.every((ing) => ing.name && ing.quantity)
    ) {
      const newRecipe = {
        id: (recipesData.length + 1).toString(),
        title: newRecipeTitle.trim(),
        ingredients,
        instructions,
        totalCalories,
      };
      setRecipesData([...recipesData, newRecipe]);
      resetAddRecipeForm();
    } else {
      alert(
        "Please fill all fields and ensure each ingredient has a name and quantity."
      );
    }
  };

  const handleDeleteRecipe = (id) => {
    const updatedRecipes = recipesData.filter((recipe) => recipe.id !== id);
    setRecipesData(updatedRecipes);
    setViewModalVisible(false);
  };

  const resetAddRecipeForm = () => {
    setNewRecipeTitle("");
    setIngredients([
      { name: "", quantity: "", measure: "grams", calories: 0, searchResults: [], measurements: [] },
    ]);
    setInstructions("");
    setAddModalVisible(false);
    setTotalCalories(0);
  };

  const handleNavigation = (tab) => {
    switch (tab) {
      case "Home":
        router.push("/homepage");
        break;
      case "Pantry":
        router.push("/Fridge_Pantry");
        break;
      case "Meals":
        router.push("/meal-plan/calendarpage");
        break;
      case "Recipes":
        router.push("/recipes");
        break;
      case "Profile":
        router.push("/ProfilePage");
        break;
      default:
        break;
    }
  };

  const renderRecipeCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => toggleViewModal(item, index)}
    >
      <Text style={styles.cardText}>{item.recipeName}</Text>
    </TouchableOpacity>
  );

  const renderIngredientSearch = (ingredient, index) => (
    <View key={index} style={styles.ingredientRow}>
      <TextInput
        style={[styles.input, styles.ingredientInput]}
        placeholder="Ingredient Name"
        value={ingredient.name}
        onChangeText={(text) => handleSearchChange(index, text)}
      />
      {/* Search Results Dropdown */}
      {ingredient.searchResults.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={ingredient.searchResults}
            keyExtractor={(item, idx) => `${item.name}-${idx}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  handleSelectItem(index, item);
                }}
              >
                <Text style={styles.dropdownText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      <TextInput
        style={[styles.input, styles.quantityInput]}
        placeholder="Quantity"
        keyboardType="numeric"
        value={ingredient.quantity}
        onChangeText={(text) => handleQuantityChange(index, text)}
      />
      <Dropdown
        style={[styles.dropdown, { zIndex: 10 }]}
        data={
         ingredient.measurements || []
        }
        labelField="measure"
        valueField="measure"
        placeholder="Measure"
        value={ingredient.measure}
        onChange={(item) => handleMeasureChange(index, item.measure)}
      />
      <Text style={styles.caloriesText}>
        {ingredient.calories.toFixed(2)} cal
      </Text>
    </View>
  );

  return (
     // Your state and variables
  console.log("Recipes Data:", 
    
  ), // Log the data here
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Recipes</Text>
        <TouchableOpacity style={styles.addButton} onPress={toggleAddModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>



      {/* Recipes Grid */}
      
      <FlatList
        data={recipesData}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Recipe Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Recipe</Text>
            <TextInput
              style={styles.input}
              placeholder="Recipe Title"
              value={newRecipeTitle}
              onChangeText={setNewRecipeTitle}
            />
            <Text style={styles.sectionSubtitle}>Ingredients</Text>

            {ingredients.map((ingredient, index) => 
              renderIngredientSearch(ingredient, index)
            )}

            <View>
              <Text style={styles.totalCaloriesText}>
                Total Calories: {totalCalories.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addIngredientButton}
              onPress={handleAddIngredient}
            >
              <Text style={styles.addIngredientButtonText}>
                + Add Ingredient
              </Text>
            </TouchableOpacity>
            <Text style={styles.sectionSubtitle}>Instructions</Text>
            <TextInput
              style={[styles.input, styles.instructionsInput]}
              placeholder="Add instructions here..."
              value={instructions}
              onChangeText={setInstructions}
              multiline
            />
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={toggleAddModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddRecipe}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Recipe Modal */}
      <Modal visible={isViewModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedRecipe?.recipeName}</Text>
            <Text style={styles.sectionSubtitle}>Ingredients:</Text>
            {selectedRecipe?.recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>
                {`${ingredient.foodName} - ${ingredient.quantity} - ${ingredient.calories} (${ingredient.calories.toFixed(2)} cal)`}
              </Text>
            ))}
            <Text style={styles.sectionSubtitle}>Instructions:</Text>
            <Text>{selectedRecipe?.recipe.instructions}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteRecipe(selectedRecipe?._id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => toggleViewModal()}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNav
        items={["Home", "Pantry", "Meals", "Recipes", "Profile"]}
        onNavigate={handleNavigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFA500",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  addButton: {
    backgroundColor: "#fff",
    borderRadius: 25,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: { fontSize: 24, color: "#FFA500" },
  listContainer: { paddingHorizontal: 20 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 15 },
  card: {
    marginTop: 10,
    backgroundColor: "#facd9e",
    borderRadius: 10,
    padding: 15,
    width: "45%",
    elevation: 3,
    alignItems: "center",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ingredientInput: { flex: 1, marginRight: 10 },
  quantityInput: { flex: 1, marginRight: 10 },
  measurePicker: { flex: 2 },
  addIngredientButton: { alignItems: "center", marginVertical: 10 },
  addIngredientButtonText: {
    fontSize: 16,
    color: "#FFA500",
    fontWeight: "bold",
  },
  instructionsInput: { height: 80, textAlignVertical: "top" },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: { fontSize: 16, color: "#333" },
  saveButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: { fontSize: 16, color: "#fff" },
  closeButton: { marginTop: 20, alignItems: "center" },
  closeButtonText: { fontSize: 16, color: "#FFA500", fontWeight: "bold" },
  ingredientText: { fontSize: 14, color: "#333", marginBottom: 5 },
  // deleteButton: {
  //   backgroundColor: '#FF4C4C', // Red background color
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 8,
  //   alignItems: 'center',
  // },
  deleteButtonText: {
    color: "#FFA500", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  measureOption: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  selectedMeasure: {
    backgroundColor: "#cce7ff", // Highlight selected measure
    borderColor: "#66a3ff",
  },
  measureText: {
    fontSize: 16,
    color: "#333",
  },

  dropdown: {
    height: 50,
    width: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
  },

  caloriesText: {
    fontSize: 16,
    color: "#333", // Adds spacing between ingredient inputs and calories
    fontWeight: "bold",
  },
});

export default Recipes;
