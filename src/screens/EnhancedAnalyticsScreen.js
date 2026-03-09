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
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import {
  getPatientPredictionHistory,
  getAdherenceHistory,
  getAllPredictions,
} from '../services/apiService';
import {
  BarChart,
  LineChart,
  StatsCard,
  CircularProgress,
} from '../components/Charts';

export default function EnhancedAnalyticsScreen({ navigation, route }) {
  const patientId = route?.params?.patientId || 'P_001';
  const isGlobalView = route?.params?.isGlobalView || false;

  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resistanceHistory, setResistanceHistory] = useState([]);
  const [adherenceHistory, setAdherenceHistory] = useState(null);
  const [selectedTab, setSelectedTab] = useState('resistance'); // 'resistance' or 'adherence'
  const [dateRange, setDateRange] = useState('30'); // days

  // Load data
  useEffect(() => {
    loadAnalyticsData();
  }, [patientId, selectedTab, dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      if (selectedTab === 'resistance') {
        if (isGlobalView) {
          const allPredictions = await getAllPredictions(100);
          setResistanceHistory(allPredictions.predictions || []);
        } else {
          const history = await getPatientPredictionHistory(
            patientId,
            parseInt(dateRange)
          );
          setResistanceHistory(history.predictions || []);
        }
      } else if (selectedTab === 'adherence') {
        const history = await getAdherenceHistory(patientId, parseInt(dateRange));
        setAdherenceHistory(history);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      Alert.alert('Error', 'Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalyticsData();
  };

  /**
   * Process resistance data for charts
   */
  const getResistanceChartData = () => {
    if (!resistanceHistory || resistanceHistory.length === 0) return [];

    return resistanceHistory
      .slice(-parseInt(dateRange))
      .map((item, index) => ({
        date: new Date(item.testDate || item.computed_at).toLocaleDateString(
          'en-US',
          {
            month: 'short',
            day: 'numeric',
          }
        ),
        value:
          item.predicted_resistance_level === 'S'
            ? 25
            : item.predicted_resistance_level === 'I'
            ? 50
            : item.predicted_resistance_level === 'P'
            ? 75
            : 100,
        label: (index + 1).toString(),
        level: item.predicted_resistance_level,
        riskScore: (item.probability_susceptible * 100).toFixed(0),
      }));
  };

  /**
   * Process adherence data for charts
   */
  const getAdherenceChartData = () => {
    if (!adherenceHistory?.logs) return [];

    const groupByDay = {};
    adherenceHistory.logs.forEach((log) => {
      const day = log.date;
      if (!groupByDay[day]) {
        groupByDay[day] = { taken: 0, total: 0 };
      }
      groupByDay[day].total += 1;
      if (log.taken) groupByDay[day].taken += 1;
    });

    return Object.entries(groupByDay)
      .map(([day, data]) => ({
        date: new Date(day).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        value: (data.taken / data.total) * 100,
        label: new Date(day).getDate().toString(),
        taken: data.taken,
        total: data.total,
      }))
      .slice(-parseInt(dateRange));
  };

  /**
   * Get resistance statistics
   */
  const getResistanceStats = () => {
    if (resistanceHistory.length === 0) return null;

    const highRisk = resistanceHistory.filter(
      (r) =>
        r.predicted_resistance_level === 'H' ||
        r.predicted_resistance_level === 'P'
    ).length;

    const avgProb = (
      resistanceHistory.reduce((sum, r) => sum + (r.probability_susceptible || 0), 0) /
      resistanceHistory.length * 100
    ).toFixed(1);

    const totalMutations = resistanceHistory.reduce(
      (sum, r) => sum + (r.total_mutations || 0), 0
    );

    return {
      totalRecords: resistanceHistory.length,
      highRiskCount: highRisk,
      avgSusceptibility: avgProb,
      totalMutations: totalMutations,
    };
  };

  /**
   * Get adherence statistics
   */
  const getAdherenceStats = () => {
    if (!adherenceHistory?.summary) return null;

    const { taken, missed, adherence_pct } = adherenceHistory.summary;
    const totalDays = Math.ceil((taken + missed) / 3);

    return {
      adherenceRate: adherence_pct,
      dosesTaken: taken,
      dosesMissed: missed,
      totalDays: totalDays,
    };
  };

  const resistanceChartData = getResistanceChartData();
  const adherenceChartData = getAdherenceChartData();
  const resistanceStats = getResistanceStats();
  const adherenceStats = getAdherenceStats();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading analytics...</Text>
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
            <Text style={styles.headerTitle}>
              {isGlobalView ? 'Overall Analytics' : 'Patient Analytics'}
            </Text>
            <TouchableOpacity onPress={onRefresh}>
              <Icon name="refresh" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          {!isGlobalView && <Text style={styles.patientId}>Patient: {patientId}</Text>}
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'resistance' && styles.tabActive,
            ]}
            onPress={() => setSelectedTab('resistance')}
          >
            <Icon
              name="shield-checkmark"
              size={18}
              color={selectedTab === 'resistance' ? COLORS.primary : '#999'}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'resistance' && styles.tabTextActive,
              ]}
            >
              Resistance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'adherence' && styles.tabActive,
            ]}
            onPress={() => setSelectedTab('adherence')}
          >
            <Icon
              name="checkmark-circle"
              size={18}
              color={selectedTab === 'adherence' ? COLORS.primary : '#999'}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'adherence' && styles.tabTextActive,
              ]}
            >
              Adherence
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Range Selector */}
        <View style={styles.dateRangeSelector}>
          <Text style={styles.sectionLabel}>View Period:</Text>
          <View style={styles.dateRangeButtons}>
            {['7', '14', '30', '90'].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.dateRangeButton,
                  dateRange === days && styles.dateRangeButtonActive,
                ]}
                onPress={() => setDateRange(days)}
              >
                <Text
                  style={[
                    styles.dateRangeButtonText,
                    dateRange === days && styles.dateRangeButtonTextActive,
                  ]}
                >
                  {days}d
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resistance Analytics */}
        {selectedTab === 'resistance' && (
          <View style={styles.analysisContainer}>
            {/* Stats */}
            {resistanceStats && (
              <View style={styles.statsGrid}>
                <View style={styles.statsGridItem}>
                  <View style={styles.statsGridNumber}>
                    <Text style={styles.statsGridNumberText}>
                      {resistanceStats.totalRecords}
                    </Text>
                  </View>
                  <Text style={styles.statsGridLabel}>Tests</Text>
                </View>

                <View style={styles.statsGridItem}>
                  <View
                    style={[
                      styles.statsGridNumber,
                      { backgroundColor: '#ff6b6b' },
                    ]}
                  >
                    <Text style={styles.statsGridNumberText}>
                      {resistanceStats.highRiskCount}
                    </Text>
                  </View>
                  <Text style={styles.statsGridLabel}>High Risk</Text>
                </View>

                <View style={styles.statsGridItem}>
                  <View
                    style={[
                      styles.statsGridNumber,
                      { backgroundColor: '#51cf66' },
                    ]}
                  >
                    <Text style={styles.statsGridNumberText}>
                      {resistanceStats.avgSusceptibility}%
                    </Text>
                  </View>
                  <Text style={styles.statsGridLabel}>Avg Susceptibility</Text>
                </View>

                <View style={styles.statsGridItem}>
                  <View
                    style={[
                      styles.statsGridNumber,
                      { backgroundColor: '#ffa500' },
                    ]}
                  >
                    <Text style={styles.statsGridNumberText}>
                      {resistanceStats.totalMutations}
                    </Text>
                  </View>
                  <Text style={styles.statsGridLabel}>Mutations</Text>
                </View>
              </View>
            )}

            {/* Resistance Chart */}
            {resistanceChartData.length > 0 ? (
              <View style={styles.chartWrapper}>
                <Text style={styles.chartTitle}>Resistance Levels Over Time</Text>
                <BarChart
                  data={resistanceChartData.map((item) => ({
                    ...item,
                    color:
                      item.level === 'S'
                        ? '#51cf66'
                        : item.level === 'I'
                        ? '#ffa500'
                        : '#ff6b6b',
                  }))}
                  height={200}
                />
              </View>
            ) : (
              <Text style={styles.noDataText}>
                No resistance data available
              </Text>
            )}

            {/* Resistance History */}
            {resistanceHistory.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.chartTitle}>Recent Test Results</Text>
                {resistanceHistory.slice(-5).map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <Text style={styles.historyDate}>
                        {new Date(
                          item.testDate || item.computed_at
                        ).toLocaleDateString()}
                      </Text>
                      <Text style={styles.historySubtext}>
                        Mutations: {item.total_mutations || 0}
                      </Text>
                    </View>
                    <View style={styles.historyItemRight}>
                      <View
                        style={[
                          styles.resultBadge,
                          {
                            backgroundColor:
                              item.predicted_resistance_level === 'S'
                                ? '#51cf66'
                                : item.predicted_resistance_level === 'I'
                                ? '#ffa500'
                                : '#ff6b6b',
                          },
                        ]}
                      >
                        <Text style={styles.resultBadgeText}>
                          {item.predicted_resistance_level}
                        </Text>
                      </View>
                      <Text style={styles.resultSubtext}>
                        {(item.probability_susceptible * 100).toFixed(0)}% S
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Adherence Analytics */}
        {selectedTab === 'adherence' && (
          <View style={styles.analysisContainer}>
            {/* Stats */}
            {adherenceStats && (
              <View style={styles.statsGrid}>
                <View style={styles.statsGridItem}>
                  <View style={styles.statsGridNumber}>
                    <Text style={styles.statsGridNumberText}>
                      {adherenceStats.adherenceRate}%
                    </Text>
                  </View>
                  <Text style={styles.statsGridLabel}>Adherence</Text>
                </View>

                <View style={styles.statsGridItem}>
                  <View
                    style={[
                      styles.statsGridNumber,
                      { backgroundColor: '#51cf66' },
                    ]}
                  >
                    <Text style={styles.statsGridNumberText}>
                      {adherenceStats.dosesTaken}
                    </Text>
                  </View>
                  <Text style={styles.statsGridLabel}>Taken</Text>
                </View>

                <View style={styles.statsGridItem}>
                  <View
                    style={[
                      styles.statsGridNumber,
                      { backgroundColor: '#ff6b6b' },
                    ]}
                  >
                    <Text style={styles.statsGridNumberText}>
                      {adherenceStats.dosesMissed}
                    </Text>
                  </View>
                  <Text style={styles.statsGridLabel}>Missed</Text>
                </View>

                <View style={styles.statsGridItem}>
                  <View
                    style={[
                      styles.statsGridNumber,
                      { backgroundColor: '#4dabf7' },
                    ]}
                  >
                    <Text style={styles.statsGridNumberText}>
                      {adherenceStats.totalDays}d
                    </Text>
                  </View>
                  <Text style={styles.statsGridLabel}>Period</Text>
                </View>
              </View>
            )}

            {/* Adherence Chart */}
            {adherenceChartData.length > 0 ? (
              <View style={styles.chartWrapper}>
                <Text style={styles.chartTitle}>Daily Adherence Rate</Text>
                <BarChart
                  data={adherenceChartData.map((item) => ({
                    ...item,
                    color: item.value >= 90 ? '#51cf66' : 
                           item.value >= 75 ? '#ffa500' : '#ff6b6b',
                  }))}
                  height={200}
                />
              </View>
            ) : (
              <Text style={styles.noDataText}>
                No adherence data available
              </Text>
            )}

            {/* Trends Analysis */}
            {adherenceChartData.length > 1 && (
              <View style={styles.trendsSection}>
                <Text style={styles.chartTitle}>Trends Analysis</Text>
                <View style={styles.trendCard}>
                  <Icon name="trending-up" size={24} color={COLORS.primary} />
                  <View style={styles.trendText}>
                    <Text style={styles.trendLabel}>Current Trend</Text>
                    <Text style={styles.trendValue}>
                      {adherenceChartData[adherenceChartData.length - 1].value >=
                      adherenceChartData[0].value
                        ? '📈 Improving'
                        : '📉 Declining'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() => navigation.navigate('AdherenceHistory')}
          >
            <Icon name="calendar" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>View Full History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={onRefresh}
          >
            <Icon name="refresh" size={18} color={COLORS.primary} />
            <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>
              Refresh Data
            </Text>
          </TouchableOpacity>
        </View>

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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  dateRangeSelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  dateRangeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  dateRangeButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateRangeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateRangeButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  dateRangeButtonTextActive: {
    color: '#fff',
  },
  analysisContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statsGridItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  statsGridNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsGridNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsGridLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  chartWrapper: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
    fontSize: 12,
  },
  historySection: {
    marginTop: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  historyItemLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  historySubtext: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  resultBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 4,
  },
  resultBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  resultSubtext: {
    fontSize: 10,
    color: '#666',
  },
  trendsSection: {
    marginTop: 20,
  },
  trendCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  trendText: {
    flex: 1,
  },
  trendLabel: {
    fontSize: 12,
    color: '#666',
  },
  trendValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  actionSection: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  actionButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});
