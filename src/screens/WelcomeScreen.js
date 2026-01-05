// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   StatusBar,
// } from 'react-native';
// import { COLORS } from '../constants/colors';

// const WelcomeScreen = ({ navigation }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('Login');
//     }, 2500);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
//       <Text style={styles.icon}>🧬</Text>
//       <Text style={styles.title}>HIV Care</Text>
//       <Text style={styles.subtitle}>Optimizer</Text>
//       <Text style={styles.tagline}>AI-Powered Treatment Prediction System</Text>
//       <ActivityIndicator
//         size="large"
//         color={COLORS.white}
//         style={styles.loader}
//       />
//       <Text style={styles.footer}>For Healthcare Professionals</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   icon: {
//     fontSize: 80,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 42,
//     fontWeight: 'bold',
//     color: COLORS.white,
//   },
//   subtitle: {
//     fontSize: 38,
//     fontWeight: 'bold',
//     color: COLORS.white,
//     marginBottom: 15,
//   },
//   tagline: {
//     fontSize: 16,
//     color: COLORS.white,
//     opacity: 0.9,
//     textAlign: 'center',
//     paddingHorizontal: 40,
//   },
//   loader: {
//     marginTop: 30,
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 30,
//     fontSize: 14,
//     color: COLORS.white,
//     opacity: 0.8,
//   },
// });

// export default WelcomeScreen;


import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/colors';

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const logoGlowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Text slide up animation
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 800,
      delay: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
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

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(logoGlowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = logoGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Animated Background Circles */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      <View style={styles.backgroundCircle3} />

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
        {/* Glow Effect */}
        <Animated.View
          style={[
            styles.logoGlow,
            {
              opacity: glowOpacity,
            },
          ]}
        />
        
        {/* Main Logo */}
        <View style={styles.logoBackground}>
          <Icon name="dna" size={70} color={COLORS.white} />
        </View>
        
        {/* Outer Rings */}
        <View style={styles.logoRing1} />
        <View style={styles.logoRing2} />
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <Text style={styles.title}>HIV Care</Text>
        <Text style={styles.subtitle}>Optimizer</Text>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Icon name="pulse" size={20} color={COLORS.white} />
          <View style={styles.divider} />
        </View>
        
        <View style={styles.taglineContainer}>
          <Icon name="robot" size={18} color={COLORS.white} style={styles.taglineIcon} />
          <Text style={styles.tagline}>AI-Powered Treatment Prediction System</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Icon name="shield-check-outline" size={20} color={COLORS.white} />
            <Text style={styles.featureText}>Secure</Text>
          </View>
          <View style={styles.featureDot} />
          <View style={styles.featureItem}>
            <Icon name="lightning-bolt-outline" size={20} color={COLORS.white} />
            <Text style={styles.featureText}>Fast</Text>
          </View>
          <View style={styles.featureDot} />
          <View style={styles.featureItem}>
            <Icon name="chart-line" size={20} color={COLORS.white} />
            <Text style={styles.featureText}>Accurate</Text>
          </View>
        </View>

        {/* Custom Loading Indicator */}
        <View style={styles.loaderContainer}>
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((index) => (
              <LoadingDot key={index} delay={index * 200} />
            ))}
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
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
        <View style={styles.footerBadge}>
          <Icon name="medical-bag" size={16} color={COLORS.white} />
          <Text style={styles.footer}>For Healthcare Professionals</Text>
        </View>
        <Text style={styles.copyright}>© 2026 HIV Care Optimizer</Text>
      </Animated.View>
    </View>
  );
};

const LoadingDot = ({ delay }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View
      style={[
        styles.loadingDot,
        {
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundCircle1: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  backgroundCircle3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    marginLeft: -250,
    marginTop: -250,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.white,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  logoRing1: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoRing2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.white,
    opacity: 0.6,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  taglineIcon: {
    marginRight: 8,
    opacity: 0.9,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.9,
    fontWeight: '600',
  },
  featureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.white,
    opacity: 0.5,
  },
  loaderContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    fontWeight: '500',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  footer: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  copyright: {
    fontSize: 11,
    color: COLORS.white,
    opacity: 0.6,
  },
});

export default WelcomeScreen;