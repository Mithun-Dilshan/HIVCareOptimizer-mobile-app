# HIV Care Optimizer - Frontend API Integration Guide

## Overview
This guide provides step-by-step instructions for integrating the React Native frontend with the FastAPI backend (HIV Care Optimizer API).

---

## 📁 New Files Created

### 1. **API Service** (`src/services/apiService.js`)
   - Central hub for all API calls
   - Contains all backend endpoint integrations
   - Methods for:
     - Health checks and model info
     - Resistance predictions
     - Adherence risk predictions
     - Dose logging
     - History retrieval

### 2. **API Utilities** (`src/services/apiUtils.js`)
   - Data transformation functions
   - Metrics calculations
   - Analytics and trend analysis
   - Validation helpers
   - Response caching

### 3. **Chart Components** (`src/components/Charts.js`)
   - BarChart - for displaying adherence/resistance over time
   - LineChart - for trend analysis
   - CircularProgress - risk meter visualization
   - StatusBadge - status indicators
   - TimelineItem - event timeline
   - StatsCard - statistics display
   - AdherenceWeekView - weekly adherence overview

### 4. **Enhanced Dashboard** (`src/screens/EnhancedAdherenceDashboardScreen.js`)
   - Adherence monitoring dashboard
   - Graphs and visualizations
   - Date period filtering
   - Risk assessment display
   - Clinical recommendations
   - Time-based history view

### 5. **Analytics Screen** (`src/screens/EnhancedAnalyticsScreen.js`)
   - Comprehensive analytics dashboard
   - Resistance analysis tab
   - Adherence analysis tab
   - Multiple date range options
   - Trend analysis
   - Historical data visualization

### 6. **Resistance Prediction Screen** (`src/screens/ResistancePredictionScreen.js`)
   - Patient data input form
   - Preset patient profiles
   - ML model prediction integration
   - Results visualization
   - Probability distribution
   - Clinical recommendations

---

## 🚀 Quick Start

### Step 1: Update Navigation
Add the new screens to your `AppNavigator.tsx`:

```typescript
import EnhancedAdherenceDashboardScreen from '../screens/EnhancedAdherenceDashboardScreen';
import EnhancedAnalyticsScreen from '../screens/EnhancedAnalyticsScreen';
import ResistancePredictionScreen from '../screens/ResistancePredictionScreen';

// In your Stack.Navigator or Tab.Navigator
<Stack.Screen 
  name="AdherenceDashboard" 
  component={EnhancedAdherenceDashboardScreen} 
/>
<Stack.Screen 
  name="Analytics" 
  component={EnhancedAnalyticsScreen} 
/>
<Stack.Screen 
  name="ResistancePrediction" 
  component={ResistancePredictionScreen} 
/>
```

### Step 2: Configure API Base URL
Edit `src/services/apiService.js` and set your backend URL:

```javascript
// For local development
const API_BASE_URL = 'http://127.0.0.1:8000';

// For production (update with your server IP/domain)
const API_BASE_URL = 'http://your-production-server:8000';
```

### Step 3: Update App.tsx
Import the new services and ensure proper navigation setup.

---

## 📊 API Endpoints Integration

### Resistance Prediction

**Single Prediction:**
```javascript
import { predictResistance, createPatientDataPayload } from '../services/apiService';

const patientData = createPatientDataPayload({
  patientId: 'P_001',
  age: 35,
  sex: 1,
  // ... other fields
});

const result = await predictResistance(patientData);
// Returns: {
//   predicted_resistance_level: "S|I|H|L|P",
//   probability_susceptible: 0-1,
//   all_probabilities: {},
//   recommendation: "...",
//   risk_category: "LOW|MODERATE|HIGH",
//   total_mutations: number
// }
```

### Adherence Prediction

**From Raw Logs (Auto-Mode):**
```javascript
import { predictAdherenceRiskFromLogs } from '../services/apiService';

const result = await predictAdherenceRiskFromLogs('P_001');
// Returns: {
//   risk_level: "LOW RISK|MODERATE RISK|HIGH RISK",
//   urgency: "LOW|MEDIUM|HIGH",
//   prob_high_risk: 0-1,
//   prob_low_risk: 0-1,
//   risk_meter_pct: 0-100,
//   action: "...",
//   model_used: "ML_MODEL|RULE_BASED_FALLBACK"
// }
```

**From Manual Features:**
```javascript
import { predictAdherenceRiskManual } from '../services/apiService';

const features = {
  patient_id: 'P_001',
  adherence_rate: 0.85,
  missed_streak: 2,
  avg_delay: 0.5,
  side_effect_freq: 0,
  // ... other optional fields
};

const result = await predictAdherenceRiskManual(features);
```

### Dose Logging

```javascript
import { logDose, createDoseLogPayload } from '../services/apiService';

const doseLog = createDoseLogPayload(
  'P_001',
  'morning', // 'morning', 'afternoon', 'night'
  true,      // taken: true/false
  '2026-03-09' // optional date
);

const result = await logDose(doseLog);
```

### History Retrieval

```javascript
import { getAdherenceHistory } from '../services/apiService';

// Get last 7 days of adherence logs
const history = await getAdherenceHistory('P_001', 7);
// Returns: {
//   total_records: number,
//   summary: { taken, missed, adherence_pct },
//   logs: [{ date, dose_time, taken, ... }]
// }
```

---

## 🎨 Using Chart Components

### Bar Chart
```javascript
import { BarChart } from '../components/Charts';

<BarChart
  data={[
    { label: 'Mon', value: 100, color: '#51cf66' },
    { label: 'Tue', value: 66, color: '#ffa500' },
    { label: 'Wed', value: 100, color: '#51cf66' },
  ]}
  height={200}
  barColor="#03a9f4"
/>
```

### Circular Progress (Risk Meter)
```javascript
import { CircularProgress } from '../components/Charts';

<CircularProgress
  percentage={62}
  size={150}
  progressColor="#ff6b6b"
  label="Risk Level"
  subLabel="HIGH"
/>
```

### Status Badge
```javascript
import { StatusBadge } from '../components/Charts';

<StatusBadge status="HIGH RISK" size="medium" />
```

### Stats Card
```javascript
import { StatsCard } from '../components/Charts';

<StatsCard
  icon="💊"
  label="Adherence Rate"
  value={85}
  unit="%"
  description="Excellent compliance"
  color="#51cf66"
/>
```

### Adherence Week View
```javascript
import { AdherenceWeekView } from '../components/Charts';

<AdherenceWeekView
  data={[
    { taken: true, date: '2026-03-01' },
    { taken: false, date: '2026-03-02' },
    // ... 7 days
  ]}
/>
```

---

## 💾 Data Flow & Caching

### Using API Cache
```javascript
import { apiCache } from '../services/apiUtils';

// Automatic caching for API responses (5-minute TTL)
if (cachedData = apiCache.get('adherence_P_001')) {
  // Use cached data
  setAdherenceData(cachedData);
} else {
  // Fetch from API
  const data = await getAdherenceHistory('P_001', 7);
  apiCache.set('adherence_P_001', data);
}
```

### Data Transformation
```javascript
import { 
  transformResistanceResponse,
  transformAdherenceResponse,
  calculateAdherenceMetrics 
} from '../services/apiUtils';

const apiResponse = await predictResistance(patientData);
const transformed = transformResistanceResponse(apiResponse);

const metrics = calculateAdherenceMetrics(adherenceHistory.logs);
```

---

## 📱 Screen Usage Examples

### Adherence Dashboard
Navigate with patient ID:
```javascript
navigation.navigate('AdherenceDashboard', { 
  patientId: 'P_001' 
});
```

Features:
- Real-time risk assessment
- Adherence graphs with date filtering
- Timeline of recent events
- Clinical recommendations
- Action buttons for logging doses

### Analytics Screen
```javascript
navigation.navigate('Analytics', { 
  patientId: 'P_001',
  isGlobalView: false 
});
```

Features:
- Tab selection (Resistance/Adherence)
- Date range filtering (7/14/30/90 days)
- Statistical summaries
- Historical data visualization
- Trend analysis

### Resistance Prediction
```javascript
navigation.navigate('ResistancePrediction', { 
  patientId: 'P_001' 
});
```

Features:
- Patient data input form
- Preset profiles (Low/Moderate/High Risk)
- ML model integration
- Comprehensive results display
- Probability distributions

---

## 🔧 Configuration

### API Base URL
```javascript
// src/services/apiService.js
const API_BASE_URL = 'http://your-server-ip:8000';
```

### Date Format
The API uses `YYYY-MM-DD` format. Use helper function:
```javascript
import { formatDateForAPI } from '../services/apiService';

const formattedDate = formatDateForAPI(new Date()); // Returns: "2026-03-09"
```

### Error Handling
```javascript
try {
  const result = await predictResistance(data);
} catch (error) {
  // Handle network errors
  console.error(error);
  Alert.alert('Error', error.message);
}
```

---

## ✅ API Validation Checklist

Before using the app:

- [ ] Backend is running on configured URL
- [ ] API is accessible: `http://your-url:8000/health`
- [ ] Firebase is properly configured (if using Firebase save feature)
- [ ] Patient ID format matches your system
- [ ] Date ranges are correctly formatted
- [ ] Mutation counts are non-negative
- [ ] CD4 and VL values are positive numbers

Test with:
```javascript
import { healthCheck } from '../services/apiService';

const health = await healthCheck();
// Should return: { status: 'healthy', model_loaded: true, ... }
```

---

## 📈 Common Use Cases

### 1. Log Daily Dose
```javascript
const { logDose, createDoseLogPayload } from '../services/apiService';

const payload = createDoseLogPayload('P_001', 'morning', true);
const result = await logDose(payload);
```

### 2. Check Adherence Risk
```javascript
const { predictAdherenceRiskFromLogs } = '../services/apiService';

const risk = await predictAdherenceRiskFromLogs('P_001');
if (risk.urgency === 'HIGH') {
  // Show alert or notification
}
```

### 3. Get Resistance Prediction
```javascript
const formData = {
  patientId: 'P_001',
  age: 35,
  // ... fill all required fields
};

const payload = createPatientDataPayload(formData);
const prediction = await predictResistance(payload);
```

### 4. Load Historical Data
```javascript
const { getAdherenceHistory } = '../services/apiService';

const last30Days = await getAdherenceHistory('P_001', 30);
const last7Days = await getAdherenceHistory('P_001', 7);
```

---

## 🐛 Troubleshooting

### API Connection Issues
- ✅ Verify backend is running
- ✅ Check API_BASE_URL configuration
- ✅ Ensure network connectivity
- ✅ Check firewall rules

### Data Validation Errors
- ✅ Verify all required fields are filled
- ✅ Check field types (string vs number)
- ✅ Validate date format (YYYY-MM-DD)
- ✅ Ensure positive values for measurements

### Models Not Loading
- ✅ Check backend logs for model loading errors
- ✅ Verify model files exist in `/models` directory
- ✅ Fallback models will be generated if primary fails

---

## 📚 Additional Resources

- **API Server Code**: Refer to your FastAPI backend for endpoint details
- **Data Models**: Check Pydantic models in backend for field requirements
- **Error Codes**: API returns standard HTTP status codes (200, 400, 500)
- **Response Formats**: All endpoints return JSON responses

---

## 🚢 Deployment Notes

### For Production:
1. Update `API_BASE_URL` to production server
2. Enable HTTPS for secure communication
3. Implement API authentication tokens if needed
4. Add request timeout handling
5. Implement retry logic for failed requests
6. Configure proper error logging
7. Test all endpoints with production data

### Performance Optimization:
- Use API response caching (5-minute TTL default)
- Batch requests when possible
- Implement pagination for large datasets
- Clear cache periodically
- Monitor API response times

---

## 📞 Support

For issues or questions:
1. Check API logs: `backend/logs/`
2. Verify data format matches API schema
3. Test API with Postman/Insomnia
4. Check network connectivity
5. Review console logs for JavaScript errors

---

**Last Updated**: March 2026
**API Version**: 1.0.0
**Frontend Framework**: React Native with Expo
