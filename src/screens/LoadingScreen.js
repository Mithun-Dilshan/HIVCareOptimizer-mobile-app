// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { COLORS } from '../constants/colors';

// const LoadingScreen = ({ navigation, route }) => {
//   const { patientData } = route.params;
//   const [progress, setProgress] = useState(0);
//   const [status, setStatus] = useState('Processing patient data...');

//   useEffect(() => {
//     const steps = [
//       { progress: 25, status: 'Processing patient data...', delay: 500 },
//       { progress: 50, status: 'Analyzing mutations...', delay: 1000 },
//       { progress: 75, status: 'Predicting resistance risk...', delay: 1500 },
//       { progress: 100, status: 'Generating recommendations...', delay: 2000 },
//     ];

//     steps.forEach(({ progress, status, delay }) => {
//       setTimeout(() => {
//         setProgress(progress);
//         setStatus(status);
//       }, delay);
//     });

//     setTimeout(() => {
//       // Calculate risk score
//       const totalMutations = patientData.PI_MU + patientData.NRTI_MU + patientData.NNRTI_MU;
//       const riskScore = Math.min(0.98, (totalMutations / 20) * 0.8 + 0.15);
      
//       const results = {
//         ...patientData,
//         totalMutations,
//         riskScore,
//         riskLevel: riskScore >= 0.7 ? 'High Risk' : riskScore >= 0.4 ? 'Moderate Risk' : 'Low Risk',
//         recommendation: riskScore >= 0.5 ? 'CHANGE ART REGIMEN' : 'CONTINUE CURRENT ART',
//       };

//       navigation.replace('Results', { patient: results });
//     }, 2500);
//   }, []);

//   return (
//     <View style={styles.loadingContainer}>
//       <Text style={styles.loadingIcon}>🤖</Text>
//       <Text style={styles.loadingTitle}>AI Analysis</Text>
//       <Text style={styles.loadingSubtitle}>In Progress...</Text>

//       <View style={styles.progressBarContainer}>
//         <View style={[styles.progressBar, { width: `${progress}%` }]} />
//       </View>
//       <Text style={styles.progressText}>{progress}%</Text>

//       <View style={styles.statusContainer}>
//         <Text style={styles.statusText}>{status}</Text>
//       </View>

//       <Text style={styles.loadingFooter}>Please wait 5-10 seconds</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     padding: 20,
//   },
//   loadingIcon: {
//     fontSize: 80,
//     marginBottom: 20,
//   },
//   loadingTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: COLORS.text,
//     marginBottom: 10,
//   },
//   loadingSubtitle: {
//     fontSize: 18,
//     color: COLORS.textSecondary,
//     marginBottom: 40,
//   },
//   progressBarContainer: {
//     width: '80%',
//     height: 8,
//     backgroundColor: COLORS.border,
//     borderRadius: 4,
//     overflow: 'hidden',
//     marginBottom: 15,
//   },
//   progressBar: {
//     height: '100%',
//     backgroundColor: COLORS.primary,
//     borderRadius: 4,
//   },
//   progressText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//     marginBottom: 30,
//   },
//   statusContainer: {
//     padding: 15,
//     backgroundColor: COLORS.lightBlue,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   statusText: {
//     fontSize: 16,
//     color: COLORS.text,
//     textAlign: 'center',
//   },
//   loadingFooter: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     marginTop: 20,
//   },
// });

// export default LoadingScreen;


import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';

const LoadingScreen = ({ navigation, route }) => {
  const { patientData } = route.params;
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Processing patient data...');
  
  // Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideValue = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Rotate animation for the AI icon
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Slide up animation
    Animated.timing(slideValue, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const steps = [
      { progress: 25, status: 'Processing patient data...', delay: 500 },
      { progress: 50, status: 'Analyzing mutations...', delay: 1000 },
      { progress: 75, status: 'Predicting resistance risk...', delay: 1500 },
      { progress: 100, status: 'Generating recommendations...', delay: 2000 },
    ];

    steps.forEach(({ progress, status, delay }) => {
      setTimeout(() => {
        setProgress(progress);
        setStatus(status);
        
        // Animate progress bar
        Animated.timing(progressAnim, {
          toValue: progress,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      }, delay);
    });

    setTimeout(() => {
      // Calculate risk score
      const totalMutations = patientData.PI_MU_Count + patientData.NRTI_MU_Count + patientData.NNRTI_MU_Count;
      const riskScore = Math.min(0.98, (totalMutations / 20) * 0.8 + 0.15);
      
      const results = {
        ...patientData,
        totalMutations,
        riskScore,
        riskLevel: riskScore >= 0.7 ? 'High Risk' : riskScore >= 0.4 ? 'Moderate Risk' : 'Low Risk',
        recommendation: riskScore >= 0.5 ? 'CHANGE ART REGIMEN' : 'CONTINUE CURRENT ART',
      };

      navigation.replace('Results', { patient: results });
    }, 2500);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.loadingContainer}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: fadeValue,
            transform: [
              { scale: pulseValue },
              { rotate: spin },
              { translateY: slideValue },
            ],
          },
        ]}
      >
        <View style={styles.iconBackground}>
          <Icon name="robot" size={60} color={COLORS.white} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeValue,
            transform: [{ translateY: slideValue }],
          },
        ]}
      >
        <Text style={styles.loadingTitle}>AI Analysis</Text>
        <Text style={styles.loadingSubtitle}>In Progress...</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.progressSection,
          {
            opacity: fadeValue,
          },
        ]}
      >
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
              },
            ]}
          >
            <View style={styles.progressShine} />
          </Animated.View>
        </View>
        
        <View style={styles.progressTextContainer}>
          <Icon name="chart-line" size={20} color={COLORS.primary} />
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        <View style={styles.statusContainer}>
          <Icon name="cog" size={20} color={COLORS.primary} style={styles.statusIcon} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.footerContainer,
          {
            opacity: fadeValue,
          },
        ]}
      >
        <Icon name="clock-outline" size={16} color={COLORS.textSecondary} />
        <Text style={styles.loadingFooter}>Please wait 5-10 seconds</Text>
      </Animated.View>

      {/* Decorative elements */}
      <View style={styles.decorativeDotsContainer}>
        {[0, 1, 2].map((index) => (
          <DecorativeDot key={index} delay={index * 200} />
        ))}
      </View>
    </View>
  );
};

const DecorativeDot = ({ delay }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 0.3,
            duration: 750,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 1.5,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: 750,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.decorativeDot,
        {
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '85%',
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  statusIcon: {
    marginRight: 0,
  },
  statusText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
    fontWeight: '500',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  loadingFooter: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  decorativeDotsContainer: {
    position: 'absolute',
    top: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeDot: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
});

export default LoadingScreen;