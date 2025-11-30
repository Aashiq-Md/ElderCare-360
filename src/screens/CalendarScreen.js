import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ title: '', time: '', notes: '' });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const saved = await storage.getItem('appointments');
      if (saved) {
        setAppointments(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading appointments:', error);
    }
  };

  const saveAppointments = async (updatedAppointments) => {
    try {
      await storage.setItem('appointments', JSON.stringify(updatedAppointments));
    } catch (error) {
      console.log('Error saving appointments:', error);
    }
  };

  const addAppointment = () => {
    if (!newAppointment.title || !newAppointment.time) {
      Alert.alert('Error', 'Please fill title and time');
      return;
    }

    const appointment = {
      id: Date.now(),
      ...newAppointment
    };

    const updated = {
      ...appointments,
      [selectedDate]: appointments[selectedDate] 
        ? [...appointments[selectedDate], appointment]
        : [appointment]
    };

    setAppointments(updated);
    saveAppointments(updated);
    setNewAppointment({ title: '', time: '', notes: '' });
    setShowAddModal(false);
  };

  const deleteAppointment = (appointmentId) => {
    Alert.alert('Delete Appointment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          const updated = { ...appointments };
          updated[selectedDate] = updated[selectedDate]?.filter(app => app.id !== appointmentId);
          if (updated[selectedDate]?.length === 0) {
            delete updated[selectedDate];
          }
          setAppointments(updated);
          saveAppointments(updated);
        }
      }
    ]);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medical Calendar</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
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
              const hasAppointment = appointments[dateString] && appointments[dateString].length > 0;
              
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    isSelected && styles.selectedDay,
                    hasAppointment && styles.appointmentDay
                  ]}
                  onPress={() => setSelectedDate(dateString)}
                >
                  <Text style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText
                  ]}>
                    {day}
                  </Text>
                  {hasAppointment && <View style={styles.appointmentDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.appointmentsSection}>
          <Text style={styles.sectionTitle}>
            Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          
          {appointments[selectedDate] && appointments[selectedDate].length > 0 ? (
            appointments[selectedDate].map(appointment => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                  <Text style={styles.appointmentTime}>{appointment.time}</Text>
                  {appointment.notes && (
                    <Text style={styles.appointmentNotes}>{appointment.notes}</Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => deleteAppointment(appointment.id)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noAppointments}>
              <Ionicons name="calendar-outline" size={40} color="#94A3B8" />
              <Text style={styles.noAppointmentsText}>No appointments scheduled</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Appointment</Text>
            <Text style={styles.modalDate}>
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Appointment Title"
              value={newAppointment.title}
              onChangeText={(text) => setNewAppointment({...newAppointment, title: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 10:00 AM)"
              value={newAppointment.time}
              onChangeText={(text) => setNewAppointment({...newAppointment, time: text})}
            />
            
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Notes (optional)"
              value={newAppointment.notes}
              onChangeText={(text) => setNewAppointment({...newAppointment, notes: text})}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addAppointment}>
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  addButton: { backgroundColor: '#2563EB', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  calendar: { backgroundColor: 'white', margin: 20, padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  monthTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#1E293B' },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  dayHeader: { fontSize: 14, fontWeight: 'bold', color: '#64748B', width: 40, textAlign: 'center' },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  emptyDay: { width: 40, height: 40, margin: 2 },
  dayButton: { width: 40, height: 40, margin: 2, borderRadius: 20, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  selectedDay: { backgroundColor: '#2563EB' },
  appointmentDay: { backgroundColor: '#EF4444' },
  dayText: { fontSize: 16, color: '#1E293B' },
  selectedDayText: { color: 'white', fontWeight: 'bold' },
  appointmentDot: { position: 'absolute', bottom: 2, width: 4, height: 4, borderRadius: 2, backgroundColor: '#F59E0B' },
  appointmentsSection: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  appointmentCard: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  appointmentInfo: { flex: 1 },
  appointmentTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  appointmentTime: { fontSize: 16, color: '#2563EB', fontWeight: '600', marginTop: 4 },
  appointmentNotes: { fontSize: 14, color: '#64748B', marginTop: 4 },
  noAppointments: { alignItems: 'center', padding: 40 },
  noAppointmentsText: { fontSize: 16, color: '#94A3B8', marginTop: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', width: '90%', padding: 24, borderRadius: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 8, textAlign: 'center' },
  modalDate: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  notesInput: { height: 80, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { backgroundColor: '#F1F5F9', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, flex: 0.45 },
  cancelButtonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#64748B' },
  saveButton: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, flex: 0.45 },
  saveButtonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: 'white' }
});