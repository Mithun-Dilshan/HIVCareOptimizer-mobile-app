/**
 * API Utils - Helper functions for API integration
 * Handles formatting, transformations, and common operations
 */

import { formatDateForAPI } from './apiService';

/**
 * Transform API response to UI-friendly format
 */
export const transformResistanceResponse = (apiResponse) => {
  return {
    id: apiResponse.firebase_doc_id || `prediction_${Date.now()}`,
    patientId: apiResponse.patientId || 'UNKNOWN',
    predictionLevel: apiResponse.predicted_resistance_level,
    susceptibilityProbability: apiResponse.probability_susceptible,
    allProbabilities: apiResponse.all_probabilities,
    recommendation: apiResponse.recommendation,
    explanation: apiResponse.explanation,
    riskCategory: apiResponse.risk_category,
    totalMutations: apiResponse.total_mutations,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Transform API adherence response to UI format
 */
export const transformAdherenceResponse = (apiResponse) => {
  return {
    id: apiResponse.firebase_doc_id || `risk_${Date.now()}`,
    patientId: apiResponse.patient_id,
    riskLevel: apiResponse.risk_level,
    urgency: apiResponse.urgency,
    probHighRisk: apiResponse.prob_high_risk,
    probLowRisk: apiResponse.prob_low_risk,
    allProbabilities: apiResponse.all_probabilities,
    riskMeterPercentage: apiResponse.risk_meter_pct,
    action: apiResponse.action,
    modelUsed: apiResponse.model_used,
    computedAt: apiResponse.computed_at,
  };
};

/**
 * Calculate adherence metrics from history
 */
export const calculateAdherenceMetrics = (logs) => {
  if (!logs || logs.length === 0) {
    return {
      totalDoses: 0,
      dosesTaken: 0,
      dosesMissed: 0,
      adherenceRate: 0,
      streak: 0,
      bestStreak: 0,
      consistency: 'N/A',
    };
  }

  const dosesTaken = logs.filter((log) => log.taken).length;
  const dosesMissed = logs.filter((log) => !log.taken).length;
  const totalDoses = logs.length;
  const adherenceRate = (dosesTaken / totalDoses) * 100;

  // Calculate current streak
  let currentStreak = 0;
  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].taken) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate best streak
  let bestStreak = 0;
  let tempStreak = 0;
  logs.forEach((log) => {
    if (log.taken) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  const consistency =
    adherenceRate >= 90
      ? 'Excellent'
      : adherenceRate >= 75
      ? 'Good'
      : adherenceRate >= 50
      ? 'Fair'
      : 'Poor';

  return {
    totalDoses,
    dosesTaken,
    dosesMissed,
    adherenceRate: Math.round(adherenceRate),
    streak: currentStreak,
    bestStreak,
    consistency,
  };
};

/**
 * Group adherence logs by date
 */
export const groupLogsByDate = (logs) => {
  const grouped = {};

  logs.forEach((log) => {
    const date = log.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(log);
  });

  return Object.entries(grouped)
    .map(([date, dosesOnDay]) => {
      const taken = dosesOnDay.filter((d) => d.taken).length;
      const total = dosesOnDay.length;
      return {
        date,
        doses: dosesOnDay,
        taken,
        total,
        adherencePercent: (taken / total) * 100,
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Get adherence trend analysis
 */
export const analyzeAdherenceTrend = (groupedLogs) => {
  if (groupedLogs.length < 2) {
    return { trend: 'insufficient_data', direction: 'neutral' };
  }

  const firstHalf = groupedLogs.slice(0, Math.floor(groupedLogs.length / 2));
  const secondHalf = groupedLogs.slice(Math.floor(groupedLogs.length / 2));

  const firstHalfAvg =
    firstHalf.reduce((sum, log) => sum + log.adherencePercent, 0) /
    firstHalf.length;
  const secondHalfAvg =
    secondHalf.reduce((sum, log) => sum + log.adherencePercent, 0) /
    secondHalf.length;

  const difference = secondHalfAvg - firstHalfAvg;

  let trend, direction;

  if (Math.abs(difference) < 5) {
    trend = 'stable';
    direction = 'neutral';
  } else if (difference > 0) {
    trend = 'improving';
    direction = 'up';
  } else {
    trend = 'declining';
    direction = 'down';
  }

  return {
    trend,
    direction,
    difference: Math.round(difference),
    firstHalfAvg: Math.round(firstHalfAvg),
    secondHalfAvg: Math.round(secondHalfAvg),
  };
};

/**
 * Format date for display
 */
export const formatDisplayDate = (dateString, format = 'short') => {
  const date = new Date(dateString);

  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    case 'long':
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    case 'iso':
      return dateString;
    case 'relative':
      return getRelativeDate(date);
    default:
      return date.toDateString();
  }
};

/**
 * Get relative date (e.g., "2 hours ago")
 */
export const getRelativeDate = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString();
};

/**
 * Format probability for display
 */
export const formatProbability = (prob, decimals = 1) => {
  return `${(prob * 100).toFixed(decimals)}%`;
};

/**
 * Get risk color based on level
 */
export const getRiskColor = (riskLevel) => {
  const level = riskLevel?.toUpperCase() || 'LOW';

  if (level.includes('HIGH')) return '#ff6b6b';
  if (level.includes('MOD') || level.includes('MODERATE')) return '#ffa500';
  return '#51cf66';
};

/**
 * Get status badge styling
 */
export const getStatusStyling = (status) => {
  const upperStatus = status?.toUpperCase() || 'UNKNOWN';

  if (upperStatus.includes('HIGH')) {
    return {
      backgroundColor: '#ff6b6b',
      borderColor: '#ff5252',
      icon: '⚠️',
      color: '#fff',
    };
  }

  if (upperStatus.includes('MOD')) {
    return {
      backgroundColor: '#ffa500',
      borderColor: '#ff8c00',
      icon: '⚠️',
      color: '#fff',
    };
  }

  return {
    backgroundColor: '#51cf66',
    borderColor: '#40c057',
    icon: '✓',
    color: '#fff',
  };
};

/**
 * Filter logs by date range
 */
export const filterLogsByDateRange = (logs, startDate, endDate) => {
  return logs.filter((log) => {
    const logDate = new Date(log.date);
    return logDate >= startDate && logDate <= endDate;
  });
};

/**
 * Get chart data from adherence logs
 */
export const getChartDataFromLogs = (logs, type = 'bar') => {
  if (!logs || logs.length === 0) return [];

  const grouped = groupLogsByDate(logs);

  return grouped.map((item) => ({
    date: formatDisplayDate(item.date, 'short'),
    value: item.adherencePercent,
    rawDate: item.date,
    taken: item.taken,
    total: item.total,
    label: new Date(item.date).getDate().toString(),
  }));
};

/**
 * Validate patient data before sending to API
 */
export const validatePatientData = (data) => {
  const errors = [];

  if (!data.patientId || data.patientId.trim() === '') {
    errors.push('Patient ID is required');
  }

  if (!data.age || data.age < 0 || data.age > 120) {
    errors.push('Age must be between 0 and 120');
  }

  if (!data.baselineCD4 || data.baselineCD4 < 0) {
    errors.push('Baseline CD4 must be a positive number');
  }

  if (!data.baselineVL || data.baselineVL < 0) {
    errors.push('Baseline VL must be a positive number');
  }

  if (!data.artDuration || data.artDuration < 0) {
    errors.push('ART duration must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate prediction summary report
 */
export const generateResistanceSummary = (prediction) => {
  const summary = {
    title: `${prediction.risk_category} RISK ASSESSMENT`,
    status: prediction.predicted_resistance_level,
    confidence: Math.round(
      Math.max(...Object.values(prediction.all_probabilities)) * 100
    ),
    key_findings: [
      `Predicted Resistance Level: ${prediction.predicted_resistance_level}`,
      `Susceptibility Probability: ${formatProbability(prediction.probability_susceptible)}`,
      `Total Mutations: ${prediction.total_mutations}`,
      `Risk Category: ${prediction.risk_category}`,
    ],
    recommendation: prediction.recommendation,
    details: prediction.explanation,
  };

  return summary;
};

/**
 * Generate adherence summary report
 */
export const generateAdherenceSummary = (response, metrics) => {
  const summary = {
    title: `${response.risk_level} ADHERENCE STATUS`,
    urgency: response.urgency,
    adherenceRate: metrics.adherenceRate,
    key_findings: [
      `Risk Level: ${response.risk_level}`,
      `Urgency: ${response.urgency}`,
      `Adherence Rate: ${metrics.adherenceRate}%`,
      `Compliance: ${metrics.consistency}`,
      `Model Used: ${response.model_used}`,
    ],
    action: response.action,
    lastAssessment: response.computed_at,
  };

  return summary;
};

/**
 * Cache management for API responses
 */
export class APIResponseCache {
  constructor(ttlMinutes = 5) {
    this.cache = {};
    this.ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
  }

  set(key, value) {
    this.cache[key] = {
      value,
      timestamp: Date.now(),
    };
  }

  get(key) {
    if (!this.cache[key]) return null;

    const { value, timestamp } = this.cache[key];
    const isExpired = Date.now() - timestamp > this.ttl;

    if (isExpired) {
      delete this.cache[key];
      return null;
    }

    return value;
  }

  clear() {
    this.cache = {};
  }

  clearExpired() {
    const now = Date.now();
    Object.keys(this.cache).forEach((key) => {
      if (now - this.cache[key].timestamp > this.ttl) {
        delete this.cache[key];
      }
    });
  }
}

export const apiCache = new APIResponseCache(5); // 5 minutes TTL
