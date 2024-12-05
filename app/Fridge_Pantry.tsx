import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, FlatList, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { searchAllItems, searchOneItem } from '../api/searchController';
import { getUserFridge, addItemToFridge, deleteFromFridge } from '../api/fridgeController'; // Import fridge API functions
import { getUserPantry, addItemToPantry, deleteFromPantry } from '../api/pantryController'; // Import pantry API functions
import useUser from '../hooks/userHook';
import LogoutButton from '../components/LogoutButton';
import BottomNav from '@/components/BottomNav';
import { useRouter } from 'expo-router';

const Fridge_Pantry: React.FC = () => {
  const router = useRouter()
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
  const [targetLocation, setTargetLocation] = useState('fridge');
  const [isEditing, setIsEditing] = useState(false);
const [editItem, setEditItem] = useState(null); 

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

  const handleEditItem = (item) => {
  setEditItem(item);
  setQuantity(parseFloat(item.quantity.split(" ")[0]) || 1); // Extract quantity from "5 kg" format
  setSelectedMeasure({ measure: "custom", serving_weight: 1 }); // Add default for custom measure
  setCalories(parseFloat(item.calories));
  setIsEditing(true); // Open editing modal
};

const handleSaveEdit = async () => {
  try {
    const updatedItem = {
      ...editItem,
      quantity: `${quantity} ${selectedMeasure.measure || ''}`,
      calories: calories.toFixed(2),
    };

    // Update in the database
    if (editItem.location === 'fridge') {
      await addItemToFridge(updatedItem, user.token); // Replace existing item logic
      setFridgeItems((prevItems) =>
        prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
    } else {
      await addItemToPantry(updatedItem, user.token); // Replace existing item logic
      setPantryItems((prevItems) =>
        prevItems.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
    }

    setIsEditing(false);
    setEditItem(null);
  } catch (error) {
    console.error("Error saving changes:", error);
  }
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

  const handleNavigation = (tab) => {
    switch (tab) {
      case 'Home':
        router.push('/homepage');
        break;
      case 'Pantry':
        router.push('/Fridge_Pantry');
        break;
      case 'Meals':
        router.push('/meal-plan/calendarpage');
        break;
      case 'Recipes':
        router.push('/recipes');
        break;
      case 'Profile':
        router.push('/ProfilePage');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Logout Button in Top-Right Corner */}
      <View style={styles.logoutButtonContainer}>
        <LogoutButton />
      </View>
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
      {searchQuery.trim() !== '' && searchResults.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectItem(item)}
              >
                <Text style={styles.dropdownText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false} // Hide vertical scroll indicator for cleaner UI
          />
        </View>
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
  animationType="slide"
  transparent={true}
>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>{selectedItem.foodName}</Text>
      <Text style={styles.modalSubText}>Brand: {selectedItem.brandName || 'N/A'}</Text>
      <Text style={styles.modalSubText}>Base Calories: {selectedItem.calories} kcal</Text>
      <Text style={styles.modalSubText}>Base Weight: {selectedItem.servingWeightGrams} g</Text>

      <Text style={styles.label}>Select Measure:</Text>
      {/* Scrollable Measures List */}
      <ScrollView style={styles.measureScroll}>
        {selectedItem.altMeasures.map((measure, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.measureOption, measure === selectedMeasure && styles.selectedMeasure]}
            onPress={() => handleMeasureChange(measure)}
          >
            <Text>{measure.measure} ({measure.serving_weight} g)</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
)}
{isEditing && (
  <Modal
    visible={isEditing}
    animationType="slide"
    transparent={true}
  >
    <View style={styles.modalBackdrop}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Edit Ingredient</Text>
        <Text style={styles.modalSubText}>{editItem?.foodName}</Text>

        <Text style={styles.label}>Enter Quantity:</Text>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={quantity.toString()}
          onChangeText={handleQuantityChange}
        />

        <Text style={styles.label}>Calories:</Text>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={calories.toFixed(2)}
          onChangeText={(value) => setCalories(parseFloat(value) || 0)}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleSaveEdit}>
          <Text style={styles.addButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={() => setIsEditing(false)}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}

      {/* Bottom Navigation */}
      <BottomNav
        items={['Home', 'Pantry', 'Meals', 'Recipes', 'Profile']}
        onNavigate={handleNavigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:20,
    // paddingBottom: 100,
    // justifyContent: 'center', // Centers items vertically
    // alignItems: 'center', // Centers items horizontally
  },
  logoutButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 10,
    zIndex: 10,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal : 20,
    backgroundColor: "ff870a",
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align to the left
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 10, // Add padding if you want some space on the left
  },
  searchInput: {
    width: '100%', // Adjust the width here (you can use specific pixel values like 250 or a percentage)
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: 'left', // Align text to the left
  },
  searchButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ff870a',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    textAlign: 'left',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Center-aligns icon and text
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionContainer: {
    padding: 10,
    alignItems: 'center',
    width: '100%', 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  column: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 5,
    textAlign: 'center',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  selectedToggleButton: {
    backgroundColor: '#b2d7d7',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#ff870a',
    width: '100%',
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navText: {
    textAlign: 'center',
    color: '#fff'
  },
  measureOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center', // Centers the text within the button
    justifyContent: 'center', // Ensures proper vertical alignment
    width: '80%', // Set a consistent button width
  },
  selectedMeasure: {
    backgroundColor: '#4CAF50', // Highlight selected measure
  },
  dropdownContainer: {
    maxHeight: '40%', // Limit dropdown height
    width: '100%',
    alignSelf: 'center', // Center the dropdown on the screen
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
    zIndex: 1000, // Ensure the dropdown appears above other elements
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // containerNav: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  // },
  measureScroll: {
    maxHeight: 150, // Restrict the height of the measure list
    width: '100%',
    marginVertical: 10,
  },
  measureOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  selectedMeasure: {
    backgroundColor: '#4CAF50',
  },
  // modalContainer: {
  //   backgroundColor: 'white',
  //   padding: 20,
  //   borderRadius: 10,
  //   width: '90%',
  //   alignItems: 'center',
  // },
  // modalBackdrop: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  // },
  
});

export default Fridge_Pantry;