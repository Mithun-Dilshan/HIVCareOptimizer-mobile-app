// import React, { useState } from 'react';
// import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
// import { COLORS } from '../constants/colors';

// const ClinicalDataScreen = ({ navigation, route }) => {
//   const { patientData } = route.params;
//   const [clinicalData, setClinicalData] = useState({
//     viralLoad: '',
//     cd4Count: '',
//     testDate: new Date().toISOString().split('T')[0],
//   });

//   const handleNext = () => {
//     if (!clinicalData.viralLoad) {
//       Alert.alert('Missing Information', 'Please enter viral load');
//       return;
//     }
//     if (!clinicalData.cd4Count) {
//       Alert.alert('Missing Information', 'Please enter CD4+ count');
//       return;
//     }
//     navigation.navigate('ResistanceData', { 
//       patientData: { ...patientData, ...clinicalData } 
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.headerBar}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerBarTitle}>New Analysis [2/3]</Text>
//         <View style={{ width: 50 }} />
//       </View>

//       <ScrollView style={styles.formContainer}>
//         <Text style={styles.formTitle}>🔬 CLINICAL PARAMETERS</Text>

//         <Text style={styles.label}>Baseline HIV Viral Load * (copies/mL plasma)</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="100000"
//           keyboardType="numeric"
//           value={clinicalData.viralLoad}
//           onChangeText={(text) => setClinicalData({ ...clinicalData, viralLoad: text })}
//         />

//         <Text style={styles.label}>Baseline CD4+ Count * (cells/μL)</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="120"
//           keyboardType="numeric"
//           value={clinicalData.cd4Count}
//           onChangeText={(text) => setClinicalData({ ...clinicalData, cd4Count: text })}
//         />

//         <Text style={styles.label}>Last Viral Load Test Date</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="2024-12-15"
//           value={clinicalData.testDate}
//           onChangeText={(text) => setClinicalData({ ...clinicalData, testDate: text })}
//         />

//         <View style={styles.tipBox}>
//           <Text style={styles.tipText}>
//             ℹ️ Tip: Accurate viral load and CD4+ count data improves prediction accuracy
//           </Text>
//         </View>

//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={styles.secondaryButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.secondaryButtonText}>← Previous</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
//             <Text style={styles.buttonText}>Next: Mutations →</Text>
//           </TouchableOpacity>
//         </View>
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
//   formContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   formTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: COLORS.text,
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.text,
//     marginTop: 15,
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: COLORS.text,
//   },
//   tipBox: {
//     backgroundColor: COLORS.lightBlue,
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   tipText: {
//     fontSize: 14,
//     color: COLORS.text,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 30,
//     marginBottom: 20,
//     gap: 15,
//   },
//   secondaryButton: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   secondaryButtonText: {
//     color: COLORS.text,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   primaryButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ClinicalDataScreen;

import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';

const ClinicalDataScreen = ({ navigation, route }) => {
  const { patientData } = route.params;
  const [clinicalData, setClinicalData] = useState({
    viralLoad: '',
    cd4Count: '',
    testDate: new Date().toISOString().split('T')[0],
  });

  const handleNext = () => {
    if (!clinicalData.viralLoad) {
      Alert.alert('Missing Information', 'Please enter viral load');
      return;
    }
    if (!clinicalData.cd4Count) {
      Alert.alert('Missing Information', 'Please enter CD4+ count');
      return;
    }
    navigation.navigate('ResistanceData', { 
      patientData: { ...patientData, ...clinicalData } 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>New Analysis [2/3]</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formTitleContainer}>
          <Icon name="flask-outline" size={24} color={COLORS.primary} />
          <Text style={styles.formTitle}>CLINICAL PARAMETERS</Text>
        </View>

        <Text style={styles.label}>Baseline HIV Viral Load * (copies/mL plasma)</Text>
        <View style={styles.inputContainer}>
          <Icon name="analytics-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="100000"
            keyboardType="numeric"
            value={clinicalData.viralLoad}
            onChangeText={(text) => setClinicalData({ ...clinicalData, viralLoad: text })}
          />
        </View>

        <Text style={styles.label}>Baseline CD4+ Count * (cells/μL)</Text>
        <View style={styles.inputContainer}>
          <Icon name="cellular-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="120"
            keyboardType="numeric"
            value={clinicalData.cd4Count}
            onChangeText={(text) => setClinicalData({ ...clinicalData, cd4Count: text })}
          />
        </View>

        <Text style={styles.label}>Last Viral Load Test Date</Text>
        <View style={styles.inputContainer}>
          <Icon name="calendar-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="2024-12-15"
            value={clinicalData.testDate}
            onChangeText={(text) => setClinicalData({ ...clinicalData, testDate: text })}
          />
        </View>

        <View style={styles.tipBox}>
          <Icon name="information-circle-outline" size={20} color={COLORS.primary} style={styles.tipIcon} />
          <Text style={styles.tipText}>
            Tip: Accurate viral load and CD4+ count data improves prediction accuracy
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={20} color={COLORS.text} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.buttonText}>Next: Mutations</Text>
            <Icon name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
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
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    color: COLORS.primary,
    fontSize: 16,
    marginLeft: 4,
  },
  headerBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightBlue,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
    gap: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClinicalDataScreen;