import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, FlatList, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { searchAllItems, searchOneItem } from '../api/searchController';
import { getUserFridge, addItemToFridge, deleteFromFridge } from '../api/fridgeController';
import { getUserPantry, addItemToPantry, deleteFromPantry } from '../api/pantryController';
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fridgeData = await getUserFridge(user.token);
        await setFridgeItems(fridgeData.ingredients);
        const pantryData = await getUserPantry(user.token);
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
      <View style={styles.logoutButtonContainer}>
        <LogoutButton />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          testID="searchInput"
          style={styles.searchInput}
          placeholder="Search for an ingredient"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        <TouchableOpacity testID="searchButton" style={styles.searchButton} onPress={() => handleSearch(searchQuery)}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {searchQuery.trim() !== '' && searchResults.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            testID="searchResultsList"
            data={searchResults}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity testID={`searchItem-${item.name}`} style={styles.dropdownItem} onPress={() => handleSelectItem(item)}>
                <Text style={styles.dropdownText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle} testID="fridge-header">Fridge</Text>
          {fridgeItems.map((item, index) => (
            <View key={index} style={styles.row} testID="fridge-item">
              <Text style={styles.column}>{item.foodName}</Text>
              <Text style={styles.column}>{item.quantity}</Text>
              <Text style={styles.column}>{item.calories} kcal</Text>
              <TouchableOpacity testID={`deleteFridgeItem-${item.foodName}`} onPress={() => handleDeleteItem(item, 'fridge')}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle} testID="pantry-header">Pantry</Text>
          {pantryItems.map((item, index) => (
            <View key={index} style={styles.row} testID="pantry-item">
              <Text style={styles.column}>{item.foodName}</Text>
              <Text style={styles.column}>{item.quantity}</Text>
              <Text style={styles.column}>{item.calories} kcal</Text>
              <TouchableOpacity testID={`deletePantryItem-${item.foodName}`} onPress={() => handleDeleteItem(item, 'pantry')}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {selectedItem && (
        <Modal testID="itemModal" visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
                <Text style={styles.modalTitle} testID="modalTitle">{selectedItem.foodName}</Text>
                <Text style={styles.modalSubText} testID="modalBrand">Brand: {selectedItem.brandName || 'N/A'}</Text>
                <Text style={styles.modalSubText} testID="modalCalories">Base Calories: {selectedItem.calories} kcal</Text>
                <Text style={styles.modalSubText} testID="modalWeight">Base Weight: {selectedItem.servingWeightGrams} g</Text>

                <Text style={styles.label} testID="selectMeasureLabel">Select Measure:</Text>
                <View style={{ alignItems: 'center' }}>
                  {selectedItem.altMeasures.map((measure, index) => (
                    <TouchableOpacity
                      key={index}
                      testID={`measureOption-${measure.measure}`}
                      style={[styles.measureOption, measure === selectedMeasure && styles.selectedMeasure]}
                      onPress={() => handleMeasureChange(measure)}
                    >
                      <Text>{measure?.measure || 'N/A'} ({measure?.serving_weight || '0'} g)</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Enter Quantity:</Text>
                <TextInput
                  testID="quantityInput"
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={quantity.toString()}
                  onChangeText={handleQuantityChange}
                />

                <Text>Total Calories: {calories.toFixed(2)} kcal</Text>

                <Text style={styles.label} testID="addToLabel">Add To:</Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    testID="addToFridge"
                    style={[styles.toggleButton, targetLocation === 'fridge' && styles.selectedToggleButton]}
                    onPress={() => setTargetLocation('fridge')}
                  >
                    <Text>Fridge</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="addToPantry"
                    style={[styles.toggleButton, targetLocation === 'pantry' && styles.selectedToggleButton]}
                    onPress={() => setTargetLocation('pantry')}
                  >
                    <Text>Pantry</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity testID="addButton" style={styles.addButton} onPress={handleAddItem}>
                  <Text style={styles.addButtonText}>Add Item</Text>
                </TouchableOpacity>

                <TouchableOpacity testID="closeModalButton" style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      <BottomNav testID="bottomNav" items={['Home', 'Pantry', 'Meals', 'Recipes', 'Profile']} onNavigate={handleNavigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Existing styles remain unchanged
});

export default Fridge_Pantry;
