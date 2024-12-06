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
import { checkIfDayAvailable, addMealToDay } from "../../api/dayController"; // Assuming this is your meal data API
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

  useEffect(() => {
    const fetchDayData = async () => {
      try {
        if (!user?.token || !date) return; // Ensure token and date are available
        setLoading(true);
        const data = await checkIfDayAvailable(date, user.token);
        console.log(data);
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
  };;

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
        ingredients: [],
      };
      const response = await addMealToDay(date, mealType, meal, user.token);

      console.log(response);

      // Update the dayData after the meal is added
      setDayData(response.day);
      setShowModal(false); // Close the modal after adding
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to add meal to the day.");
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
        <Text style={styles.mealContent}>
          {dayData[meal.toLowerCase()].map(
            (item: any, index: number, array: any[]) => (
              <Text key={index}>
                {item.recipeName || "No items added"}
                {index < array.length - 1 && ", "}
              </Text>
            )
          )}
        </Text>
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planner</Text>
      <Text style={styles.subtitle}>Date: {date}</Text>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mealContent: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  resultItem: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  selectedItemContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  selectedItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedItemText: {
    fontSize: 16,
    marginTop: 10,
  },
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
  },
});

export default MealPlanPage;
