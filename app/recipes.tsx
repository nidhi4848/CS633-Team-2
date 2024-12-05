import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import BottomNav from '@/components/BottomNav';
import { useRouter } from 'expo-router';

const recipesData = [
  { id: '1', title: 'Oat Milk Fettuccine Recipe by Tasty' },
  { id: '2', title: 'Coconut Chicken Tenders' },
  { id: '3', title: 'Greek Pastitsio (Baked Pasta with G)' },
  { id: '4', title: 'Buffalo Chicken Quesadillas' },
  { id: '5', title: 'Spring Vegetable Pasta Salad' },
  { id: '6', title: 'Lemon Chicken Piccata' },
];

const Recipes: React.FC = () => {
  const router = useRouter();
  const handleSelectIngredients = () => {
    // Logic for selecting ingredients can go here
    console.log('Select Ingredients button pressed');
  };

  const renderRecipeCard = ({ item }: { item: { id: string; title: string } }) => (
    <TouchableOpacity style={styles.card} key={item.id}>
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Recipes</Text>
      </View>

      {/* Select Ingredients Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.selectButton} onPress={handleSelectIngredients}>
          <Text style={styles.selectButtonText}>Select Ingredients</Text>
        </TouchableOpacity>
      </View>

      {/* Latest Recipes Section */}
      <Text style={styles.sectionTitle}>Latest Recipes</Text>

      {/* Recipes Grid */}
      <FlatList
        data={recipesData}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        numColumns={3} // Adjust for the number of columns
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  },
  header: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  selectButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
    marginLeft: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Recipes;
