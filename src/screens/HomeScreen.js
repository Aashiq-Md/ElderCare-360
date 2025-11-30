import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import WebScrollView from '../components/WebScrollView';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [heartRate, setHeartRate] = useState(72);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setHeartRate(Math.floor(Math.random() * (85 - 65) + 65));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <WebScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>Patient</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={48} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <View style={styles.timeCard}>
        <Text style={styles.timeText}>
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        <Text style={styles.clockText}>
          {currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>

      <View style={styles.vitalsCard}>
        <Text style={styles.cardTitle}>Today's Health Overview</Text>
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalItem}>
            <Ionicons name="heart" size={24} color="#EF4444" />
            <Text style={styles.vitalValue}>{heartRate}</Text>
            <Text style={styles.vitalLabel}>BPM</Text>
          </View>
          <View style={styles.vitalItem}>
            <Ionicons name="fitness" size={24} color="#10B981" />
            <Text style={styles.vitalValue}>120/80</Text>
            <Text style={styles.vitalLabel}>BP</Text>
          </View>
          <View style={styles.vitalItem}>
            <Ionicons name="water" size={24} color="#2563EB" />
            <Text style={styles.vitalValue}>98%</Text>
            <Text style={styles.vitalLabel}>SpO2</Text>
          </View>
          <View style={styles.vitalItem}>
            <Ionicons name="walk" size={24} color="#F59E0B" />
            <Text style={styles.vitalValue}>3420</Text>
            <Text style={styles.vitalLabel}>Steps</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#10B981' }]}
            onPress={() => navigation.navigate('Medicine')}
          >
            <Ionicons name="medical" size={28} color="white" />
            <Text style={styles.actionText}>Medicine</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#2563EB' }]}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Ionicons name="calendar" size={28} color="white" />
            <Text style={styles.actionText}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#F59E0B' }]}
            onPress={() => navigation.navigate('Hospital')}
          >
            <Ionicons name="business" size={28} color="white" />
            <Text style={styles.actionText}>Hospital</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#EF4444' }]}
            onPress={() => navigation.navigate('SOS')}
          >
            <Ionicons name="warning" size={28} color="white" />
            <Text style={styles.actionText}>Emergency</Text>
          </TouchableOpacity>
        </View>
      </View>
    </WebScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC',
    ...(Platform.OS === 'web' && {
      maxWidth: 400,
      alignSelf: 'center',
      minHeight: '100vh'
    })
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  greeting: { fontSize: 16, color: '#64748B' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginTop: 4 },
  timeCard: { backgroundColor: 'white', margin: 20, padding: 24, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  timeText: { fontSize: 16, color: '#64748B', marginBottom: 8 },
  clockText: { fontSize: 32, fontWeight: 'bold', color: '#2563EB' },
  vitalsCard: { backgroundColor: 'white', margin: 20, marginTop: 0, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  vitalsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  vitalItem: { alignItems: 'center' },
  vitalValue: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginTop: 8 },
  vitalLabel: { fontSize: 12, color: '#64748B', marginTop: 4 },
  quickActions: { backgroundColor: 'white', margin: 20, marginTop: 0, marginBottom: 40, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { width: '48%', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  actionText: { color: 'white', fontSize: 14, fontWeight: 'bold', marginTop: 8 }
});