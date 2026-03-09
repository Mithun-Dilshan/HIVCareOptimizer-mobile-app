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
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../constants/colors';
import {
  predictResistance,
  createPatientDataPayload,
} from '../services/apiService';
import { CircularProgress, StatusBadge } from '../components/Charts';

export default function ResistancePredictionScreen({ navigation, route }) {
  const patientId = route?.params?.patientId || 'UNKNOWN';

  // Form State
  const [formData, setFormData] = useState({
    patientId: patientId,
    sex: '1', // 1=Male, 0=Female
    age: '35',
    ethnicity: '1',
    education: '3',
    occupation: '4',
    maritalStatus: '2',
    transmissionCategory: '3',
    baselineCD4: '200',
    baselineVL: '50000',
    artDuration: '24',
    hivSubtype: 'CRF07_BC',
    artRegimen: '2NRTIs+NNRTIs',
    piMutationCount: '0',
    nrtiMutationCount: '1',
    nnrtiMutationCount: '0',
    testDate: new Date().toISOString().split('T')[0],
  });

  // Result State
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [showPresets, setShowPresets] = useState(false);

  /**
   * Handle form input change
   */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Load preset patient profile
   */
  const loadPreset = (preset) => {
    const presets = {
      highRisk: {
        sex: '1',
        age: '45',
        ethnicity: '1',
        education: '2',
        occupation: '3',
        maritalStatus: '1',
        transmissionCategory: '2',
        baselineCD4: '50',
        baselineVL: '500000',
        artDuration: '36',
        hivSubtype: 'B',
        artRegimen: '2NRTIs+PIs',
        piMutationCount: '5',
        nrtiMutationCount: '4',
        nnrtiMutationCount: '3',
      },
      lowRisk: {
        sex: '0',
        age: '28',
        ethnicity: '2',
        education: '4',
        occupation: '5',
        maritalStatus: '2',
        transmissionCategory: '1',
        baselineCD4: '500',
        baselineVL: '10000',
        artDuration: '12',
        hivSubtype: 'CRF07_BC',
        artRegimen: '2NRTIs+NNRTIs',
        piMutationCount: '0',
        nrtiMutationCount: '1',
        nnrtiMutationCount: '0',
      },
      moderateRisk: {
        sex: '1',
        age: '38',
        ethnicity: '1',
        education: '3',
        occupation: '3',
        maritalStatus: '2',
        transmissionCategory: '2',
        baselineCD4: '200',
        baselineVL: '100000',
        artDuration: '24',
        hivSubtype: 'A',
        artRegimen: '2NRTIs+NNRTIs',
        piMutationCount: '1',
        nrtiMutationCount: '2',
        nnrtiMutationCount: '1',
      },
    };

    setFormData((prev) => ({
      ...prev,
      ...presets[preset],
    }));
    setShowPresets(false);
  };

  /**
   * Submit prediction request to API
   */
  const handlePredict = async () => {
    try {
      setLoading(true);
      setPrediction(null);

      // Validate inputs
      if (!formData.patientId) {
        Alert.alert('Validation Error', 'Patient ID is required');
        setLoading(false);
        return;
      }

      // Create payload
      const payload = createPatientDataPayload({
        patientId: formData.patientId,
        sex: parseInt(formData.sex),
        age: parseInt(formData.age),
        ethnicity: parseInt(formData.ethnicity),
        education: parseInt(formData.education),
        occupation: parseInt(formData.occupation),
        maritalStatus: parseInt(formData.maritalStatus),
        transmissionCategory: parseInt(formData.transmissionCategory),
        baselineCD4: parseFloat(formData.baselineCD4),
        baselineVL: parseFloat(formData.baselineVL),
        artDuration: parseFloat(formData.artDuration),
        hivSubtype: formData.hivSubtype,
        artRegimen: formData.artRegimen,
        piMutationCount: parseInt(formData.piMutationCount),
        nrtiMutationCount: parseInt(formData.nrtiMutationCount),
        nnrtiMutationCount: parseInt(formData.nnrtiMutationCount),
        testDate: formData.testDate,
      });

      console.log('Sending prediction request:', payload);

      // Call API
      const result = await predictResistance(payload);
      setPrediction(result);

      // Show success alert
      Alert.alert(
        'Prediction Complete',
        `Risk Level: ${result.risk_category}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Prediction error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to get prediction. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({
      patientId: patientId,
      sex: '1',
      age: '35',
      ethnicity: '1',
      education: '3',
      occupation: '4',
      maritalStatus: '2',
      transmissionCategory: '3',
      baselineCD4: '200',
      baselineVL: '50000',
      artDuration: '24',
      hivSubtype: 'CRF07_BC',
      artRegimen: '2NRTIs+NNRTIs',
      piMutationCount: '0',
      nrtiMutationCount: '1',
      nnrtiMutationCount: '0',
      testDate: new Date().toISOString().split('T')[0],
    });
    setPrediction(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Resistance Prediction</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        {/* Tabs for Input/Results */}
        {!prediction ? (
          <View style={styles.content}>
            {/* Preset Buttons */}
            <View style={styles.presetSection}>
              <TouchableOpacity
                style={[styles.expandButton, styles.presetButton]}
                onPress={() => setShowPresets(!showPresets)}
              >
                <Icon name="settings" size={18} color={COLORS.primary} />
                <Text style={styles.expandButtonText}>Load Preset Profile</Text>
                <Icon
                  name={showPresets ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={COLORS.primary}
                />
              </TouchableOpacity>

              {showPresets && (
                <View style={styles.presetOptions}>
                  <TouchableOpacity
                    style={styles.presetOption}
                    onPress={() => loadPreset('lowRisk')}
                  >
                    <Icon name="checkmark-circle" size={18} color="#51cf66" />
                    <View style={styles.presetOptionText}>
                      <Text style={styles.presetOptionTitle}>Low Risk</Text>
                      <Text style={styles.presetOptionDesc}>
                        Good adherence, high CD4, low VL
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.presetOption}
                    onPress={() => loadPreset('moderateRisk')}
                  >
                    <Icon name="alert" size={18} color="#ffa500" />
                    <View style={styles.presetOptionText}>
                      <Text style={styles.presetOptionTitle}>Moderate Risk</Text>
                      <Text style={styles.presetOptionDesc}>
                        Some mutations, moderate CD4
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.presetOption}
                    onPress={() => loadPreset('highRisk')}
                  >
                    <Icon name="warning" size={18} color="#ff6b6b" />
                    <View style={styles.presetOptionText}>
                      <Text style={styles.presetOptionTitle}>High Risk</Text>
                      <Text style={styles.presetOptionDesc}>
                        Multiple mutations, low CD4, high VL
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Patient Information</Text>

              {/* Patient ID */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Patient ID *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter patient ID"
                  value={formData.patientId}
                  onChangeText={(value) =>
                    handleInputChange('patientId', value)
                  }
                  placeholderTextColor="#999"
                />
              </View>

              {/* Age */}
              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Age (years)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="35"
                    value={formData.age}
                    onChangeText={(value) => handleInputChange('age', value)}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
                  <Text style={styles.label}>Sex</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.sex}
                      onValueChange={(value) => handleInputChange('sex', value)}
                    >
                      <Picker.Item label="Female" value="0" />
                      <Picker.Item label="Male" value="1" />
                    </Picker>
                  </View>
                </View>
              </View>

              {/* CD4 and Viral Load */}
              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Baseline CD4 (cells/μL)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="200"
                    value={formData.baselineCD4}
                    onChangeText={(value) =>
                      handleInputChange('baselineCD4', value)
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
                  <Text style={styles.label}>Baseline VL (copies/mL)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="50000"
                    value={formData.baselineVL}
                    onChangeText={(value) =>
                      handleInputChange('baselineVL', value)
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* ART Information */}
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                ART Information
              </Text>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>ART Duration (months)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="24"
                    value={formData.artDuration}
                    onChangeText={(value) =>
                      handleInputChange('artDuration', value)
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
                  <Text style={styles.label}>HIV-1 Subtype</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="CRF07_BC"
                    value={formData.hivSubtype}
                    onChangeText={(value) =>
                      handleInputChange('hivSubtype', value)
                    }
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Initial ART Regimen</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2NRTIs+NNRTIs"
                  value={formData.artRegimen}
                  onChangeText={(value) =>
                    handleInputChange('artRegimen', value)
                  }
                  placeholderTextColor="#999"
                />
              </View>

              {/* Mutations */}
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                Mutation Counts
              </Text>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>PI Mutations</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={formData.piMutationCount}
                    onChangeText={(value) =>
                      handleInputChange('piMutationCount', value)
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
                  <Text style={styles.label}>NRTI Mutations</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1"
                    value={formData.nrtiMutationCount}
                    onChangeText={(value) =>
                      handleInputChange('nrtiMutationCount', value)
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>NNRTI Mutations</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.nnrtiMutationCount}
                  onChangeText={(value) =>
                    handleInputChange('nnrtiMutationCount', value)
                  }
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Test Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={formData.testDate}
                  onChangeText={(value) =>
                    handleInputChange('testDate', value)
                  }
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handlePredict}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon name="flask" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Run Prediction</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={resetForm}
                disabled={loading}
              >
                <Icon name="refresh" size={18} color={COLORS.primary} />
                <Text style={[styles.buttonText, { color: COLORS.primary }]}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Results View
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Prediction Result</Text>
              <TouchableOpacity
                onPress={() => setPrediction(null)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Risk Meter */}
            <View style={styles.riskMeterSection}>
              <CircularProgress
                percentage={prediction.probability_susceptible * 100}
                size={160}
                strokeWidth={8}
                progressColor={
                  prediction.risk_category === 'HIGH'
                    ? '#ff6b6b'
                    : prediction.risk_category === 'MODERATE'
                    ? '#ffa500'
                    : '#51cf66'
                }
                label="Susceptibility"
                subLabel={`${(prediction.probability_susceptible * 100).toFixed(1)}%`}
              />
            </View>

            {/* Prediction Details */}
            <View style={styles.resultDetailsSection}>
              <View style={styles.resultDetail}>
                <Text style={styles.resultLabel}>Resistance Level:</Text>
                <StatusBadge
                  status={prediction.predicted_resistance_level}
                  size="medium"
                />
              </View>

              <View style={styles.resultDetail}>
                <Text style={styles.resultLabel}>Risk Category:</Text>
                <Text
                  style={[
                    styles.resultValue,
                    {
                      color:
                        prediction.risk_category === 'HIGH'
                          ? '#ff6b6b'
                          : prediction.risk_category === 'MODERATE'
                          ? '#ffa500'
                          : '#51cf66',
                    },
                  ]}
                >
                  {prediction.risk_category}
                </Text>
              </View>

              <View style={styles.resultDetail}>
                <Text style={styles.resultLabel}>Total Mutations:</Text>
                <Text style={styles.resultValue}>
                  {prediction.total_mutations}
                </Text>
              </View>

              <View style={styles.resultDetail}>
                <Text style={styles.resultLabel}>Confidence:</Text>
                <Text style={styles.resultValue}>
                  {(
                    Math.max(
                      ...Object.values(prediction.all_probabilities)
                    ) * 100
                  ).toFixed(1)}
                  %
                </Text>
              </View>
            </View>

            {/* Probabilities */}
            <View style={styles.probabilitiesSection}>
              <Text style={styles.resultLabel}>Probability Distribution:</Text>
              {Object.entries(prediction.all_probabilities).map(
                ([level, prob], index) => (
                  <View key={index} style={styles.probabilityRow}>
                    <Text style={styles.probabilityLabel}>{level}</Text>
                    <View style={styles.probabilityBar}>
                      <View
                        style={[
                          styles.probabilityFill,
                          {
                            width: `${prob * 100}%`,
                            backgroundColor:
                              level === 'S'
                                ? '#51cf66'
                                : level === 'I'
                                ? '#ffa500'
                                : '#ff6b6b',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.probabilityValue}>
                      {(prob * 100).toFixed(1)}%
                    </Text>
                  </View>
                )
              )}
            </View>

            {/* Recommendation */}
            <View style={styles.recommendationSection}>
              <Text style={styles.resultLabel}>Recommendation:</Text>
              <Text style={styles.recommendationText}>
                {prediction.recommendation}
              </Text>
            </View>

            {/* Explanation */}
            <View style={styles.explanationSection}>
              <Text style={styles.resultLabel}>Explanation:</Text>
              <Text style={styles.explanationText}>
                {prediction.explanation}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.resultButtonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={() => {
                  // Save or proceed
                  Alert.alert('Success', 'Result saved to Firebase', [
                    {
                      text: 'OK',
                      onPress: () => setPrediction(null),
                    },
                  ]);
                }}
              >
                <Icon name="save" size={18} color="#fff" />
                <Text style={styles.buttonText}>Save & Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setPrediction(null)}
              >
                <Icon name="create" size={18} color={COLORS.primary} />
                <Text style={[styles.buttonText, { color: COLORS.primary }]}>
                  New Prediction
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  presetSection: {
    marginBottom: 16,
  },
  expandButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  presetButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  expandButtonText: {
    flex: 1,
    marginLeft: 12,
    fontWeight: '600',
    color: COLORS.primary,
    fontSize: 13,
  },
  presetOptions: {
    marginTop: 8,
    gap: 8,
  },
  presetOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  presetOptionText: {
    flex: 1,
  },
  presetOptionTitle: {
    fontWeight: '600',
    fontSize: 13,
    color: '#333',
  },
  presetOptionDesc: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
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
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  buttonsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  resultContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  riskMeterSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
  },
  resultDetailsSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  resultDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  probabilitiesSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  probabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  probabilityLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    width: 30,
  },
  probabilityBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  probabilityFill: {
    height: '100%',
  },
  probabilityValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    width: 40,
    textAlign: 'right',
  },
  recommendationSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  recommendationText: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
    lineHeight: 18,
  },
  explanationSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  explanationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    lineHeight: 18,
  },
  resultButtonsContainer: {
    gap: 10,
    marginBottom: 16,
  },
});
