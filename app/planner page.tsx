import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './index';

type PlannerScreenProps = NativeStackScreenProps<RootStackParamList, 'Planner'>;

const PlannerScreen: React.FC<PlannerScreenProps> = ({ route }) => {
  const { date } = route.params;

  const renderMealSection = (meal: string) => (
    <View style={styles.mealSection}>
      <Text style={styles.mealTitle}>{meal}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Add Recipe" onPress={() => {}} color="#cccccc" />
        <Button title="Add Product" onPress={() => {}} color="#cccccc" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {renderMealSection('Breakfast')}
        {renderMealSection('Lunch')}
        {renderMealSection('Break')}
        {renderMealSection('Dinner')}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#ff6600',
    padding: 15,
  },
  dateText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
  },
  mealSection: {
    marginVertical: 10,
  },
  mealTitle: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default PlannerScreen;
