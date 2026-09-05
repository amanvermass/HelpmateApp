import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../styles/theme';

export const ShimmerBox: React.FC<{
  width?: number | `${number}%` | 'auto';
  height?: number;
  borderRadius?: number;
  style?: any;
}> = ({ width = '100%', height = 16, borderRadius = 8, style }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 750,
          useNativeDriver: false,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 750,
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  // Smooth 100% neutral silver grey to light grey transition (No pink/magenta tinting)
  const animatedBg = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e5e7eb', '#cbd5e1'],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: animatedBg,
        },
        style,
      ]}
    />
  );
};

export const ShimmerJobCard: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.rowBetween}>
        <ShimmerBox width={80} height={14} borderRadius={6} />
        <ShimmerBox width={65} height={18} borderRadius={8} />
      </View>
      <View style={{ marginTop: 10 }}>
        <ShimmerBox width="70%" height={18} borderRadius={6} />
      </View>
      <View style={{ marginTop: 8 }}>
        <ShimmerBox width="50%" height={14} borderRadius={6} />
      </View>
      <View style={{ marginTop: 10 }}>
        <ShimmerBox width="90%" height={12} borderRadius={4} />
      </View>

      <View style={[styles.rowBetween, { marginTop: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border }]}>
        <ShimmerBox width={90} height={24} borderRadius={6} />
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <ShimmerBox width={36} height={36} borderRadius={10} />
          <ShimmerBox width={36} height={36} borderRadius={10} />
          <ShimmerBox width={70} height={36} borderRadius={10} />
        </View>
      </View>
    </View>
  );
};

export const ShimmerKpiGrid: React.FC = () => {
  return (
    <View style={styles.kpiGrid}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.kpiCard}>
          <ShimmerBox width="60%" height={12} borderRadius={4} />
          <View style={{ marginVertical: 8 }}>
            <ShimmerBox width="80%" height={22} borderRadius={6} />
          </View>
          <ShimmerBox width="50%" height={10} borderRadius={4} />
        </View>
      ))}
    </View>
  );
};

export const ShimmerPayoutCard: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.rowBetween}>
        <ShimmerBox width={90} height={16} borderRadius={6} />
        <ShimmerBox width={60} height={16} borderRadius={8} />
      </View>
      <View style={{ marginTop: 10 }}>
        <ShimmerBox width="60%" height={12} borderRadius={4} />
      </View>
      <View style={{ marginTop: 12 }}>
        <ShimmerBox width="100%" height={60} borderRadius={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
