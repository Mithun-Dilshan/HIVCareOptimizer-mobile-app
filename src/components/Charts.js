import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';

/**
 * Simple Bar Chart Component
 * Used for displaying adherence rates, risk meters, etc.
 */
export const BarChart = ({ data, height = 200, barColor = COLORS.primary }) => {
  const { width } = Dimensions.get('window');
  const chartWidth = width - 40;
  const maxValue = Math.max(...data.map(d => d.value), 100);
  const barWidth = chartWidth / (data.length * 1.5);

  return (
    <View style={styles.chartContainer}>
      <View style={[styles.barChartArea, { height }]}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 30);
          return (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    width: barWidth,
                    backgroundColor: item.color || barColor,
                  },
                ]}
              />
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

/**
 * Linear Progress Chart (for time-series data)
 * Shows adherence over days/weeks
 */
export const LineChart = ({ data, height = 200, lineColor = COLORS.primary }) => {
  const { width } = Dimensions.get('window');
  const chartWidth = width - 40;
  const maxValue = Math.max(...data.map(d => d.value), 100);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * chartWidth,
    y: height - ((item.value - minValue) / range) * height + 20,
    label: item.label,
    value: item.value,
  }));

  const pathString = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <View style={styles.chartContainer}>
      <View style={[styles.lineChartArea, { height }]}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((val, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              bottom: val * height,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: '#e0e0e0',
            }}
          />
        ))}

        {/* Data points */}
        {points.map((point, index) => (
          <View
            key={index}
            style={{
              position: 'absolute',
              left: point.x - 4,
              top: point.y - 4,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: lineColor,
            }}
          />
        ))}

        {/* Labels at bottom */}
        <View style={styles.lineChartLabels}>
          {points.map((point, index) => (
            <Text
              key={index}
              style={[
                styles.pointLabel,
                {
                  position: 'absolute',
                  left: point.x - 15,
                  width: 30,
                },
              ]}
            >
              {point.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Circular Progress Indicator (Risk Meter)
 * Shows percentage in a circular gauge format
 */
export const CircularProgress = ({
  percentage = 50,
  size = 150,
  strokeWidth = 8,
  backgroundColor = '#e0e0e0',
  progressColor = COLORS.primary,
  label = 'Risk',
  subLabel = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View
      style={[
        styles.circularProgressContainer,
        { width: size, height: size },
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: progressColor,
            opacity: 0.3,
            borderLeftColor: 'transparent',
            borderBottomColor: 'transparent',
            borderRightColor: 'transparent',
            transform: [{ rotate: `${(percentage / 100) * 360}deg` }],
          }}
        />
        <View style={styles.circularProgressText}>
          <Text style={styles.circularPercentage}>{percentage.toFixed(0)}%</Text>
          <Text style={styles.circularLabel}>{label}</Text>
          {subLabel && <Text style={styles.circularSubLabel}>{subLabel}</Text>}
        </View>
      </View>
    </View>
  );
};

/**
 * Status Badge Component
 * Visual indicator for risk levels, adherence status, etc.
 */
export const StatusBadge = ({ status = 'LOW', size = 'medium' }) => {
  let backgroundColor, textColor, icon;

  switch (status?.toUpperCase()) {
    case 'HIGH RISK':
    case 'HIGH':
      backgroundColor = '#ff6b6b';
      textColor = '#fff';
      icon = '●';
      break;
    case 'MODERATE RISK':
    case 'MODERATE':
      backgroundColor = '#ffa500';
      textColor = '#fff';
      icon = '●';
      break;
    case 'LOW RISK':
    case 'LOW':
      backgroundColor = '#51cf66';
      textColor = '#fff';
      icon = '●';
      break;
    default:
      backgroundColor = '#95a5a6';
      textColor = '#fff';
      icon = '●';
  }

  const sizeStyles = {
    small: { paddingVertical: 4, paddingHorizontal: 10 },
    medium: { paddingVertical: 8, paddingHorizontal: 16 },
    large: { paddingVertical: 12, paddingHorizontal: 24 },
  };

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor },
        sizeStyles[size] || sizeStyles.medium,
      ]}
    >
      <Text style={[styles.statusBadgeText, { color: textColor }]}>
        {icon} {status}
      </Text>
    </View>
  );
};

/**
 * Timeline Component
 * Shows adherence events over time
 */
export const TimelineItem = ({
  date,
  adherenceRate,
  status,
  details,
  isMissed = false,
}) => {
  return (
    <View style={styles.timelineItem}>
      <View
        style={[
          styles.timelineMarker,
          { backgroundColor: isMissed ? '#ff6b6b' : '#51cf66' },
        ]}
      />
      <View style={styles.timelineContent}>
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineDate}>{date}</Text>
          {adherenceRate && (
            <Text style={styles.timelineRate}>{(adherenceRate * 100).toFixed(0)}%</Text>
          )}
        </View>
        {status && <Text style={styles.timelineStatus}>{status}</Text>}
        {details && <Text style={styles.timelineDetails}>{details}</Text>}
      </View>
    </View>
  );
};

/**
 * Stats Card with Icon
 */
export const StatsCard = ({
  icon,
  label,
  value,
  unit = '',
  description,
  color = COLORS.primary,
}) => {
  return (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsCardHeader}>
        <Text style={[styles.statsCardIcon, { color }]}>{icon}</Text>
        <Text style={styles.statsCardLabel}>{label}</Text>
      </View>
      <Text style={styles.statsCardValue}>
        {value}
        {unit && <Text style={styles.statsCardUnit}>{unit}</Text>}
      </Text>
      {description && <Text style={styles.statsCardDescription}>{description}</Text>}
    </View>
  );
};

/**
 * Adherence Week View
 * Shows yes/no for each day
 */
export const AdherenceWeekView = ({ data = [] }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <View style={styles.weekContainer}>
      {days.map((day, index) => {
        const isAdherent = data[index]?.taken || false;
        return (
          <View key={day} style={styles.dayBox}>
            <Text style={styles.dayLabel}>{day}</Text>
            <View
              style={[
                styles.dayIndicator,
                {
                  backgroundColor: isAdherent ? '#51cf66' : '#ff6b6b',
                },
              ]}
            >
              <Text style={styles.dayIndicatorText}>
                {isAdherent ? '✓' : '✗'}
              </Text>
            </View>
            {data[index]?.date && (
              <Text style={styles.dayDate}>
                {new Date(data[index].date).getDate()}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  barChartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    marginHorizontal: 4,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 8,
    color: '#666',
    fontWeight: '500',
  },
  lineChartArea: {
    position: 'relative',
    marginBottom: 40,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  lineChartLabels: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -35,
    left: 0,
    right: 0,
    height: 30,
  },
  pointLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  circularProgressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  circularLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  circularSubLabel: {
    fontSize: 10,
    color: '#999',
  },
  statusBadge: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusBadgeText: {
    fontWeight: '600',
    fontSize: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timelineMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineDate: {
    fontWeight: '600',
    fontSize: 12,
    color: '#333',
  },
  timelineRate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  timelineStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  timelineDetails: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsCardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statsCardLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statsCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsCardUnit: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  statsCardDescription: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayBox: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  dayIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayIndicatorText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dayDate: {
    fontSize: 9,
    color: '#999',
  },
});
