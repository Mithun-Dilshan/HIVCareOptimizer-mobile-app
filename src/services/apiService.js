/**
 * API Service - HIV Care Optimizer Backend Integration
 * Handles all HTTP requests to the FastAPI backend
 * Base URL: http://127.0.0.1:8000 (configure for production)
 */

// Configure the API base URL (change for production deployment)
const API_BASE_URL = 'http://127.0.0.1:8000';

// ================================================================
// HEALTH & INFO ENDPOINTS
// ================================================================

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

export const getModelInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/model-info`);
    if (!response.ok) throw new Error('Failed to fetch model info');
    return await response.json();
  } catch (error) {
    console.error('Model info error:', error);
    throw error;
  }
};

export const getAPIInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error('Failed to fetch API info');
    return await response.json();
  } catch (error) {
    console.error('API info error:', error);
    throw error;
  }
};

// ================================================================
// RESISTANCE PREDICTION ENDPOINTS
// ================================================================

/**
 * Get single resistance prediction
 * POST /predict
 */
export const predictResistance = async (patientData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      throw new Error(`Prediction failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Resistance prediction error:', error);
    throw error;
  }
};

/**
 * Batch resistance predictions
 * POST /predict-batch
 */
export const predictResistanceBatch = async (patientsData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientsData),
    });

    if (!response.ok) {
      throw new Error(`Batch prediction failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Batch resistance prediction error:', error);
    throw error;
  }
};

/**
 * Get prediction by ID
 * GET /predictions/{prediction_id}
 */
export const getPredictionById = async (predictionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predictions/${predictionId}`);
    if (!response.ok) throw new Error('Prediction not found');
    return await response.json();
  } catch (error) {
    console.error('Get prediction error:', error);
    throw error;
  }
};

/**
 * Get all predictions for a patient
 * GET /patient/{patient_id}/predictions
 */
export const getPatientPredictionHistory = async (patientId, limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/patient/${patientId}/predictions?limit=${limit}`
    );
    if (!response.ok) throw new Error('Patient history not found');
    return await response.json();
  } catch (error) {
    console.error('Patient history error:', error);
    throw error;
  }
};

/**
 * Get all recent predictions
 * GET /predictions
 */
export const getAllPredictions = async (limit = 50) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predictions?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch predictions');
    return await response.json();
  } catch (error) {
    console.error('Get all predictions error:', error);
    throw error;
  }
};

// ================================================================
// DOSE LOG ENDPOINTS
// ================================================================

/**
 * Log a dose (YES/NO response)
 * POST /log-dose
 */
export const logDose = async (doseLog) => {
  try {
    const response = await fetch(`${API_BASE_URL}/log-dose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doseLog),
    });

    if (!response.ok) {
      throw new Error(`Dose log failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Dose log error:', error);
    throw error;
  }
};

// ================================================================
// ADHERENCE FEATURE COMPUTATION ENDPOINTS
// ================================================================

/**
 * Get adherence features for a patient
 * GET /adherence/{patient_id}
 */
export const getAdherenceFeatures = async (patientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/adherence/${patientId}`);
    if (!response.ok) throw new Error('Adherence features not found');
    return await response.json();
  } catch (error) {
    console.error('Adherence features error:', error);
    throw error;
  }
};

/**
 * Get adherence history (raw dose logs)
 * GET /adherence/{patient_id}/history
 */
export const getAdherenceHistory = async (patientId, days = 7) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/adherence/${patientId}/history?days=${days}`
    );
    if (!response.ok) throw new Error('Adherence history not found');
    return await response.json();
  } catch (error) {
    console.error('Adherence history error:', error);
    throw error;
  }
};

// ================================================================
// ADHERENCE RISK PREDICTION ENDPOINTS
// ================================================================

/**
 * Predict adherence risk from manual feature vector
 * POST /adherence/predict
 */
export const predictAdherenceRiskManual = async (features) => {
  try {
    const response = await fetch(`${API_BASE_URL}/adherence/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features),
    });

    if (!response.ok) {
      throw new Error(`Adherence prediction failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Adherence risk manual prediction error:', error);
    throw error;
  }
};

/**
 * Auto-predict adherence risk from logs
 * GET /adherence/{patient_id}/predict
 */
export const predictAdherenceRiskFromLogs = async (patientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/adherence/${patientId}/predict`);
    if (!response.ok) throw new Error('Adherence risk prediction failed');
    return await response.json();
  } catch (error) {
    console.error('Adherence risk auto-prediction error:', error);
    throw error;
  }
};

// ================================================================
// HELPER FUNCTIONS
// ================================================================

/**
 * Format date to YYYY-MM-DD
 */
export const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Create sample patient data for prediction
 */
export const createPatientDataPayload = (patientInfo) => {
  return {
    SEX: patientInfo.sex || 1, // 0=Female, 1=Male
    YEAR: patientInfo.age || 35,
    Ethnicity: patientInfo.ethnicity || 1,
    Education: patientInfo.education || 3,
    Occupation: patientInfo.occupation || 4,
    Marital_status: patientInfo.maritalStatus || 2,
    Transmission_category: patientInfo.transmissionCategory || 3,
    Baseline_CD4: patientInfo.baselineCD4 || 200,
    Baseline_VL: patientInfo.baselineVL || 50000,
    ART_duration: patientInfo.artDuration || 24,
    HIV_1YX: patientInfo.hivSubtype || 'CRF07_BC',
    Initial_ART_regimen: patientInfo.artRegimen || '2NRTIs+NNRTIs',
    PI_MU_Count: patientInfo.piMutationCount || 0,
    NRTI_MU_Count: patientInfo.nrtiMutationCount || 1,
    NNRTI_MU_Count: patientInfo.nnrtiMutationCount || 0,
    patientId: patientInfo.patientId || 'UNKNOWN',
    testDate: patientInfo.testDate || formatDateForAPI(new Date()),
  };
};

/**
 * Create dose log payload
 */
export const createDoseLogPayload = (patientId, doseTime, taken, date = null) => {
  return {
    patient_id: patientId,
    dose_time: doseTime, // 'morning' | 'afternoon' | 'night'
    taken: taken,
    date: date || formatDateForAPI(new Date()),
  };
};

/**
 * Create adherence prediction payload
 */
export const createAdherencePredictionPayload = (patientId, features) => {
  return {
    patient_id: patientId,
    adherence_rate: features.adherenceRate || 0.75,
    missed_streak: features.missedStreak || 0,
    avg_delay: features.avgDelay || 0,
    side_effect_freq: features.sideEffectFreq || 0,
    avg_delay_hours: features.avgDelayHours || 0,
    refill_delay_days: features.refillDelayDays || 0,
    app_engagement: features.appEngagement || 0.5,
    doses_missed_30d: features.dosesMissed30d || 0,
    support_system: features.supportSystem || 0,
  };
};
