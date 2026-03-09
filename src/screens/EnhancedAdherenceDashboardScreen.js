import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import {
  getAdherenceHistory,
  predictAdherenceRiskFromLogs,
  formatDateForAPI,
} from '../services/apiService';
import {
  CircularProgress,
  StatusBadge,
  TimelineItem,
  StatsCard,
  AdherenceWeekView,
  BarChart,
  LineChart,
} from '../components/Charts';

export default function AdherenceDashboardScreen({ navigation, route }) {
  const patientId = route?.params?.patientId || 'P_001';

  // State Management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adherenceData, setAdherenceData] = useState(null);
  const [riskPrediction, setRiskPrediction] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(7); // days
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());

  // Load data on component mount
  useEffect(() => {
    loadAdherenceData();
  }, [selectedPeriod, patientId]);

  /**
   * Fetch adherence history and risk prediction from API
   */
  const loadAdherenceData = async () => {
    try {
      setLoading(true);

      // Fetch adherence history and risk prediction in parallel
      const [historyResponse, riskResponse] = await Promise.all([
        getAdherenceHistory(patientId, selectedPeriod),
        predictAdherenceRiskFromLogs(patientId),
      ]);

      setAdherenceData(historyResponse);
      setRiskPrediction(riskResponse);
    } catch (error) {
      console.error('Error loading adherence data:', error);
      Alert.alert(
        'Error',
        'Failed to load adherence data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Manually refresh data
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadAdherenceData();
  };

  /**
   * Handle period selection
   */
  const handlePeriodSelect = (days) => {
    setSelectedPeriod(days);
  };

  /**
   * Process adherence data for charts
   */
  const getChartData = () => {
    if (!adherenceData?.logs) return [];

    const lastNDays = adherenceData.logs.slice(-selectedPeriod);
    return lastNDays.map((log) => ({
      date: new Date(log.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: log.taken ? 100 : 0,
      label: new Date(log.date).getDate().toString(),
      taken: log.taken,
    }));
  };

  /**
   * Get adherence statistics
   */
  const getStats = () => {
    if (!adherenceData?.summary) return null;

    const { taken, missed, adherence_pct } = adherenceData.summary;
    return {
      taken,
      missed,
      adherencePct: adherence_pct,
      compliance: adherence_pct >= 90 ? 'Excellent' : 
                 adherence_pct >= 75 ? 'Good' : 
                 adherence_pct >= 50 ? 'Fair' : 'Poor',
    };
  };

  /**
   * Generate recommendations based on risk level
   */
  const getRecommendations = () => {
    if (!riskPrediction) return [];

    const urgency = riskPrediction.urgency || 'LOW';
    const riskLevel = riskPrediction.risk_level || 'LOW RISK';

    const recommendations = [];

    if (riskLevel === 'HIGH RISK') {
      recommendations.push({
        icon: '⚠️',
        text: 'URGENT: Patient requires immediate intervention',
        color: '#ff6b6b',
      });
      recommendations.push({
        icon: '📞',
        text: 'Contact patient within 48 hours',
        color: '#ff6b6b',
      });
      recommendations.push({
        icon: '💊',
        text: 'Review medication regimen and barriers to adherence',
        color: '#ff6b6b',
      });
    } else if (riskLevel === 'MODERATE RISK') {
      recommendations.push({
        icon: '👁️',
        text: 'Monitor closely with follow-up within 2 weeks',
        color: '#ffa500',
      });
      recommendations.push({
        icon: '📋',
        text: 'Schedule counseling session',
        color: '#ffa500',
      });
      recommendations.push({
        icon: '🔔',
        text: 'Increase reminder frequency',
        color: '#ffa500',
      });
    } else {
      recommendations.push({
        icon: '✅',
        text: 'Patient is adherent - continue current support',
        color: '#51cf66',
      });
      recommendations.push({
        icon: '📅',
        text: 'Routine 3-month follow-up scheduled',
        color: '#51cf66',
      });
      recommendations.push({
        icon: '👍',
        text: 'Maintain positive reinforcement',
        color: '#51cf66',
      });
    }

    return recommendations;
  };

  const stats = getStats();
  const chartData = getChartData();
  const recommendations = getRecommendations();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading adherence data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        style={styles.scrollView}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Adherence Dashboard</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Icon name="refresh" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.patientId}>Patient: {patientId}</Text>
        </View>

        {/* Risk Assessment Card */}
        {riskPrediction && (
          <View style={styles.riskCard}>
            <View style={styles.riskHeader}>
              <Text style={styles.riskTitle}>Risk Assessment</Text>
              <Text style={styles.modelUsed}>{riskPrediction.model_used}</Text>
            </View>

            <View style={styles.riskContent}>
              <View style={styles.riskMeterWrapper}>
                <CircularProgress
                  percentage={riskPrediction.prob_high_risk * 100}
                  size={140}
                  strokeWidth={6}
                  progressColor={
                    riskPrediction.risk_level === 'HIGH RISK'
                      ? '#ff6b6b'
                      : riskPrediction.risk_level === 'MODERATE RISK'
                      ? '#ffa500'
                      : '#51cf66'
                  }
                  label="Risk Level"
                />
              </View>

              <View style={styles.riskInfo}>
                <StatusBadge
                  status={riskPrediction.risk_level}
                  size="large"
                />
                <Text style={styles.urgencyLabel}>Urgency:</Text>
                <Text
                  style={[
                    styles.urgencyLevel,
                    {
                      color:
                        riskPrediction.urgency === 'HIGH'
                          ? '#ff6b6b'
                          : riskPrediction.urgency === 'MEDIUM'
                          ? '#ffa500'
                          : '#51cf66',
                    },
                  ]}
                >
                  {riskPrediction.urgency}
                </Text>

                <View style={styles.actionBox}>
                  <Icon
                    name={
                      riskPrediction.urgency === 'HIGH'
                        ? 'warning'
                        : riskPrediction.urgency === 'MEDIUM'
                        ? 'alert'
                        : 'checkmark-circle'
                    }
                    size={16}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.actionText}>
                    {riskPrediction.action}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Statistics Cards */}
        {stats && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Performance Summary</Text>
            <StatsCard
              icon="💊"
              label="Adherence Rate"
              value={stats.adherencePct}
              unit="%"
              description={`${stats.compliance} compliance`}
              color={
                stats.adherencePct >= 90
                  ? '#51cf66'
                  : stats.adherencePct >= 75
                  ? '#ffa500'
                  : '#ff6b6b'
              }
            />
            <View style={styles.statsRow}>
              <StatsCard
                icon="✅"
                label="Doses Taken"
                value={stats.taken}
                color="#51cf66"
              />
              <StatsCard
                icon="❌"
                label="Doses Missed"
                value={stats.missed}
                color="#ff6b6b"
              />
            </View>
          </View>
        )}

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <Text style={styles.sectionTitle}>Time Period</Text>
          <View style={styles.periodButtons}>
            {[
              { label: '7 Days', days: 7 },
              { label: '14 Days', days: 14 },
              { label: '30 Days', days: 30 },
            ].map((period) => (
              <TouchableOpacity
                key={period.days}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.days &&
                    styles.periodButtonActive,
                ]}
                onPress={() => handlePeriodSelect(period.days)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period.days &&
                      styles.periodButtonTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Adherence Week View */}
        <View style={styles.weekViewSection}>
          <Text style={styles.sectionTitle}>Weekly View</Text>
          <AdherenceWeekView
            data={chartData.slice(-7)}
          />
        </View>

        {/* Adherence Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Adherence Trend</Text>
          {chartData.length > 0 ? (
            <BarChart
              data={chartData.map((item) => ({
                ...item,
                color: item.taken ? '#51cf66' : '#ff6b6b',
                value: item.taken ? 100 : 0,
              }))}
              height={200}
            />
          ) : (
            <Text style={styles.noDataText}>No data available</Text>
          )}
        </View>

        {/* History Timeline */}
        <View style={styles.timelineSection}>
          <View style={styles.timelineSectionHeader}>
            <Text style={styles.sectionTitle}>Recent History</Text>
            <Text style={styles.timelineCount}>
              {adherenceData?.total_records || 0} records
            </Text>
          </View>

          {adherenceData?.logs && adherenceData.logs.length > 0 ? (
            <View style={styles.timelineContainer}>
              {adherenceData.logs
                .slice()
                .reverse()
                .slice(0, 10)
                .map((log, index) => (
                  <TimelineItem
                    key={index}
                    date={new Date(log.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                    status={`${log.dose_time} dose`}
                    isMissed={!log.taken}
                    details={log.taken ? 'Dose taken' : 'Dose missed'}
                  />
                ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>No history available</Text>
          )}
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Clinical Recommendations</Text>
          {recommendations.map((rec, index) => (
            <View
              key={index}
              style={[
                styles.recommendationItem,
                { borderLeftColor: rec.color },
              ]}
            >
              <Text style={styles.recommendationIcon}>{rec.icon}</Text>
              <Text style={styles.recommendationText}>{rec.text}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() =>
              navigation.navigate('PatientInput', { patientId })
            }
          >
            <Icon name="create" size={18} color="#fff" />
            <Text style={styles.buttonText}>Log Dose</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Icon name="analytics" size={18} color={COLORS.primary} />
            <Text style={[styles.buttonText, { color: COLORS.primary }]}>
              Full Analytics
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.primary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  patientId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  riskCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  modelUsed: {
    fontSize: 10,
    color: '#999',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  riskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskMeterWrapper: {
    marginRight: 20,
    marginTop: -10,
  },
  riskInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  urgencyLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 12,
  },
  urgencyLevel: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  actionBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 10,
    color: '#333',
    flex: 1,
  },
  statsSection: {
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  periodSelector: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  weekViewSection: {
    paddingHorizontal: 16,
  },
  chartSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
    fontSize: 12,
  },
  timelineSection: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  timelineSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineCount: {
    fontSize: 12,
    color: '#999',
  },
  timelineContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    borderLeftWidth: 4,
    alignItems: 'flex-start',
  },
  recommendationIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});
