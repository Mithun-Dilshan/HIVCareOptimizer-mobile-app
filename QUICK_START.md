# Quick Start Guide - API Integration

## 🎯 5-Minute Setup

### 1. Update Your Navigation
```typescript
// In src/navigation/AppNavigator.tsx

import EnhancedAdherenceDashboardScreen from '../screens/EnhancedAdherenceDashboardScreen';
import EnhancedAnalyticsScreen from '../screens/EnhancedAnalyticsScreen';
import ResistancePredictionScreen from '../screens/ResistancePredictionScreen';

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      {/* ...existing screens... */}
      
      <Stack.Screen 
        name="AdherenceDashboard" 
        component={EnhancedAdherenceDashboardScreen}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen 
        name="Analytics" 
        component={EnhancedAnalyticsScreen}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen 
        name="ResistancePrediction" 
        component={ResistancePredictionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
```

### 2. Configure API Base URL
```javascript
// In src/services/apiService.js (Around line 6)

// LOCAL DEVELOPMENT
const API_BASE_URL = 'http://127.0.0.1:8000';

// Or for production
const API_BASE_URL = 'http://192.168.1.100:8000'; // Replace with your server IP
```

### 3. Navigate to Screens
```javascript
// From any screen component
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      <TouchableOpacity 
        onPress={() => navigation.navigate('AdherenceDashboard', { patientId: 'P_001' })}
      >
        <Text>View Adherence</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Analytics', { patientId: 'P_001' })}
      >
        <Text>View Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('ResistancePrediction', { patientId: 'P_001' })}
      >
        <Text>Predict Resistance</Text>
      </TouchableOpacity>
    </>
  );
};
```

---

## 📚 Common Code Examples

### Example 1: Get Adherence Risk (Simplest Way)
```javascript
import { useAdherenceRisk } from '../hooks/useAPI';

const MyComponent = ({ patientId }) => {
  const { risk, loading, error, predictFromLogs } = useAdherenceRisk(patientId);

  useEffect(() => {
    predictFromLogs();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      <Text>Risk Level: {risk?.risk_level}</Text>
      <Text>Urgency: {risk?.urgency}</Text>
      <Text>Action: {risk?.action}</Text>
    </View>
  );
};
```

### Example 2: Log a Dose
```javascript
import { useDoseLogging } from '../hooks/useAPI';

const DoseLogComponent = ({ patientId }) => {
  const { logging, lastLog, error, logDose } = useDoseLogging(patientId);

  const handleLogDose = async () => {
    try {
      await logDose('morning', true); // 'morning|afternoon|night', taken: true/false
      Alert.alert('Success', 'Dose logged successfully');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleLogDose} 
      disabled={logging}
    >
      <Text>{logging ? 'Logging...' : 'Log Dose'}</Text>
    </TouchableOpacity>
  );
};
```

### Example 3: Get Adherence History with Analytics
```javascript
import { useAdherenceAnalytics } from '../hooks/useAPI';

const AnalyticsComponent = ({ patientId }) => {
  const { analytics, loading } = useAdherenceAnalytics(patientId, 30); // 30 days

  if (loading) return <Text>Calculating...</Text>;

  return (
    <View>
      <Text>Adherence Rate: {analytics?.metrics.adherenceRate}%</Text>
      <Text>Doses Taken: {analytics?.metrics.dosesTaken}</Text>
      <Text>Doses Missed: {analytics?.metrics.dosesMissed}</Text>
      <Text>Trend: {analytics?.trend.trend}</Text>
    </View>
  );
};
```

### Example 4: Predict Resistance
```javascript
import { useResistancePrediction } from '../hooks/useAPI';

const PredictionComponent = ({ patientId }) => {
  const { prediction, loading, error, predict } = useResistancePrediction();

  const handlePredict = async () => {
    try {
      await predict({
        patientId: patientId,
        age: 35,
        sex: 1,
        baselineCD4: 200,
        baselineVL: 50000,
        artDuration: 24,
        hivSubtype: 'CRF07_BC',
        artRegimen: '2NRTIs+NNRTIs',
        piMutationCount: 0,
        nrtiMutationCount: 1,
        nnrtiMutationCount: 0,
        // ... fill all required fields
      });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePredict} disabled={loading}>
        <Text>{loading ? 'Predicting...' : 'Run Prediction'}</Text>
      </TouchableOpacity>

      {prediction && (
        <View>
          <Text>Level: {prediction.predictionLevel}</Text>
          <Text>Risk: {prediction.riskCategory}</Text>
          <Text>Recommendation: {prediction.recommendation}</Text>
        </View>
      )}
    </View>
  );
};
```

---

## 🎨 Chart Component Usage

### Display Adherence Chart
```javascript
import { BarChart, AdherenceWeekView } from '../components/Charts';

const ChartComponent = ({ adherenceData }) => {
  const chartData = adherenceData.logs.map(log => ({
    label: new Date(log.date).getDate().toString(),
    value: log.taken ? 100 : 0,
    color: log.taken ? '#51cf66' : '#ff6b6b'
  }));

  return (
    <View>
      <BarChart data={chartData} height={200} />
      <AdherenceWeekView data={adherenceData.logs.slice(-7)} />
    </View>
  );
};
```

### Display Risk Meter
```javascript
import { CircularProgress } from '../components/Charts';

const RiskMeterComponent = ({ riskResponse }) => {
  return (
    <CircularProgress
      percentage={riskResponse.prob_high_risk * 100}
      size={150}
      progressColor={
        riskResponse.risk_level === 'HIGH RISK' ? '#ff6b6b' :
        riskResponse.risk_level === 'MODERATE RISK' ? '#ffa500' :
        '#51cf66'
      }
      label="Risk"
    />
  );
};
```

---

## 🔍 Testing Your Integration

### Test 1: Check API Connection
```javascript
import { healthCheck } from '../services/apiService';

// In a test screen or component
const testConnection = async () => {
  try {
    const health = await healthCheck();
    console.log('✅ API is healthy:', health);
  } catch (err) {
    console.error('❌ API connection failed:', err.message);
  }
};
```

### Test 2: Test Data Submission
```javascript
import { logDose, createDoseLogPayload } from '../services/apiService';

const testDoseLog = async () => {
  try {
    const payload = createDoseLogPayload('P_TEST', 'morning', true);
    const result = await logDose(payload);
    console.log('✅ Dose logged:', result);
  } catch (err) {
    console.error('❌ Dose log failed:', err.message);
  }
};
```

### Test 3: Test Prediction
```javascript
import { predictResistance, createPatientDataPayload } from '../services/apiService';

const testPrediction = async () => {
  try {
    const payload = createPatientDataPayload({
      patientId: 'P_TEST',
      age: 35,
      sex: 1,
      baselineCD4: 200,
      baselineVL: 50000,
      artDuration: 24,
      hivSubtype: 'CRF07_BC',
      artRegimen: '2NRTIs+NNRTIs',
      piMutationCount: 0,
      nrtiMutationCount: 1,
      nnrtiMutationCount: 0,
    });
    
    const result = await predictResistance(payload);
    console.log('✅ Prediction received:', result);
  } catch (err) {
    console.error('❌ Prediction failed:', err.message);
  }
};
```

---

## 🐛 Debugging Tips

### Enable Console Logging
```javascript
// In apiService.js, add detailed logging
console.log('🔄 Fetching:', `${API_BASE_URL}/endpoint`);
console.log('📤 Payload:', JSON.stringify(payload, null, 2));
```

### Check Network Tab
Use Expo DevTools or Chrome DevTools to inspect:
- Network requests/responses
- Payload sent
- Response received
- Status codes

### Validate Responses
```javascript
const result = await predictResistance(data);
console.log('Response keys:', Object.keys(result));
console.log('Full response:', JSON.stringify(result, null, 2));
```

---

## 📱 Screen Workflow

### Adherence Dashboard Flow
1. Component loads
2. Calls `getAdherenceHistory()` + `predictAdherenceRiskFromLogs()` in parallel
3. Displays risk meter, stats, charts
4. User selects time period
5. Data refreshes for selected period
6. User can navigate to log dose or analytics

### Analytics Flow
1. Component loads with patientId
2. Fetches prediction history or adherence history based on tab
3. Processes data into chart format
4. Displays statistics and trends
5. User can switch tabs or adjust date range
6. Charts update accordingly

### Resistance Prediction Flow
1. User enters patient data or loads preset
2. Clicks "Run Prediction"
3. API processes data through ML model
4. Results displayed with recommendations
5. User can save results or create new prediction

---

## 📝 Notes

- ✅ All API calls are async/await based
- ✅ Error handling is built into each hook
- ✅ Loading states are provided
- ✅ Response caching reduces API calls
- ✅ Date handling is normalized to YYYY-MM-DD
- ✅ All components are dark-mode aware

---

## 🚀 Next Steps

1. **Update Navigation** - Add screens to your navigator
2. **Configure API URL** - Set your backend address
3. **Test Connection** - Verify API is accessible
4. **Integrate Hooks** - Use in your components
5. **Customize UI** - Adjust colors/styles as needed
6. **Deploy** - Push to production

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Network errors | Check API_BASE_URL, verify backend is running |
| Loading stuck | Check network tab, verify API response |
| Data not showing | Check console logs, validate API response format |
| Charts empty | Ensure data has correct format, check filtering |
| Predictions fail | Validate all required fields are filled |

---

**Version**: 1.0.0  
**Last Updated**: March 2026
