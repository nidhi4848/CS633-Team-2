import React, { useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, FlatList, Modal } from 'react-native';
import BottomNav from '@/components/BottomNav';

const CalendarPage = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (day) => {
    const formattedDate = day.dateString; // Format is already YYYY-MM-DD
    router.push(`/meal-plan/${formattedDate}`);
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
      {/* Bottom Navigation */}
      <BottomNav
        items={['Home', 'Pantry', 'Meals', 'Recipes', 'Profile']}
        onNavigate={handleNavigation}
      />
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

});

export default CalendarPage;
