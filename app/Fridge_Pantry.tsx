import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const Fridge_Pantry: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [fridgeItems, setFridgeItems] = useState([
    { name: 'Large eggs', amount: '3 (5.82oz)' },
  ]);
  const [pantryItems, setPantryItems] = useState([
    { name: 'Yeast', amount: '1 oz' },
  ]);

  useEffect(() => {
    if (route.params?.newIngredient) {
      const { newIngredient } = route.params;
      setFridgeItems((prevItems) => [...prevItems, newIngredient]);
    }
  }, [route.params?.newIngredient]);

  const deleteFridgeItem = (index: number) => {
    setFridgeItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const deletePantryItem = (index: number) => {
    setPantryItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Fridge</Text>
          {fridgeItems.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.column}>{item.name}</Text>
              <Text style={styles.column}>{item.amount}</Text>
              <TouchableOpacity onPress={() => deleteFridgeItem(index)} style={styles.iconButton}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add_Ingredient')}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pantry</Text>
          {pantryItems.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.column}>{item.name}</Text>
              <Text style={styles.column}>{item.amount}</Text>
              <TouchableOpacity onPress={() => deletePantryItem(index)} style={styles.iconButton}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Add_Ingredient')}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {['Home', 'Pantry', 'Meals', 'Recipes', 'AIChat', 'Profile'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.navItem}
            onPress={() => {
              if(tab == "Home"){
                navigation.navigate("homepage");
              }
              else if(tab == "Meals"){
                navigation.navigate("mealplanpage")
              }
              else{navigation.navigate(tab)}
              }}
          >
            <Text style={styles.navText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sectionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff870a',
    marginVertical: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  column: {
    fontSize: 16,
    textAlign: 'center',
    width: '40%',
  },
  iconButton: {
    paddingHorizontal: 5,
  },
  addButton: {
    backgroundColor: '#ff870a',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    width: '80%',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 14,
    color: '#ff870a',
  },
});

export default Fridge_Pantry;
