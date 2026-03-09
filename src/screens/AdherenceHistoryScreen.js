import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { database } from '../firebase/firebaseConfig';
import { ref, get } from 'firebase/database';

export default function AdherenceHistoryScreen({ navigation }) {
  const [logs, setLogs] = useState([]);
  const patientId = 'P_001'; // Hardcoded

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const logsRef = ref(database, `adherence_logs/${patientId}`);
    const snap = await get(logsRef);
    if (snap.exists()) {
      const data = snap.val();
      const logsArray = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
      setLogs(logsArray);
    }
  };

  const renderLog = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.dose}>{item.doseId}</Text>
      <Text style={[styles.status, item.taken ? styles.taken : styles.missed]}>
        {item.taken ? 'Taken' : 'Missed'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.title}>Adherence History</Text>
      </View>

      <FlatList
        data={logs}
        renderItem={renderLog}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No adherence logs yet.</Text>
        }
      />

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('AdherenceHome')}
        >
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('AdherenceDashboard')}
        >
          <Text style={styles.navText}>Dashboard</Text>
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
  list: {
    padding: 20,
  },
  logItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  dose: {
    fontSize: 16,
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taken: {
    color: COLORS.success,
  },
  missed: {
    color: COLORS.danger,
  },
  empty: {
    textAlign: 'center',
    fontSize: 18,
    color: COLORS.textSecondary,
    marginTop: 50,
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