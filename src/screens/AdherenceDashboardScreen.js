import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { database } from '../firebase/firebaseConfig';
import { ref, get } from 'firebase/database';

export default function AdherenceDashboardScreen({ navigation }) {
  const [prediction, setPrediction] = useState(null);
  const patientId = 'P_001'; // Hardcoded for now

  useEffect(() => {
    loadPrediction();
  }, []);

  const loadPrediction = async () => {
    const predRef = ref(database, `predictions/${patientId}`);
    const snap = await get(predRef);
    if (snap.exists()) {
      setPrediction(snap.val());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.title}>Adherence Dashboard</Text>
      </View>

      {prediction ? (
        <View style={styles.predictionContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>ML Risk Assessment</Text>
            <Text style={styles.riskLevel}>Risk Level: {prediction.risk_label}</Text>
            <Text style={styles.riskScore}>
              Risk Score: {(prediction.risk_score * 100).toFixed(0)}%
            </Text>
            <Text style={styles.adherence}>
              Adherence Rate: {(prediction.adherence_rate * 100).toFixed(0)}%
            </Text>
            <Text style={styles.adherence7d}>
              7-Day Adherence: {(prediction.adherence_7d * 100).toFixed(0)}%
            </Text>
            <Text style={styles.streak}>
              Missed Streak: {prediction.missed_streak} days
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.noData}>
          <Text style={styles.noDataText}>No prediction data available.</Text>
          <Text style={styles.noDataSubtext}>
            Run the ML model in Google Colab to generate predictions.
          </Text>
        </View>
      )}

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('AdherenceHome')}
        >
          <Text style={styles.navText}>Home</Text>
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
  predictionContainer: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  riskLevel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginBottom: 10,
  },
  riskScore: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  adherence: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  adherence7d: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  streak: {
    fontSize: 16,
    color: COLORS.text,
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
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