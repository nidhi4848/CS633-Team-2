import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './index';

type CalendarScreenProps = NativeStackScreenProps<RootStackParamList, 'Calendar'>;

const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: DateData) => {
          setSelectedDate(day.dateString);
          navigation.navigate('Planner', { date: day.dateString });
        }}
        markedDates={{
          [selectedDate || '']: { selected: true, selectedColor: 'red' },
        }}
        theme={{
          selectedDayBackgroundColor: 'red',
          todayTextColor: '#ff6600',
          arrowColor: '#ff6600',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default CalendarScreen;
