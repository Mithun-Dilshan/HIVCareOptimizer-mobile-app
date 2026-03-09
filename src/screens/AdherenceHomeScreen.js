import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { database } from '../firebase/firebaseConfig';
import { ref, set, push } from 'firebase/database';
import * as Notifications from 'expo-notifications';
import { getCurrentUser } from '../firebase/firebaseService';

const DOSES = [
  { id: 'morning', label: 'Morning Dose', time: '8:00 AM' },
  { id: 'afternoon', label: 'Afternoon Dose', time: '2:00 PM' },
  { id: 'night', label: 'Night Dose', time: '8:00 PM' },
];

export default function AdherenceHomeScreen({ navigation }) {
  const [patientId, setPatientId] = useState('P_001'); // For now, hardcoded, can get from user

  useEffect(() => {
    requestPermissions();
    scheduleNotifications();

    // Listen for notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const doseId = response.notification.request.content.data?.doseId;
      if (doseId) {
        const dose = DOSES.find(d => d.id === doseId);
        if (dose) {
          handleDosePress(dose);
        }
      }
    });

    return () => subscription.remove();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please enable notifications for reminders.');
    }
  };

  const scheduleNotifications = async () => {
    // Cancel existing
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule 3 times a day
    const times = [
      { hour: 8, minute: 0 },
      { hour: 14, minute: 0 },
      { hour: 20, minute: 0 },
    ];

    for (let i = 0; i < times.length; i++) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'HIV Medication Reminder',
          body: `Time for your ${DOSES[i].label.toLowerCase()}. Did you take it?`,
          data: { doseId: DOSES[i].id },
        },
        trigger: {
          hour: times[i].hour,
          minute: times[i].minute,
          repeats: true,
        },
      });
    }
  };

  const handleDosePress = (dose) => {
    Alert.alert(
      `Did you take your ${dose.label}?`,
      '',
      [
        { text: 'NO, I MISSED IT', onPress: () => saveResponse(dose.id, false) },
        { text: 'YES, I TOOK IT', onPress: () => saveResponse(dose.id, true) },
      ]
    );
  };

  const saveResponse = async (doseId, taken) => {
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();

    // Save to adherence/
    const adherenceRef = ref(database, `adherence/${patientId}/${date}/${doseId}`);
    await set(adherenceRef, { taken, timestamp });

    // Save to adherence_logs/
    const logsRef = ref(database, `adherence_logs/${patientId}`);
    await push(logsRef, {
      date,
      doseId,
      taken,
      timestamp,
    });

    Alert.alert('Response Saved', `Your ${doseId} dose response has been saved.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.title}>HIV Adherence Tracker</Text>
        <Text style={styles.subtitle}>Tap a dose to record if you took it</Text>
      </View>

      <View style={styles.doseContainer}>
        {DOSES.map((dose) => (
          <TouchableOpacity
            key={dose.id}
            style={styles.doseCard}
            onPress={() => handleDosePress(dose)}
          >
            <Text style={styles.doseLabel}>{dose.label}</Text>
            <Text style={styles.doseTime}>{dose.time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('AdherenceDashboard')}
        >
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('AdherenceHistory')}
        >
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 5,
  },
  doseContainer: {
    flex: 1,
    padding: 20,
  },
  doseCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doseLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  doseTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  navButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  navText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});