import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { getCurrentUser, getUserProfile, getPatientAnalyses } from '../firebase/firebaseService';

const DashboardScreen = ({ navigation }) => {
  const [doctorName, setDoctorName] = useState('Doctor');
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctorProfile();
    loadAnalyses();
  }, []);

  const loadDoctorProfile = async () => {
    const user = getCurrentUser();
    if (user) {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setDoctorName(profile.fullName);
      }
    }
  };

  const loadAnalyses = async () => {
    setLoading(true);
    const data = await getPatientAnalyses();
    setAnalyses(data);
    setLoading(false);
  };

  const highRiskCount = analyses.filter(a => a.results?.riskScore >= 0.7).length;
  const lowRiskCount = analyses.filter(a => a.results?.riskScore < 0.7).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Welcome,</Text>
            <Text style={styles.headerName}>{doctorName}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBadge}>
            <Icon name="notifications-outline" size={28} color={COLORS.white} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{highRiskCount}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{analyses.length}</Text>
            <Text style={styles.statsLabel}>Total Patients</Text>
          </View>
          <View style={[styles.statsCard, styles.statsCardDanger]}>
            <Text style={styles.statsNumber}>{highRiskCount}</Text>
            <Text style={styles.statsLabel}>High Risk</Text>
          </View>
          <View style={[styles.statsCard, styles.statsCardSuccess]}>
            <Text style={styles.statsNumber}>{lowRiskCount}</Text>
            <Text style={styles.statsLabel}>Low Risk</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('PatientInput')}
          >
            <Icon name="document-text-outline" size={40} color={COLORS.primary} />
            <Text style={styles.actionText}>New Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('PatientList')}
          >
            <Icon name="people-outline" size={40} color={COLORS.primary} />
            <Text style={styles.actionText}>Patient List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Icon name="bar-chart-outline" size={40} color={COLORS.primary} />
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="settings-outline" size={40} color={COLORS.primary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Analyses */}
        <Text style={styles.sectionTitle}>Recent Analyses</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : analyses.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="clipboard-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateText}>No analyses yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start by analyzing your first patient
            </Text>
          </View>
        ) : (
          analyses.slice(0, 5).map((analysis, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentCard}
              onPress={() =>
                navigation.navigate('Results', {
                  patient: {
                    ...analysis.patientData,
                    ...analysis.results,
                  },
                })
              }
            >
              <View style={styles.recentCardLeft}>
                <Text style={styles.recentCardId}>
                  {analysis.patientData?.patientId || 'Unknown'}
                </Text>
                <View style={styles.riskContainer}>
                  <Icon 
                    name={analysis.results?.riskScore >= 0.7 ? "alert-circle" : "checkmark-circle"} 
                    size={16} 
                    color={analysis.results?.riskScore >= 0.7 ? COLORS.danger : COLORS.success} 
                  />
                  <Text style={[
                    styles.recentCardRisk,
                    { color: analysis.results?.riskScore >= 0.7 ? COLORS.danger : COLORS.success }
                  ]}>
                    {analysis.results?.riskScore >= 0.7 ? 'High Risk' : 'Low Risk'}
                  </Text>
                </View>
              </View>
              <Text style={styles.recentCardTime}>
                {new Date(analysis.timestamp?.toDate()).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    color: COLORS.white,
    fontSize: 16,
    opacity: 0.9,
  },
  headerName: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statsCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
  },
  statsCardDanger: {
    backgroundColor: COLORS.lightRed,
  },
  statsCardSuccess: {
    backgroundColor: COLORS.lightGreen,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statsLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  actionCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 10,
  },
  recentCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  recentCardLeft: {
    flex: 1,
  },
  recentCardId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },
  recentCardRisk: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentCardTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default DashboardScreen;

