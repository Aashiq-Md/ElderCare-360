import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import WebScrollView from '../components/WebScrollView';
import WebButton from '../components/WebButton';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';

export default function WelcomeScreen({ navigation }) {
  const handleGetStarted = async () => {
    await storage.setItem('hasLaunched', 'true');
    navigation.replace('Login');
  };

  return (
    <WebScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="medical" size={60} color="white" />
        </View>
        <Text style={styles.title}>ElderCare 360</Text>
        <Text style={styles.subtitle}>Comprehensive Health Monitoring & Care</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        
        <View style={styles.feature}>
          <Ionicons name="heart" size={24} color="#EF4444" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Heart Monitoring</Text>
            <Text style={styles.featureDesc}>Real-time heart rate tracking</Text>
          </View>
        </View>

        <View style={styles.feature}>
          <Ionicons name="medical" size={24} color="#10B981" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Medicine Reminders</Text>
            <Text style={styles.featureDesc}>Smart medication scheduling</Text>
          </View>
        </View>

        <View style={styles.feature}>
          <Ionicons name="calendar" size={24} color="#2563EB" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Medical Calendar</Text>
            <Text style={styles.featureDesc}>Appointment scheduling</Text>
          </View>
        </View>

        <View style={styles.feature}>
          <Ionicons name="business" size={24} color="#F59E0B" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Hospital Locator</Text>
            <Text style={styles.featureDesc}>Find nearby medical facilities</Text>
          </View>
        </View>

        <View style={styles.mission}>
          <Text style={styles.missionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            To provide comprehensive healthcare monitoring for elderly patients, 
            ensuring safety, medication compliance, and emergency response.
          </Text>
        </View>
      </View>

      <WebButton style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
        <Ionicons name="arrow-forward" size={20} color="white" />
      </WebButton>
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
      paddingBottom: 100
    })
  },
  header: { backgroundColor: '#2563EB', alignItems: 'center', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 },
  logoContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 8 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 20 },
  feature: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  featureText: { marginLeft: 16, flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  featureDesc: { fontSize: 14, color: '#64748B', marginTop: 2 },
  mission: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  missionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2563EB', marginBottom: 12 },
  missionText: { fontSize: 16, color: '#64748B', lineHeight: 24 },
  button: { 
    backgroundColor: '#2563EB', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    margin: 20, 
    padding: 16, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 6,
    minHeight: 56,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent'
    })
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 8 }
});