import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SimpleCalendar({ selectedDate, onDayPress, markedDates }) {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const currentDate = new Date(selectedDate);
  const days = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={styles.calendar}>
      <Text style={styles.monthTitle}>
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </Text>
      
      <View style={styles.weekHeader}>
        {dayNames.map(day => (
          <Text key={day} style={styles.dayHeader}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.daysContainer}>
        {days.map((day, index) => {
          if (day === null) {
            return <View key={index} style={styles.emptyDay} />;
          }
          
          const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = dateString === selectedDate;
          const isMarked = markedDates && markedDates[dateString];
          
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                isSelected && styles.selectedDay,
                isMarked && styles.markedDay
              ]}
              onPress={() => onDayPress({ dateString })}
            >
              <Text style={[
                styles.dayText,
                isSelected && styles.selectedDayText
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: { backgroundColor: 'white', padding: 16 },
  monthTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  dayHeader: { fontSize: 14, fontWeight: 'bold', color: '#666', width: 40, textAlign: 'center' },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  emptyDay: { width: 40, height: 40, margin: 2 },
  dayButton: { width: 40, height: 40, margin: 2, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  selectedDay: { backgroundColor: '#2563EB' },
  markedDay: { backgroundColor: '#EF4444' },
  dayText: { fontSize: 16, color: '#333' },
  selectedDayText: { color: 'white', fontWeight: 'bold' }
});