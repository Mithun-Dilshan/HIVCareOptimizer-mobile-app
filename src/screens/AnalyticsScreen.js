// import React from 'react';
// import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// import { COLORS } from '../constants/colors';
// import { usePatients } from '../context/PatientsContext';

// const AnalyticsScreen = ({ navigation }) => {
//   const { patients } = usePatients();
//   const highRiskCount = patients.filter(p => p.riskScore >= 0.7).length;
//   const lowRiskCount = patients.filter(p => p.riskScore < 0.7).length;
//   const totalPatients = patients.length;
//   const highRiskPercent = ((highRiskCount / totalPatients) * 100).toFixed(1);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.headerBar}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerBarTitle}>Analytics</Text>
//         <View style={{ width: 50 }} />
//       </View>

//       <ScrollView style={styles.analyticsContainer}>
//         <Text style={styles.analyticsTitle}>📈 SYSTEM STATISTICS</Text>

//         <Text style={styles.analyticsSubtitle}>Date Range: Last 30 Days</Text>

//         <View style={styles.analyticsCard}>
//           <Text style={styles.analyticsCardTitle}>Risk Distribution</Text>
//           <View style={styles.distributionBar}>
//             <View style={[styles.distributionSegment, { 
//               width: `${highRiskPercent}%`, 
//               backgroundColor: COLORS.danger 
//             }]} />
//             <View style={[styles.distributionSegment, { 
//               width: `${100 - highRiskPercent}%`, 
//               backgroundColor: COLORS.success 
//             }]} />
//           </View>
//           <Text style={styles.distributionText}>
//             {highRiskPercent}% High Risk ({highRiskCount}) | {(100 - highRiskPercent).toFixed(1)}% Low Risk ({lowRiskCount})
//           </Text>
//         </View>

//         <View style={styles.analyticsCard}>
//           <Text style={styles.analyticsCardTitle}>Prediction Accuracy</Text>
//           <Text style={styles.accuracyBig}>87.5%</Text>
//           <Text style={styles.accuracySmall}>(AUC-ROC: 0.89)</Text>
//         </View>

//         <View style={styles.analyticsCard}>
//           <Text style={styles.analyticsCardTitle}>Most Common Resistance</Text>
//           <Text style={styles.resistanceItem}>1. NRTI class: 45%</Text>
//           <Text style={styles.resistanceItem}>2. PI class: 32%</Text>
//           <Text style={styles.resistanceItem}>3. NNRTI class: 23%</Text>
//         </View>

//         <TouchableOpacity style={styles.exportButton}>
//           <Text style={styles.buttonText}>📥 Export Analytics Report</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   headerBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   backButton: {
//     color: COLORS.primary,
//     fontSize: 16,
//   },
//   headerBarTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.text,
//   },
//   analyticsContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   analyticsTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: COLORS.text,
//     marginBottom: 10,
//   },
//   analyticsSubtitle: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginBottom: 20,
//   },
//   analyticsCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   analyticsCardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.text,
//     marginBottom: 15,
//   },
//   distributionBar: {
//     flexDirection: 'row',
//     height: 30,
//     borderRadius: 15,
//     overflow: 'hidden',
//     marginBottom: 10,
//   },
//   distributionSegment: {
//     height: '100%',
//   },
//   distributionText: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//   },
//   accuracyBig: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   accuracySmall: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//   },
//   resistanceItem: {
//     fontSize: 16,
//     color: COLORS.text,
//     marginBottom: 10,
//   },
//   exportButton: {
//     backgroundColor: COLORS.primary,
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default AnalyticsScreen;



import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';
import { usePatients } from '../context/PatientsContext';

const AnalyticsScreen = ({ navigation }) => {
  const { patients } = usePatients();
  const highRiskCount = patients.filter(p => p.riskScore >= 0.7).length;
  const lowRiskCount = patients.filter(p => p.riskScore < 0.7).length;
  const totalPatients = patients.length;
  const highRiskPercent = totalPatients > 0 ? ((highRiskCount / totalPatients) * 100).toFixed(1) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Analytics</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.analyticsContainer}>
        <View style={styles.titleRow}>
          <Icon name="chart-line" size={28} color={COLORS.primary} />
          <Text style={styles.analyticsTitle}>SYSTEM STATISTICS</Text>
        </View>

        <View style={styles.dateRangeContainer}>
          <Icon name="calendar-range" size={16} color={COLORS.textSecondary} />
          <Text style={styles.analyticsSubtitle}>Date Range: Last 30 Days</Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon name="account-multiple" size={32} color={COLORS.primary} />
            <Text style={styles.statNumber}>{totalPatients}</Text>
            <Text style={styles.statLabel}>Total Patients</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="alert-circle" size={32} color={COLORS.danger} />
            <Text style={styles.statNumber}>{highRiskCount}</Text>
            <Text style={styles.statLabel}>High Risk</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="check-circle" size={32} color={COLORS.success} />
            <Text style={styles.statNumber}>{lowRiskCount}</Text>
            <Text style={styles.statLabel}>Low Risk</Text>
          </View>
        </View>

        <View style={styles.analyticsCard}>
          <View style={styles.cardHeader}>
            <Icon name="chart-pie" size={22} color={COLORS.primary} />
            <Text style={styles.analyticsCardTitle}>Risk Distribution</Text>
          </View>
          <View style={styles.distributionBar}>
            <View style={[styles.distributionSegment, { 
              width: `${highRiskPercent}%`, 
              backgroundColor: COLORS.danger 
            }]} />
            <View style={[styles.distributionSegment, { 
              width: `${100 - highRiskPercent}%`, 
              backgroundColor: COLORS.success 
            }]} />
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.danger }]} />
              <Text style={styles.distributionText}>
                High Risk: {highRiskPercent}% ({highRiskCount})
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.distributionText}>
                Low Risk: {(100 - highRiskPercent).toFixed(1)}% ({lowRiskCount})
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.analyticsCard}>
          <View style={styles.cardHeader}>
            <Icon name="target" size={22} color={COLORS.primary} />
            <Text style={styles.analyticsCardTitle}>Prediction Accuracy</Text>
          </View>
          <View style={styles.accuracyContainer}>
            <Icon name="chart-arc" size={60} color={COLORS.success} />
            <Text style={styles.accuracyBig}>87.5%</Text>
          </View>
          <Text style={styles.accuracySmall}>AUC-ROC: 0.89</Text>
          <View style={styles.accuracyMetrics}>
            <View style={styles.metricItem}>
              <Icon name="check" size={16} color={COLORS.success} />
              <Text style={styles.metricText}>Sensitivity: 85%</Text>
            </View>
            <View style={styles.metricItem}>
              <Icon name="check-all" size={16} color={COLORS.success} />
              <Text style={styles.metricText}>Specificity: 90%</Text>
            </View>
          </View>
        </View>

        <View style={styles.analyticsCard}>
          <View style={styles.cardHeader}>
            <Icon name="pill" size={22} color={COLORS.primary} />
            <Text style={styles.analyticsCardTitle}>Most Common Resistance</Text>
          </View>
          <View style={styles.resistanceList}>
            <View style={styles.resistanceItem}>
              <View style={styles.resistanceRank}>
                <Text style={styles.rankNumber}>1</Text>
              </View>
              <View style={styles.resistanceInfo}>
                <Text style={styles.resistanceName}>NRTI class</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '45%', backgroundColor: COLORS.danger }]} />
                </View>
              </View>
              <Text style={styles.resistancePercent}>45%</Text>
            </View>
            
            <View style={styles.resistanceItem}>
              <View style={styles.resistanceRank}>
                <Text style={styles.rankNumber}>2</Text>
              </View>
              <View style={styles.resistanceInfo}>
                <Text style={styles.resistanceName}>PI class</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '32%', backgroundColor: COLORS.warning }]} />
                </View>
              </View>
              <Text style={styles.resistancePercent}>32%</Text>
            </View>
            
            <View style={styles.resistanceItem}>
              <View style={styles.resistanceRank}>
                <Text style={styles.rankNumber}>3</Text>
              </View>
              <View style={styles.resistanceInfo}>
                <Text style={styles.resistanceName}>NNRTI class</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '23%', backgroundColor: COLORS.info }]} />
                </View>
              </View>
              <Text style={styles.resistancePercent}>23%</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.exportButton}>
          <Icon name="download" size={20} color={COLORS.white} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Export Analytics Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  analyticsContainer: {
    flex: 1,
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  analyticsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  analyticsSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  analyticsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  analyticsCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  distributionBar: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  distributionSegment: {
    height: '100%',
  },
  legendContainer: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  distributionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 10,
  },
  accuracyBig: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  accuracySmall: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  accuracyMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 14,
    color: COLORS.text,
  },
  resistanceList: {
    gap: 15,
  },
  resistanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resistanceRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  resistanceInfo: {
    flex: 1,
  },
  resistanceName: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  resistancePercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 45,
    textAlign: 'right',
  },
  exportButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 0,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AnalyticsScreen;