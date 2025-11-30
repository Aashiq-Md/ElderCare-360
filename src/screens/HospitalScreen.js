import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';

export default function HospitalScreen() {
  const [userLocation, setUserLocation] = useState({ address: '', city: '', zipCode: '' });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [hospitals] = useState([
    { id: 1, name: 'City General Hospital', address: '123 Main St', distance: '0.8 miles', phone: '555-0123', rating: 4.5 },
    { id: 2, name: 'St. Mary Medical Center', address: '456 Oak Ave', distance: '1.2 miles', phone: '555-0456', rating: 4.3 },
    { id: 3, name: 'Regional Medical Hospital', address: '789 Pine Rd', distance: '2.1 miles', phone: '555-0789', rating: 4.7 }
  ]);

  useEffect(() => {
    loadUserLocation();
  }, []);

  const loadUserLocation = async () => {
    try {
      const saved = await storage.getItem('userLocation');
      if (saved) {
        setUserLocation(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading location:', error);
    }
  };

  const saveUserLocation = async () => {
    if (!userLocation.address || !userLocation.city) {
      Alert.alert('Error', 'Please fill address and city');
      return;
    }
    
    try {
      await storage.setItem('userLocation', JSON.stringify(userLocation));
      setShowLocationModal(false);
      Alert.alert('Success', 'Location updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save location');
    }
  };

  const callEmergency = () => {
    Alert.alert('Emergency Call', 'This will call 911. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call 911', onPress: () => Alert.alert('Calling 911...') }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Hospitals</Text>
        <TouchableOpacity style={styles.locationButton} onPress={() => setShowLocationModal(true)}>
          <Ionicons name="location" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.emergencyButton} onPress={callEmergency}>
          <Ionicons name="call" size={24} color="white" />
          <Text style={styles.emergencyText}>EMERGENCY 911</Text>
        </TouchableOpacity>

        <View style={styles.locationCard}>
          <Ionicons name="location-outline" size={24} color="#2563EB" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Your Location</Text>
            <Text style={styles.locationText}>
              {userLocation.address ? 
                `${userLocation.address}, ${userLocation.city} ${userLocation.zipCode}` : 
                'Tap to set your location'
              }
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowLocationModal(true)}>
            <Ionicons name="pencil" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Medical Facilities</Text>
        {hospitals.map(hospital => (
          <View key={hospital.id} style={styles.hospitalCard}>
            <View style={styles.hospitalHeader}>
              <Text style={styles.hospitalName}>{hospital.name}</Text>
              <Text style={styles.distance}>{hospital.distance}</Text>
            </View>
            <Text style={styles.hospitalAddress}>{hospital.address}</Text>
            <View style={styles.hospitalFooter}>
              <View style={styles.rating}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.ratingText}>{hospital.rating}</Text>
              </View>
              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => Alert.alert('Calling', `Calling ${hospital.phone}`)}
              >
                <Ionicons name="call" size={16} color="white" />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showLocationModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Your Location</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Street Address"
              value={userLocation.address}
              onChangeText={(text) => setUserLocation({...userLocation, address: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="City"
              value={userLocation.city}
              onChangeText={(text) => setUserLocation({...userLocation, city: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="ZIP Code"
              value={userLocation.zipCode}
              onChangeText={(text) => setUserLocation({...userLocation, zipCode: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowLocationModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveUserLocation}>
                <Text style={styles.saveButtonText}>Save Location</Text>
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
  locationButton: { backgroundColor: '#2563EB', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: 20 },
  emergencyButton: { backgroundColor: '#EF4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  emergencyText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  locationCard: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  locationInfo: { marginLeft: 12, flex: 1 },
  locationTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  locationText: { fontSize: 14, color: '#64748B', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  hospitalCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  hospitalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  hospitalName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', flex: 1 },
  distance: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
  hospitalAddress: { fontSize: 14, color: '#64748B', marginBottom: 12 },
  hospitalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, fontWeight: '600', color: '#64748B', marginLeft: 4 },
  callButton: { backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  callButtonText: { color: 'white', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', width: '90%', padding: 24, borderRadius: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { backgroundColor: '#F1F5F9', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, flex: 0.45 },
  cancelButtonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#64748B' },
  saveButton: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, flex: 0.45 },
  saveButtonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: 'white' }
});