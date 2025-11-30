import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../utils/storage';

export default function MedicineScreen() {
  const [medicines, setMedicines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: '', dosage: '', timing: '' });

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const saved = await storage.getItem('medicines');
      if (saved) {
        setMedicines(JSON.parse(saved));
      } else {
        const defaultMeds = [
          { id: 1, name: 'Metformin', dosage: '500mg', timing: '8:00 AM, 8:00 PM', taken: false }
        ];
        setMedicines(defaultMeds);
        await storage.setItem('medicines', JSON.stringify(defaultMeds));
      }
    } catch (error) {
      console.log('Error loading medicines:', error);
    }
  };

  const saveMedicines = async (updatedMedicines) => {
    try {
      await storage.setItem('medicines', JSON.stringify(updatedMedicines));
    } catch (error) {
      console.log('Error saving medicines:', error);
    }
  };

  const addMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.timing) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const medicine = {
      id: Date.now(),
      name: newMedicine.name,
      dosage: newMedicine.dosage,
      timing: newMedicine.timing,
      taken: false
    };

    const updated = [...medicines, medicine];
    setMedicines(updated);
    saveMedicines(updated);
    setNewMedicine({ name: '', dosage: '', timing: '' });
    setShowAddModal(false);
  };

  const toggleTaken = (id) => {
    const updated = medicines.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    );
    setMedicines(updated);
    saveMedicines(updated);
  };

  const deleteMedicine = (id) => {
    Alert.alert('Delete Medicine', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        onPress: () => {
          const updated = medicines.filter(med => med.id !== id);
          setMedicines(updated);
          saveMedicines(updated);
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicine Tracker</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {medicines.map(medicine => (
          <View key={medicine.id} style={styles.medicineCard}>
            <View style={styles.medicineHeader}>
              <View style={styles.medicineInfo}>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
                <Text style={styles.medicineTiming}>{medicine.timing}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteMedicine(medicine.id)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.takenButton, medicine.taken && styles.takenButtonActive]}
              onPress={() => toggleTaken(medicine.id)}
            >
              <Ionicons 
                name={medicine.taken ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={medicine.taken ? "white" : "#64748B"} 
              />
              <Text style={[styles.takenText, medicine.taken && styles.takenTextActive]}>
                {medicine.taken ? 'Taken' : 'Mark as Taken'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Medicine</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Medicine Name"
              value={newMedicine.name}
              onChangeText={(text) => setNewMedicine({...newMedicine, name: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Dosage (e.g., 500mg)"
              value={newMedicine.dosage}
              onChangeText={(text) => setNewMedicine({...newMedicine, dosage: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Timing (e.g., 8:00 AM, 8:00 PM)"
              value={newMedicine.timing}
              onChangeText={(text) => setNewMedicine({...newMedicine, timing: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addMedicine}>
                <Text style={styles.saveButtonText}>Add Medicine</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  addButton: { backgroundColor: '#10B981', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: 20 },
  medicineCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  medicineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  medicineInfo: { flex: 1 },
  medicineName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  medicineDosage: { fontSize: 16, color: '#10B981', fontWeight: '600', marginTop: 4 },
  medicineTiming: { fontSize: 14, color: '#64748B', marginTop: 4 },
  takenButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8 },
  takenButtonActive: { backgroundColor: '#10B981' },
  takenText: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#64748B' },
  takenTextActive: { color: 'white' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', width: '90%', padding: 24, borderRadius: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { backgroundColor: '#F1F5F9', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, flex: 0.45 },
  cancelButtonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#64748B' },
  saveButton: { backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, flex: 0.45 },
  saveButtonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: 'white' }
});