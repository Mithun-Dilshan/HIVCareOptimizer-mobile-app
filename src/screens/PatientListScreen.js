// import React, { useState } from 'react';
// import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
// import { COLORS } from '../constants/colors';
// import { usePatients } from '../context/PatientsContext';

// const PatientListScreen = ({ navigation }) => {
//   const { patients } = usePatients();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterRisk, setFilterRisk] = useState('All');

//   const filteredPatients = patients.filter(p => {
//     const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter = filterRisk === 'All' || 
//       (filterRisk === 'High' && p.riskScore >= 0.7) ||
//       (filterRisk === 'Low' && p.riskScore < 0.7);
//     return matchesSearch && matchesFilter;
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.headerBar}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerBarTitle}>Patient List</Text>
//         <View style={{ width: 50 }} />
//       </View>

//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="🔍 Search patients..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       <View style={styles.filterContainer}>
//         {['All', 'High', 'Low'].map(filter => (
//           <TouchableOpacity
//             key={filter}
//             style={[
//               styles.filterButton,
//               filterRisk === filter && styles.filterButtonActive
//             ]}
//             onPress={() => setFilterRisk(filter)}
//           >
//             <Text style={[
//               styles.filterButtonText,
//               filterRisk === filter && styles.filterButtonTextActive
//             ]}>
//               {filter} {filter !== 'All' && 'Risk'}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <ScrollView style={styles.listContainer}>
//         {filteredPatients.map((patient, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.patientListCard}
//             onPress={() => navigation.navigate('Results', { patient })}
//           >
//             <View style={styles.patientListLeft}>
//               <Text style={styles.patientListIcon}>
//                 {patient.riskScore >= 0.7 ? '🔴' : '🟢'}
//               </Text>
//               <View>
//                 <Text style={styles.patientListId}>{patient.id}</Text>
//                 <Text style={styles.patientListInfo}>
//                   {patient.sex}, {patient.age}yo
//                 </Text>
//                 <Text style={styles.patientListRisk}>
//                   Risk: {(patient.riskScore * 100).toFixed(0)}% | {patient.timeAgo}
//                 </Text>
//               </View>
//             </View>
//             <Text style={styles.patientListArrow}>→</Text>
//           </TouchableOpacity>
//         ))}
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
//   searchContainer: {
//     padding: 15,
//     backgroundColor: COLORS.white,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   searchInput: {
//     backgroundColor: COLORS.background,
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: COLORS.text,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     padding: 15,
//     gap: 10,
//     backgroundColor: COLORS.white,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   filterButton: {
//     flex: 1,
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: COLORS.background,
//     alignItems: 'center',
//   },
//   filterButtonActive: {
//     backgroundColor: COLORS.primary,
//   },
//   filterButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.text,
//   },
//   filterButtonTextActive: {
//     color: COLORS.white,
//   },
//   listContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   patientListCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   patientListLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   patientListIcon: {
//     fontSize: 24,
//     marginRight: 15,
//   },
//   patientListId: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.text,
//     marginBottom: 5,
//   },
//   patientListInfo: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginBottom: 3,
//   },
//   patientListRisk: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//   },
//   patientListArrow: {
//     fontSize: 20,
//     color: COLORS.textSecondary,
//   },
// });

// export default PatientListScreen;


import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';
import { usePatients } from '../context/PatientsContext';

const PatientListScreen = ({ navigation }) => {
  const { patients } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRisk === 'All' || 
      (filterRisk === 'High' && p.riskScore >= 0.7) ||
      (filterRisk === 'Low' && p.riskScore < 0.7);
    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (riskScore) => {
    if (riskScore >= 0.7) return COLORS.danger;
    if (riskScore >= 0.4) return COLORS.warning;
    return COLORS.success;
  };

  const getRiskIcon = (riskScore) => {
    if (riskScore >= 0.7) return 'alert-circle';
    if (riskScore >= 0.4) return 'alert';
    return 'check-circle';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Patient List</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NewAnalysis')}>
          <Icon name="plus-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="magnify" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Icon name="filter-variant" size={20} color={COLORS.text} style={styles.filterIcon} />
        {['All', 'High', 'Low'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              filterRisk === filter && styles.filterButtonActive
            ]}
            onPress={() => setFilterRisk(filter)}
          >
            <Text style={[
              styles.filterButtonText,
              filterRisk === filter && styles.filterButtonTextActive
            ]}>
              {filter} {filter !== 'All' && 'Risk'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.resultsHeader}>
        <Icon name="format-list-bulleted" size={18} color={COLORS.textSecondary} />
        <Text style={styles.resultsText}>
          {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'} found
        </Text>
      </View>

      <ScrollView style={styles.listContainer}>
        {filteredPatients.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="account-search" size={64} color={COLORS.border} />
            <Text style={styles.emptyStateTitle}>No patients found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Try adjusting your search or filters' : 'Start by adding a new patient'}
            </Text>
          </View>
        ) : (
          filteredPatients.map((patient, index) => (
            <TouchableOpacity
              key={index}
              style={styles.patientListCard}
              onPress={() => navigation.navigate('Results', { patient })}
            >
              <View style={styles.patientListLeft}>
                <View style={[
                  styles.riskIndicator, 
                  { backgroundColor: getRiskColor(patient.riskScore) }
                ]}>
                  <Icon 
                    name={getRiskIcon(patient.riskScore)} 
                    size={24} 
                    color={COLORS.white} 
                  />
                </View>
                <View style={styles.patientInfo}>
                  <View style={styles.patientIdRow}>
                    <Icon name="account" size={16} color={COLORS.text} />
                    <Text style={styles.patientListId}>{patient.id}</Text>
                  </View>
                  <View style={styles.patientDetailsRow}>
                    <Icon name="gender-male-female" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.patientListInfo}>
                      {patient.sex}, {patient.age}yo
                    </Text>
                  </View>
                  <View style={styles.patientRiskRow}>
                    <Icon name="chart-line" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.patientListRisk}>
                      Risk: {(patient.riskScore * 100).toFixed(0)}%
                    </Text>
                    <Icon name="clock-outline" size={14} color={COLORS.textSecondary} style={styles.timeIcon} />
                    <Text style={styles.patientListRisk}>{patient.timeAgo}</Text>
                  </View>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
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
  searchContainer: {
    padding: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchIcon: {
    marginRight: 0,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterIcon: {
    marginRight: 5,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 10,
    gap: 8,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  patientListCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  riskIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
  },
  patientIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  patientListId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  patientDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  patientListInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  patientRiskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patientListRisk: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  timeIcon: {
    marginLeft: 8,
  },
});

export default PatientListScreen;