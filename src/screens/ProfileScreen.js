import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    bloodType: '',
    allergies: '',
    emergencyContact: '',
    emergencyName: '',
    medicalConditions: '',
    doctor: '',
    doctorPhone: '',
    insurance: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await storage.getItem('userProfile');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const saveProfile = async (updatedProfile) => {
    try {
      await storage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.log('Error saving profile:', error);
    }
  };

  const editField = (field, currentValue, label) => {
    setEditingField(field);
    setEditValue(currentValue);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editValue.trim()) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    const updatedProfile = { ...profile, [editingField]: editValue };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
    setShowEditModal(false);
    setEditingField('');
    setEditValue('');
  };

  const logout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await storage.removeItem('userToken');
          navigation.replace('Login');
        }
      }
    ]);
  };

  const getFieldLabel = (key) => {
    const labels = {
      name: 'Full Name',
      age: 'Age',
      bloodType: 'Blood Type',
      allergies: 'Allergies',
      emergencyContact: 'Emergency Phone',
      emergencyName: 'Emergency Contact',
      medicalConditions: 'Medical Conditions',
      doctor: 'Primary Doctor',
      doctorPhone: 'Doctor Phone',
      insurance: 'Insurance'
    };
    return labels[key] || key;
  };

  const profileSections = [
    {
      title: 'Personal Information',
      icon: 'person',
      fields: ['name', 'age', 'bloodType']
    },
    {
      title: 'Medical Information',
      icon: 'medical',
      fields: ['medicalConditions', 'allergies']
    },
    {
      title: 'Healthcare Provider',
      icon: 'business',
      fields: ['doctor', 'doctorPhone', 'insurance']
    },
    {
      title: 'Emergency Contact',
      icon: 'call',
      fields: ['emergencyName', 'emergencyContact']
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle" size={80} color="#2563EB" />
          <Text style={styles.profileName}>{profile.name || 'Patient Name'}</Text>
          <Text style={styles.profileAge}>{profile.age ? `Age ${profile.age}` : 'Age not set'}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon} size={20} color="#2563EB" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            
            {section.fields.map((field) => (
              <TouchableOpacity
                key={field}
                style={styles.fieldRow}
                onPress={() => editField(field, profile[field], getFieldLabel(field))}
              >
                <View style={styles.fieldInfo}>
                  <Text style={styles.fieldLabel}>{getFieldLabel(field)}</Text>
                  <Text style={styles.fieldValue}>
                    {profile[field] || 'Tap to add'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {getFieldLabel(editingField)}</Text>
            
            <TextInput
              style={[
                styles.input,
                (editingField === 'medicalConditions' || editingField === 'allergies') && styles.multilineInput
              ]}
              placeholder={`Enter ${getFieldLabel(editingField).toLowerCase()}`}
              value={editValue}
              onChangeText={setEditValue}
              multiline={editingField === 'medicalConditions' || editingField === 'allergies'}
              numberOfLines={editingField === 'medicalConditions' || editingField === 'allergies' ? 3 : 1}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                <Text style={styles.saveButtonText}>Save</Text>
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
  header: { backgroundColor: 'white', paddingTop: 60, paddingBottom: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  profileHeader: { alignItems: 'center' },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginTop: 12 },
  profileAge: { fontSize: 16, color: '#64748B', marginTop: 4 },
  content: { flex: 1, padding: 20 },
  section: { backgroundColor: 'white', borderRadius: 12, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginLeft: 8 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  fieldInfo: { flex: 1 },
  fieldLabel: { fontSize: 14, color: '#64748B', marginBottom: 4 },
  fieldValue: { fontSize: 16, color: '#1E293B', fontWeight: '500' },
  logoutButton: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, marginTop: 20, marginBottom: 40, borderWidth: 1, borderColor: '#EF4444' },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#EF4444', marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', width: '90%', padding: 24, borderRadius: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  multilineInput: { height: 80, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { backgroundColor: '#F1F5F9', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, flex: 0.45 },
  cancelButtonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#64748B' },
  saveButton: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, flex: 0.45 },
  saveButtonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: 'white' }
});