import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HeartMonitorScreen() {
  const [currentRate, setCurrentRate] = useState(72);
  const [status, setStatus] = useState("Normal");
  const [isConnected, setIsConnected] = useState(false);
  const [fitbitData, setFitbitData] = useState({
    steps: 3420,
    calories: 1250,
    distance: 2.1,
    activeMinutes: 45
  });
  const [heartRateHistory, setHeartRateHistory] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newReading = Math.floor(Math.random() * (89 - 65 + 1) + 65);
      setCurrentRate(newReading);
      
      // Update status based on heart rate
      if (newReading > 100) setStatus("High");
      else if (newReading < 60) setStatus("Low");
      else setStatus("Normal");
      
      // Add to history (keep last 10 readings)
      setHeartRateHistory(prev => {
        const newHistory = [...prev, { rate: newReading, time: new Date() }];
        return newHistory.slice(-10);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const connectToFitbit = () => {
    Alert.alert(
      "Connect to Fitbit",
      "This will connect to your Fitbit device for real-time health monitoring.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Connect", 
          onPress: () => {
            setIsConnected(true);
            Alert.alert("Success", "Connected to Fitbit device!");
          }
        }
      ]
    );
  };

  const getStatusColor = () => {
    switch (status) {
      case "High": return "#D32F2F";
      case "Low": return "#FF6F00";
      default: return "#2E7D32";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "High": return "trending-up";
      case "Low": return "trending-down";
      default: return "checkmark-circle";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Heart Monitor</Text>
        <TouchableOpacity 
          style={[styles.connectButton, isConnected && styles.connectedButton]}
          onPress={connectToFitbit}
        >
          <Ionicons 
            name={isConnected ? "bluetooth" : "bluetooth-outline"} 
            size={20} 
            color="white" 
          />
          <Text style={styles.connectText}>
            {isConnected ? "Connected" : "Connect Fitbit"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Heart Rate Display */}
      <View style={styles.heartRateCard}>
        <Text style={styles.cardTitle}>Current Heart Rate</Text>
        <View style={styles.heartRateDisplay}>
          <View style={[styles.heartCircle, { borderColor: getStatusColor() }]}>
            <Ionicons name="heart" size={40} color={getStatusColor()} />
            <Text style={[styles.heartRateNumber, { color: getStatusColor() }]}>
              {currentRate}
            </Text>
            <Text style={styles.bpmText}>BPM</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <Ionicons name={getStatusIcon()} size={24} color={getStatusColor()} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {status}
          </Text>
          {isConnected && <ActivityIndicator size="small" color={getStatusColor()} />}
        </View>
      </View>

      {/* Fitbit Integration Data */}
      <View style={styles.fitbitCard}>
        <Text style={styles.cardTitle}>Today's Activity (Fitbit)</Text>
        <View style={styles.activityGrid}>
          <View style={styles.activityItem}>
            <Ionicons name="walk" size={24} color="#1976D2" />
            <Text style={styles.activityValue}>{fitbitData.steps}</Text>
            <Text style={styles.activityLabel}>Steps</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="flame" size={24} color="#FF6F00" />
            <Text style={styles.activityValue}>{fitbitData.calories}</Text>
            <Text style={styles.activityLabel}>Calories</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="location" size={24} color="#2E7D32" />
            <Text style={styles.activityValue}>{fitbitData.distance}</Text>
            <Text style={styles.activityLabel}>Miles</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="time" size={24} color="#9C27B0" />
            <Text style={styles.activityValue}>{fitbitData.activeMinutes}</Text>
            <Text style={styles.activityLabel}>Active Min</Text>
          </View>
        </View>
      </View>

      {/* Heart Rate History */}
      <View style={styles.historyCard}>
        <Text style={styles.cardTitle}>Recent Readings</Text>
        {heartRateHistory.length > 0 ? (
          heartRateHistory.slice(-5).reverse().map((reading, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyRate}>{reading.rate} BPM</Text>
              <Text style={styles.historyTime}>
                {reading.time.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No readings yet</Text>
        )}
      </View>

      {/* Health Alerts */}
      <View style={styles.alertsCard}>
        <Text style={styles.cardTitle}>Health Alerts</Text>
        <View style={styles.alertItem}>
          <Ionicons name="information-circle" size={20} color="#1976D2" />
          <Text style={styles.alertText}>
            Heart rate monitoring active. Data synced with Fitbit.
          </Text>
        </View>
        {status !== "Normal" && (
          <View style={styles.alertItem}>
            <Ionicons name="warning" size={20} color="#FF6F00" />
            <Text style={styles.alertText}>
              Heart rate is {status.toLowerCase()}. Consider consulting your doctor.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  connectButton: { backgroundColor: '#1976D2', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  connectedButton: { backgroundColor: '#2E7D32' },
  connectText: { color: 'white', marginLeft: 5, fontSize: 14, fontWeight: 'bold' },
  heartRateCard: { backgroundColor: 'white', margin: 20, padding: 25, borderRadius: 20, elevation: 5, alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  heartRateDisplay: { alignItems: 'center', marginBottom: 20 },
  heartCircle: { width: 160, height: 160, borderRadius: 80, borderWidth: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' },
  heartRateNumber: { fontSize: 36, fontWeight: 'bold', marginTop: 5 },
  bpmText: { fontSize: 16, fontWeight: 'bold', color: '#666' },
  statusContainer: { flexDirection: 'row', alignItems: 'center' },
  statusText: { fontSize: 18, fontWeight: 'bold', marginLeft: 8, marginRight: 8 },
  fitbitCard: { backgroundColor: 'white', margin: 20, marginTop: 0, padding: 20, borderRadius: 15, elevation: 3 },
  activityGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  activityItem: { alignItems: 'center' },
  activityValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 5 },
  activityLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  historyCard: { backgroundColor: 'white', margin: 20, marginTop: 0, padding: 20, borderRadius: 15, elevation: 3 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  historyRate: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  historyTime: { fontSize: 14, color: '#666' },
  noDataText: { textAlign: 'center', color: '#666', fontStyle: 'italic' },
  alertsCard: { backgroundColor: 'white', margin: 20, marginTop: 0, marginBottom: 40, padding: 20, borderRadius: 15, elevation: 3 },
  alertItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  alertText: { marginLeft: 10, flex: 1, fontSize: 14, color: '#555' }
});