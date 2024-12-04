import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';

const MealPlanPage = () => {
  const { date } = useLocalSearchParams(); // Extract the `date` parameter from the route

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planner</Text>
      <Text style={styles.subtitle}>Date: {date}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Breakfast</Text>
        <Button title="Add Recipe" onPress={() => {}} />
        <Button title="Add Product" onPress={() => {}} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lunch</Text>
        <Button title="Add Recipe" onPress={() => {}} />
        <Button title="Add Product" onPress={() => {}} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Break</Text>
        <Button title="Add Recipe" onPress={() => {}} />
        <Button title="Add Product" onPress={() => {}} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dinner</Text>
        <Button title="Add Recipe" onPress={() => {}} />
        <Button title="Add Product" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default MealPlanPage;
