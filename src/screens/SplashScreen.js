// import React, { useEffect } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// import { COLORS } from '../constants/colors';

// const SplashScreen = ({ onFinish }) => {
//   useEffect(() => {
//     setTimeout(onFinish, 3000);
//   }, []);

//   return (
//     <View style={styles.splashContainer}>
//       <Text style={styles.splashIcon}>🧬</Text>
//       <Text style={styles.splashTitle}>HIV Care</Text>
//       <Text style={styles.splashSubtitle}>Optimizer</Text>
//       <Text style={styles.splashTagline}>AI-Powered Treatment Prediction System</Text>
//       <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
//       <Text style={styles.splashVersion}>Version 1.0.0</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   splashContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//   },
//   splashIcon: {
//     fontSize: 80,
//     marginBottom: 20,
//   },
//   splashTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//     marginBottom: 5,
//   },
//   splashSubtitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: COLORS.text,
//     marginBottom: 10,
//   },
//   splashTagline: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     marginBottom: 20,
//     textAlign: 'center',
//     paddingHorizontal: 40,
//   },
//   splashVersion: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//     marginTop: 20,
//   },
// });

// export default SplashScreen;

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Text slide up animation
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 800,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    setTimeout(onFinish, 3000);
  }, []);

  const rotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.splashContainer}>
      {/* Decorative background circles */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <View style={styles.logoBackground}>
          <Icon name="dna" size={70} color={COLORS.white} />
        </View>
        <View style={styles.logoRing} />
      </Animated.View>

      {/* Title and Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <Text style={styles.splashTitle}>HIV Care</Text>
        <Text style={styles.splashSubtitle}>Optimizer</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.taglineContainer}>
          <Icon name="robot" size={20} color={COLORS.primary} />
          <Text style={styles.splashTagline}>AI-Powered Treatment Prediction</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Icon name="shield-check" size={16} color={COLORS.success} />
            <Text style={styles.featureText}>Secure</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="speedometer" size={16} color={COLORS.primary} />
            <Text style={styles.featureText}>Fast</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="chart-line" size={16} color={COLORS.warning} />
            <Text style={styles.featureText}>Accurate</Text>
          </View>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  opacity: fadeAnim,
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Initializing...</Text>
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View
        style={[
          styles.footerContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.versionContainer}>
          <Icon name="information-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.splashVersion}>Version 1.0.0</Text>
        </View>
        <Text style={styles.footerText}>Powered by Advanced AI Technology</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  backgroundCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.primary,
    opacity: 0.03,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: COLORS.primary,
    opacity: 0.2,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
    letterSpacing: 1,
  },
  splashSubtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: 20,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  splashTagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
  loadingContainer: {
    width: 200,
    alignItems: 'center',
    marginTop: 10,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  splashVersion: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
});

export default SplashScreen;