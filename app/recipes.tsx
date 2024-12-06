import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, Picker } from 'react-native';
import BottomNav from '@/components/BottomNav'; // Assuming you have a BottomNav component
import { useRouter } from 'expo-router';
import LogoutButton from '@/components/LogoutButton'; // Import the LogoutButton component

const measurementOptions = ['grams', 'ml', 'cups', 'tablespoons', 'teaspoons', 'pieces'];

const Recipes: React.FC = () => {
  const router = useRouter();
  const [recipesData, setRecipesData] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [newRecipeTitle, setNewRecipeTitle] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', measure: 'grams' }]);
  const [instructions, setInstructions] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const toggleAddModal = () => {
    setAddModalVisible(!isAddModalVisible);
  };

  const toggleViewModal = (recipe = null) => {
    setSelectedRecipe(recipe);
    setViewModalVisible(!!recipe);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', measure: 'grams' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleAddRecipe = () => {
    if (newRecipeTitle.trim() && instructions.trim() && ingredients.every((ing) => ing.name && ing.quantity)) {
      const newRecipe = {
        id: (recipesData.length + 1).toString(),
        title: newRecipeTitle.trim(),
        ingredients,
        instructions,
      };
      setRecipesData([...recipesData, newRecipe]);
      setNewRecipeTitle('');
      setIngredients([{ name: '', quantity: '', measure: 'grams' }]);
      setInstructions('');
      setAddModalVisible(false);
    } else {
      alert('Please fill all fields and ensure each ingredient has a name and quantity.');
    }
  };

  const handleDeleteRecipe = (id) => {
    const updatedRecipes = recipesData.filter((recipe) => recipe.id !== id);
    setRecipesData(updatedRecipes);
    setViewModalVisible(false); // Close the modal after deletion
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

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => toggleViewModal(item)}>
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
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
        keyExtractor={(item) => item.id}
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
            <ScrollView>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <TextInput
                    style={[styles.input, styles.ingredientInput]}
                    placeholder="Ingredient Name"
                    value={ingredient.name}
                    onChangeText={(text) => handleIngredientChange(index, 'name', text)}
                  />
                  <TextInput
                    style={[styles.input, styles.quantityInput]}
                    placeholder="Quantity"
                    keyboardType="numeric"
                    value={ingredient.quantity}
                    onChangeText={(text) => handleIngredientChange(index, 'quantity', text)}
                  />
                  <Picker
                    selectedValue={ingredient.measure}
                    style={styles.measurePicker}
                    onValueChange={(value) => handleIngredientChange(index, 'measure', value)}
                  >
                    {measurementOptions.map((option, i) => (
                      <Picker.Item key={i} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
              ))}
              <TouchableOpacity style={styles.addIngredientButton} onPress={handleAddIngredient}>
                <Text style={styles.addIngredientButtonText}>+ Add Ingredient</Text>
              </TouchableOpacity>
            </ScrollView>
            <Text style={styles.sectionSubtitle}>Instructions</Text>
            <TextInput
              style={[styles.input, styles.instructionsInput]}
              placeholder="Add instructions here..."
              value={instructions}
              onChangeText={setInstructions}
              multiline
            />
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={toggleAddModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddRecipe}>
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
            <Text style={styles.modalTitle}>{selectedRecipe?.title}</Text>
            <Text style={styles.sectionSubtitle}>Ingredients</Text>
            {selectedRecipe?.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>
                {`${ingredient.name} - ${ingredient.quantity} ${ingredient.measure}`}
              </Text>
            ))}
            <Text style={styles.sectionSubtitle}>Instructions</Text>
            <Text>{selectedRecipe?.instructions}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteRecipe(selectedRecipe?.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => toggleViewModal()}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNav
        items={['Home', 'Pantry', 'Meals', 'Recipes', 'Profile']}
        onNavigate={handleNavigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFA500', paddingVertical: 15, paddingHorizontal: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  addButton: { backgroundColor: '#fff', borderRadius: 25, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { fontSize: 24, color: '#FFA500' },
  listContainer: { paddingHorizontal: 20 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 15 },
  card: { marginTop: 10, backgroundColor: '#facd9e', borderRadius: 10, padding: 15, width: '45%', elevation: 3, alignItems: 'center' },
  cardText: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, },
  ingredientInput: { flex: 2, marginRight: 10 },
  quantityInput: { flex: 1, marginRight: 10 },
  measurePicker: { flex: 1 },
  addIngredientButton: { alignItems: 'center', marginVertical: 10 },
  addIngredientButtonText: { fontSize: 16, color: '#FFA500', fontWeight: 'bold' },
  instructionsInput: { height: 80, textAlignVertical: 'top' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelButton: { backgroundColor: '#ddd', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cancelButtonText: { fontSize: 16, color: '#333' },
  saveButton: { backgroundColor: '#FFA500', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  saveButtonText: { fontSize: 16, color: '#fff' },
  closeButton: { marginTop: 20, alignItems: 'center' },
  closeButtonText: { fontSize: 16, color: '#FFA500',fontWeight: 'bold', },
  ingredientText: { fontSize: 14, color: '#333', marginBottom: 5 },
  // deleteButton: {
  //   backgroundColor: '#FF4C4C', // Red background color
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 8,
  //   alignItems: 'center',
  // },
  deleteButtonText: {
    color: '#FFA500', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default Recipes;
