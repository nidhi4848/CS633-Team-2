import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, FlatList, Modal } from 'react-native';

const CalendarPage = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (day) => {
    const formattedDate = day.dateString; // Format is already YYYY-MM-DD
    router.push(`/meal-plan/${formattedDate}`);
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.title}>Planner</Text>
      <Calendar
        onDayPress={handleDateClick}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#00adf5' },
        }}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          arrowColor: '#00adf5',
        }}
      />
      <View style={styles.bottomNav}>
        {['Home', 'Pantry', 'Meals', 'Recipes','Profile'].map((tab) => (
          <TouchableOpacity key={tab} style={styles.navItem}>
            <Text style={styles.navText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  bottomNav: {
    
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', 
    paddingVertical: 12,
    backgroundColor: '#ff870a',
    width: '100%',
    color: '#fff',
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navText: {
    textAlign: 'center',
    color: "#fff",
  },
});

export default CalendarPage;
