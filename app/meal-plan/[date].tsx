import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { searchAllItems, searchOneItem } from "../../api/searchController"; // Import your search functions
import { checkIfDayAvailable, addMealToDay, deleteMealFromDay } from "../../api/dayController"; // Assuming this is your meal data API
import useUser from "../../hooks/userHook";

const MealPlanPage = () => {
  const { user } = useUser();
  const { date } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [dayData, setDayData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mealType, setMealType] = useState<string>(""); // Track meal type
  const [showModal, setShowModal] = useState(false); // Track modal visibility

  // Separate query state for each meal
  const [queryBreakfast, setQueryBreakfast] = useState<string>("");
  const [queryLunch, setQueryLunch] = useState<string>("");
  const [queryDinner, setQueryDinner] = useState<string>("");

  // Calculate total calories from meals
  const calculateTotalCalories = () => {
    let totalCalories = 0;
    if (dayData) {
      ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
        const mealData = dayData[mealType];
        if (mealData) {
          mealData.forEach((meal: any) => {
            totalCalories += parseFloat(meal.calories) || 0; // Add calories for each meal, ensuring a default value of 0 if calories are missing
          });
        }
      });
    }
    return totalCalories.toFixed(2); // Return total calories as a string with 2 decimal places
  };

  useEffect(() => {
    const fetchDayData = async () => {
      try {
        if (!user?.token || !date) return; // Ensure token and date are available
        setLoading(true);
        const data = await checkIfDayAvailable(date, user.token);
        setDayData(data.day);
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to fetch meal data.");
      } finally {
        setLoading(false);
      }
    };

    // Trigger fetch when the user token or date changes
    if (user?.token) {
      fetchDayData();
    }
  }, [user?.token, date]); // Trigger re-fetch if either user.token or date changes

  const handleSearch = async (query: string, mealType: string) => {
    if (!query.trim()) {
      Alert.alert("Error", "Please enter a recipe or product name");
      return;
    }
  
    setSearchLoading(true);
    setMealType(mealType);
  
    try {
      const results = await searchAllItems(query); // Use searchAllItems function
      setSearchResults(results);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch search results.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectItem = async (item: any) => {
    try {
      const result = await searchOneItem(item.name);
      setSelectedItem(result[0]); // Assume the result is an array, select the first item
      setSearchResults([]); // Clear search results
      setShowModal(true); // Show the modal after selecting an item
    } catch (error) {
      Alert.alert("Error", "Failed to fetch item details.");
    }
  };

  const handleAddMeal = async (mealType: string) => {
    if (!selectedItem) return;
    try {
      // Add the selected item to the day
      const meal = {
        recipeName: selectedItem.foodName,
        calories: selectedItem.calories,
        ingredients: [],
      };
      const response = await addMealToDay(date, mealType, meal, user.token);
      setDayData(response.day);
      setShowModal(false); // Close the modal after adding
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to add meal to the day.");
    }
  };

  const handleDeleteMeal = async (mealType: string, mealName: string) => {
    try {
      // Delete the meal from the day
      const response = await deleteMealFromDay(date, mealType, mealName, user.token);
      setDayData(response.day); // Update dayData after deletion
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete meal.");
    }
  };

  const renderMealSection = (
    meal: string,
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    mealType: string
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{meal}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter recipe or product name"
        value={query}
        onChangeText={setQuery}
      />
      <Button
        title="Search Recipe / Product"
        onPress={() => handleSearch(query, mealType)} // Pass the meal-specific query to handleSearch
      />
      {searchLoading ? (
        <ActivityIndicator size="small" color="#ff6600" />
      ) : (
        <>
          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectItem(item)}>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}
      {dayData && dayData[meal.toLowerCase()] ? (
        <FlatList
          data={dayData[meal.toLowerCase()]}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }) => (
            <View style={styles.mealItem}>
              <Text style={styles.mealContent}>{item.recipeName} - {item.calories}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteMeal(meal.toLowerCase(), item._id)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.mealContent}>No items added</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#ff6600" />
      </View>
    );
  }

  const totalCalories = calculateTotalCalories();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planner</Text>
      <Text style={styles.subtitle}>Date: {date}</Text>
      <Text style={styles.totalCalories}>Total Calories: {totalCalories}</Text>
      {renderMealSection(
        "Breakfast",
        queryBreakfast,
        setQueryBreakfast,
        "breakfast"
      )}
      {renderMealSection("Lunch", queryLunch, setQueryLunch, "lunch")}
      {renderMealSection("Dinner", queryDinner, setQueryDinner, "dinner")}

      {/* Modal for selected item */}
      {selectedItem && (
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)} // Close the modal when back button is pressed
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.selectedItemTitle}>Selected Item:</Text>
              <Text style={styles.selectedItemText}>
                Food Name: {selectedItem.foodName}
              </Text>
              <Text style={styles.selectedItemText}>
                Calories: {selectedItem.calories}
              </Text>
              <Button
                title="Add"
                onPress={() => handleAddMeal(mealType)} // Example: Pass the meal type to the function
              />
              <Button
                title="Close"
                onPress={() => setShowModal(false)} // Close modal on button press
                color="red" // Make the close button red
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6600",
  },
  subtitle: {
    fontSize: 18,
    color: "#ff6600",
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  mealItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  mealContent: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ff6600",
    padding: 5,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  resultText: {
    fontSize: 16,
  },
  totalCalories: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  selectedItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedItemText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default MealPlanPage;
