import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, FlatList, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { searchAllItems, searchOneItem } from '../api/searchController';
import { getUserFridge, addItemToFridge, deleteFromFridge } from '../api/fridgeController'; // Import fridge API functions
import { getUserPantry, addItemToPantry, deleteFromPantry } from '../api/pantryController'; // Import pantry API functions
import useUser from '../hooks/userHook';

const Fridge_Pantry: React.FC = () => {
  const { user } = useUser();
  const [fridgeItems, setFridgeItems] = useState([]);
  const [pantryItems, setPantryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedMeasure, setSelectedMeasure] = useState(null);
  const [calories, setCalories] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [targetLocation, setTargetLocation] = useState('fridge'); // 'fridge' or 'pantry'

  // Fetch user's fridge and pantry items when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fridgeData = await getUserFridge(user.token);
        await setFridgeItems(fridgeData.ingredients);
        // Similarly, fetch pantry items
        const pantryData = await getUserPantry(user.token); // You would likely have a separate API call for the pantry
        await setPantryItems(pantryData.ingredients);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    if (user?.token) {
      fetchItems();
    }
  }, [user?.token]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    const results = await searchAllItems(query.trim());
    setSearchResults(results);
  };

  const handleSelectItem = async (item) => {
    const details = await searchOneItem(item.name);
    if (details.length > 0) {
      setSelectedItem(details[0]);
      setSelectedMeasure(details[0].altMeasures[0]);
      setQuantity(1);
      setCalories(details[0].calories);
      setModalVisible(true);
    }
  };

  const handleAddItem = async () => {
    const itemToAdd = {
      foodName: selectedItem.foodName,
      quantity: `${quantity} ${selectedMeasure.measure}`,
      calories: calories.toFixed(2),
    };

    try {
      if (targetLocation === 'fridge') {
        console.log('Adding to fridge:', itemToAdd);
        await addItemToFridge(itemToAdd, user.token);
        setFridgeItems((prevItems) => [...prevItems, itemToAdd]);
      } else {
        await addItemToPantry(itemToAdd, user.token);
        setPantryItems((prevItems) => [...prevItems, itemToAdd]);
      }
      
      setModalVisible(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (item, location) => {
    try {
      if (location === 'fridge') {
        await deleteFromFridge(item._id, user.token);
        setFridgeItems((prevItems) => prevItems.filter((i) => i._id !== item._id));
      } else {
        await deleteFromPantry(item._id, user.token);
        setPantryItems((prevItems) => prevItems.filter((i) => i._id !== item._id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleMeasureChange = (measure) => {
    setSelectedMeasure(measure);
    const caloriesPerGram = selectedItem.calories / selectedItem.servingWeightGrams;
    setCalories(caloriesPerGram * measure.serving_weight * quantity);
  };

  const handleQuantityChange = (value) => {
    const qty = parseFloat(value) || 0;
    setQuantity(qty);
    const caloriesPerGram = selectedItem.calories / selectedItem.servingWeightGrams;
    setCalories(caloriesPerGram * selectedMeasure.serving_weight * qty);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an ingredient"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(searchQuery)}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleSelectItem(item)}>
                <MaterialIcons name="add-circle" size={24} color="green" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Fridge Items */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Fridge</Text>
          {fridgeItems.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.column}>{item.foodName}</Text>
              <Text style={styles.column}>{item.quantity}</Text>
              <Text style={styles.column}>{item.calories} kcal</Text>
              <TouchableOpacity onPress={() => handleDeleteItem(item, 'fridge')}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Pantry Items */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pantry</Text>
          {pantryItems.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.column}>{item.foodName}</Text>
              <Text style={styles.column}>{item.quantity}</Text>
              <Text style={styles.column}>{item.calories} kcal</Text>
              <TouchableOpacity onPress={() => handleDeleteItem(item, 'pantry')}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

{selectedItem && (
  <Modal
    visible={modalVisible}
    animationType="slide" // or "fade" depending on the effect you want
    transparent={true}
  >
    <View style={styles.modalBackdrop}>
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
          <Text style={styles.modalTitle}>{selectedItem.foodName}</Text>
          <Text style={styles.modalSubText}>Brand: {selectedItem.brandName || 'N/A'}</Text>
          <Text style={styles.modalSubText}>Base Calories: {selectedItem.calories} kcal</Text>
          <Text style={styles.modalSubText}>Base Weight: {selectedItem.servingWeightGrams} g</Text>

          <Text style={styles.label}>Select Measure:</Text>
          {selectedItem.altMeasures.map((measure, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.measureOption, measure === selectedMeasure && styles.selectedMeasure]}
              onPress={() => handleMeasureChange(measure)}
            >
              <Text>{measure.measure} ({measure.serving_weight} g)</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.label}>Enter Quantity:</Text>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={quantity.toString()}
            onChangeText={handleQuantityChange}
          />

          <Text>Total Calories: {calories.toFixed(2)} kcal</Text>

          <Text style={styles.label}>Add To:</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, targetLocation === 'fridge' && styles.selectedToggleButton]}
              onPress={() => setTargetLocation('fridge')}
            >
              <Text>Fridge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, targetLocation === 'pantry' && styles.selectedToggleButton]}
              onPress={() => setTargetLocation('pantry')}
            >
              <Text>Pantry</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </ScrollView>
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
    backgroundColor: '#fff' 
  },
  searchContainer: { 
    flexDirection: 'row', 
    margin: 10, 
    justifyContent: 'center' 
  },
  searchInput: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    paddingHorizontal: 10, 
    paddingVertical: 8 
  },
  searchButton: { 
    marginLeft: 10, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    backgroundColor: '#ff870a', 
    borderRadius: 5 
  },
  searchButtonText: { 
    color: '#fff' 
  },
  resultItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
  },
  resultText: { 
    fontSize: 16, 
    fontWeight: '500' 
  },
  modalBackdrop: {
    flex: 1, // This ensures the backdrop takes up the full screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent backdrop
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '1000px', // Adjust width for the modal container
    maxHeight: '80%', // Ensure the modal doesn't take more than the screen space
  },
  scrollView: { 
    flex: 1, // Ensures the scroll view fills the modal
  },
  scrollContent: { 
    paddingBottom: 20 // Extra space for smooth scrolling
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  modalSubText: { 
    fontSize: 14, 
    marginBottom: 10 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '500', 
    marginVertical: 5 
  },
  measureOption: { 
    padding: 8, 
    backgroundColor: '#f1f1f1', 
    marginVertical: 5, 
    borderRadius: 5 
  },
  selectedMeasure: { 
    backgroundColor: '#d0f0d0' 
  },
  quantityInput: { 
    borderWidth: 1, 
    padding: 8, 
    borderColor: '#ccc', 
    marginBottom: 10, 
    borderRadius: 5 
  },
  toggleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginVertical: 10 
  },
  toggleButton: { 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    backgroundColor: '#eee', 
    borderRadius: 5 
  },
  selectedToggleButton: { 
    backgroundColor: '#b2d7d7' 
  },
  modalActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  addButton: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 5 
  },
  cancelButton: { 
    backgroundColor: '#f44336', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 5 
  },
  addButtonText: { 
    color: '#fff' 
  },
  cancelButtonText: { 
    color: '#fff' 
  },
  sectionContainer: { 
    padding: 10 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 5,
    borderBottomWidth: 1,  // Add this line
    borderBottomColor: 'gray'  // Light gray color, adjust as needed
  },
  column: { 
    flex: 1, 
    fontSize: 14 
  }
});


export default Fridge_Pantry;
