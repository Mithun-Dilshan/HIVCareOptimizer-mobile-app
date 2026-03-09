/**
 * Custom React Hooks for API Integration
 * Simplifies API calls and state management
 */

import { useState, useCallback, useEffect } from 'react';
import * as apiService from './apiService';
import * as apiUtils from './apiUtils';

/**
 * Hook: useResistancePrediction
 * Manages resistance prediction state and API calls
 */
export const useResistancePrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = useCallback(async (patientData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate data
      const validation = apiUtils.validatePatientData(patientData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Create payload
      const payload = apiService.createPatientDataPayload(patientData);

      // Call API
      const result = await apiService.predictResistance(payload);

      // Transform response
      const transformed = apiUtils.transformResistanceResponse(result);
      setPrediction(transformed);

      return transformed;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get prediction';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPrediction(null);
    setError(null);
  }, []);

  return {
    prediction,
    loading,
    error,
    predict,
    reset,
  };
};

/**
 * Hook: useAdherenceRisk
 * Manages adherence risk prediction from logs
 */
export const useAdherenceRisk = (patientId) => {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Try to get cached result first
  const predictFromLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache
      const cached = apiUtils.apiCache.get(`adherence_risk_${patientId}`);
      if (cached) {
        setRisk(cached);
        return cached;
      }

      // Call API
      const result = await apiService.predictAdherenceRiskFromLogs(patientId);

      // Transform response
      const transformed = apiUtils.transformAdherenceResponse(result);

      // Cache result
      apiUtils.apiCache.set(`adherence_risk_${patientId}`, transformed);

      setRisk(transformed);
      return transformed;
    } catch (err) {
      const errorMessage = err.message || 'Failed to predict adherence risk';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const predictManual = useCallback(
    async (features) => {
      try {
        setLoading(true);
        setError(null);

        const payload = apiService.createAdherencePredictionPayload(
          patientId,
          features
        );

        const result = await apiService.predictAdherenceRiskManual(payload);
        const transformed = apiUtils.transformAdherenceResponse(result);

        setRisk(transformed);
        return transformed;
      } catch (err) {
        const errorMessage = err.message || 'Failed to predict adherence risk';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [patientId]
  );

  return {
    risk,
    loading,
    error,
    predictFromLogs,
    predictManual,
  };
};

/**
 * Hook: useAdherenceHistory
 * Fetches and manages adherence history
 */
export const useAdherenceHistory = (patientId, days = 7) => {
  const [history, setHistory] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cacheKey = `adherence_history_${patientId}_${days}`;
      const cached = apiUtils.apiCache.get(cacheKey);

      let data;
      if (cached) {
        data = cached;
      } else {
        // Fetch from API
        data = await apiService.getAdherenceHistory(patientId, days);
        apiUtils.apiCache.set(cacheKey, data);
      }

      setHistory(data);

      // Calculate metrics
      if (data.logs) {
        const calculatedMetrics = apiUtils.calculateAdherenceMetrics(data.logs);
        setMetrics(calculatedMetrics);
      }

      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch adherence history';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patientId, days]);

  // Auto-fetch on mount
  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    history,
    metrics,
    loading,
    error,
    refresh: fetch,
  };
};

/**
 * Hook: useDoseLogging
 * Manages dose logging functionality
 */
export const useDoseLogging = (patientId) => {
  const [logging, setLogging] = useState(false);
  const [lastLog, setLastLog] = useState(null);
  const [error, setError] = useState(null);

  const logDose = useCallback(
    async (doseTime, taken, date = null) => {
      try {
        setLogging(true);
        setError(null);

        const payload = apiService.createDoseLogPayload(
          patientId,
          doseTime,
          taken,
          date
        );

        const result = await apiService.logDose(payload);

        setLastLog({
          ...result,
          timestamp: new Date().toISOString(),
        });

        // Clear cache for this patient
        const cacheKey = `adherence_history_${patientId}`;
        apiUtils.apiCache.cache['adherence_risk_' + patientId] = undefined;

        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to log dose';
        setError(errorMessage);
        throw err;
      } finally {
        setLogging(false);
      }
    },
    [patientId]
  );

  return {
    lastLog,
    logging,
    error,
    logDose,
  };
};

/**
 * Hook: usePredictionHistory
 * Fetches patient prediction history
 */
export const usePredictionHistory = (patientId, limit = 10) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = `prediction_history_${patientId}`;
      const cached = apiUtils.apiCache.get(cacheKey);

      let data;
      if (cached) {
        data = cached;
      } else {
        data = await apiService.getPatientPredictionHistory(patientId, limit);
        apiUtils.apiCache.set(cacheKey, data);
      }

      setPredictions(data.predictions || []);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch prediction history';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patientId, limit]);

  // Auto-fetch on mount
  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    predictions,
    loading,
    error,
    refresh: fetch,
  };
};

/**
 * Hook: useAdherenceAnalytics
 * Comprehensive adherence analytics and trends
 */
export const useAdherenceAnalytics = (patientId, days = 30) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch history
      const history = await apiService.getAdherenceHistory(patientId, days);

      if (!history.logs || history.logs.length === 0) {
        setAnalytics(null);
        return;
      }

      // Group by date and calculate metrics
      const grouped = apiUtils.groupLogsByDate(history.logs);
      const metrics = apiUtils.calculateAdherenceMetrics(history.logs);
      const trend = apiUtils.analyzeAdherenceTrend(grouped);
      const chartData = apiUtils.getChartDataFromLogs(history.logs);

      const result = {
        metrics,
        trend,
        grouped,
        chartData,
        period: days,
      };

      setAnalytics(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to calculate analytics';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patientId, days]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  return {
    analytics,
    loading,
    error,
    refresh: calculate,
  };
};

/**
 * Hook: useAPIHealthStatus
 * Monitor API health
 */
export const useAPIHealthStatus = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const check = useCallback(async () => {
    try {
      setLoading(true);
      const status = await apiService.healthCheck();
      setHealth(status);
      return status;
    } catch (err) {
      setError(err.message || 'API health check failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check on mount
  useEffect(() => {
    check();
  }, [check]);

  return {
    health,
    loading,
    error,
    check,
  };
};

/**
 * Hook: useModelInfo
 * Get API model information
 */
export const useModelInfo = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const info = await apiService.getModelInfo();
      setModelInfo(info);
      return info;
    } catch (err) {
      setError(err.message || 'Failed to fetch model info');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    modelInfo,
    loading,
    error,
    refresh: fetch,
  };
};

/**
 * Hook: useFilteredAdherenceData
 * Filter adherence data by date range
 */
export const useFilteredAdherenceData = (history, startDate, endDate) => {
  const [filtered, setFiltered] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (history?.logs) {
      const filteredLogs = apiUtils.filterLogsByDateRange(
        history.logs,
        startDate,
        endDate
      );

      setFiltered(filteredLogs);

      const calcs = apiUtils.calculateAdherenceMetrics(filteredLogs);
      setMetrics(calcs);
    }
  }, [history, startDate, endDate]);

  return {
    filtered,
    metrics,
  };
};
