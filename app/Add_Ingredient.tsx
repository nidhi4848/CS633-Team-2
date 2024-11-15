import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const Add_Ingredients: React.FC = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const ingredients = [
    { name: '4 spices mix', category: 'Spices' },
    { name: '5 berries mix', category: 'Spices' },
    { name: 'Acacia honey', category: 'Pantry' },
    { name: 'Achiote paste', category: 'Spices' },
    { name: 'Ackee', category: 'Fridge' },
  ];

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Function to handle adding/updating the ingredient in Fridge_Pantry
  const handleSave = () => {
    if (selectedIngredient && quantity && unit) {
      navigation.navigate('Fridge_Pantry', {
        newIngredient: {
          name: selectedIngredient.name,
          amount: `${quantity} ${unit}`,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Ingredient</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Type ingredient name to search..."
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          setSelectedIngredient(null);
        }}
      />

      {selectedIngredient && (
        <View style={styles.inputContainer}>
          <Text style={styles.selectedIngredientText}>{selectedIngredient.name}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <Picker
            selectedValue={unit}
            onValueChange={(itemValue) => setUnit(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Unit" value="" />
            <Picker.Item label="Cups" value="cups" />
            <Picker.Item label="Tbsp" value="tbsp" />
            <Picker.Item label="Tsp" value="tsp" />
            <Picker.Item label="Fl Oz" value="fl oz" />
            <Picker.Item label="Ounces" value="oz" />
            <Picker.Item label="Pounds" value="lbs" />
            <Picker.Item label="Grams" value="g" />
            <Picker.Item label="Kilograms" value="kg" />
            <Picker.Item label="Milliliters" value="ml" />
            <Picker.Item label="Liters" value="l" />
          </Picker>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Add/Update</Text>
          </TouchableOpacity>
        </View>
      )}

      {!selectedIngredient && searchText.length > 0 && (
        <FlatList
          data={filteredIngredients}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedIngredient(item)}>
              <Text style={styles.ingredientItem}>{item.name} - {item.category}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff870a',
    marginVertical: 10,
    textAlign: 'center',
  },
  searchInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 40,
    textAlign: 'center',
  },
  flatListContainer: {
    alignItems: 'center',
  },
  ingredientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  selectedIngredientText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 40,
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
    height: 40,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#ff870a',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Add_Ingredients;
