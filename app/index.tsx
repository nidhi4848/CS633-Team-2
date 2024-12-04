import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { View, StyleSheet } from 'react-native';
import MealPlanPage from './meal-plan/[date]';
import LoginScreen from './(Authentication)/LoginScreen';

const CalendarPage = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    router.push(`/MealPlanPage/`);
  };

  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarPage;
