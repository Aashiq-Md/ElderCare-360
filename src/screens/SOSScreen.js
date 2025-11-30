import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SOSScreen() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [vitals] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    spo2: 98,
    temperature: 98.6
  });

  const triggerEmergency = () => {
    Alert.alert(
      '🚨 Emergency Alert',
      'This will send an emergency alert to all your emergency contacts with your location. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send SOS', 
          onPress: () => {
            Alert.alert('🚨 SOS SENT', 'Emergency alert sent to all contacts with your GPS location.\n\nEmergency services have been notified.');
          }
        }
      ]
    );
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    Alert.alert(
      isMonitoring ? 'Monitoring Stopped' : 'Monitoring Started',
      isMonitoring ? 
        'AI emergency detection has been turned off.' : 
        'AI emergency detection is now active. The app will monitor for falls, seizures, and other emergencies.'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency SOS</Text>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: isMonitoring ? '#10B981' : '#94A3B8' }]} />
          <Text style={styles.statusText}>{isMonitoring ? 'Monitoring' : 'Inactive'}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.sosButton} onPress={triggerEmergency}>
          <Ionicons name="warning" size={40} color="white" />
          <Text style={styles.sosText}>EMERGENCY SOS</Text>
          <Text style={styles.sosSubtext}>Tap to send immediate alert</Text>
        </TouchableOpacity>

        <View style={styles.monitoringCard}>
          <Text style={styles.cardTitle}>AI Emergency Detection</Text>
          <Text style={styles.cardDescription}>
            Monitors for falls, seizures, cardiac events, and other emergencies using health data and device sensors.
          </Text>
          
          <TouchableOpacity 
            style={[styles.monitoringButton, isMonitoring ? styles.stopButton : styles.startButton]}
            onPress={toggleMonitoring}
          >
            <Ionicons name={isMonitoring ? "stop" : "play"} size={20} color="white" />
            <Text style={styles.monitoringButtonText}>
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.vitalsCard}>
          <Text style={styles.cardTitle}>Current Health Status</Text>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalItem}>
              <Ionicons name="heart" size={20} color="#EF4444" />
              <Text style={styles.vitalValue}>{vitals.heartRate}</Text>
              <Text style={styles.vitalLabel}>BPM</Text>
            </View>
            <View style={styles.vitalItem}>
              <Ionicons name="fitness" size={20} color="#10B981" />
              <Text style={styles.vitalValue}>{vitals.bloodPressure}</Text>
              <Text style={styles.vitalLabel}>BP</Text>
            </View>
            <View style={styles.vitalItem}>
              <Ionicons name="water" size={20} color="#2563EB" />
              <Text style={styles.vitalValue}>{vitals.spo2}%</Text>
              <Text style={styles.vitalLabel}>SpO2</Text>
            </View>
            <View style={styles.vitalItem}>
              <Ionicons name="thermometer" size={20} color="#F59E0B" />
              <Text style={styles.vitalValue}>{vitals.temperature}°F</Text>
              <Text style={styles.vitalLabel}>Temp</Text>
            </View>
          </View>
        </View>

        <View style={styles.contactsCard}>
          <Text style={styles.cardTitle}>Emergency Contacts</Text>
          <View style={styles.contactItem}>
            <Ionicons name="person" size={16} color="#64748B" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>John Doe (Son)</Text>
              <Text style={styles.contactPhone}>+1-555-0123</Text>
            </View>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="medical" size={16} color="#64748B" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Emergency Services</Text>
              <Text style={styles.contactPhone}>911</Text>
            </View>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="business" size={16} color="#64748B" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Dr. Sarah Smith</Text>
              <Text style={styles.contactPhone}>+1-555-0456</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  statusIndicator: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  content: { flex: 1, padding: 20 },
  sosButton: { backgroundColor: '#EF4444', alignItems: 'center', padding: 32, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  sosText: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 12 },
  sosSubtext: { color: 'white', fontSize: 14, marginTop: 4, opacity: 0.9 },
  monitoringCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  cardDescription: { fontSize: 14, color: '#64748B', marginBottom: 16, lineHeight: 20 },
  monitoringButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8 },
  startButton: { backgroundColor: '#10B981' },
  stopButton: { backgroundColor: '#EF4444' },
  monitoringButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
  vitalsCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  vitalsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  vitalItem: { alignItems: 'center' },
  vitalValue: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginTop: 4 },
  vitalLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },
  contactsCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  contactInfo: { marginLeft: 12, flex: 1 },
  contactName: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  contactPhone: { fontSize: 14, color: '#64748B', marginTop: 2 }
});