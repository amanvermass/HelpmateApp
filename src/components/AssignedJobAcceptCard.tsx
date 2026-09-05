import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Booking } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import { Clock, MapPin, CheckCircle2, XCircle, TrendingUp, BellRing } from 'lucide-react-native';

interface AssignedJobAcceptCardProps {
  booking: Booking;
  onAccept: (booking: Booking) => void;
  onDecline: (booking: Booking) => void;
}

export const AssignedJobAcceptCard: React.FC<AssignedJobAcceptCardProps> = ({
  booking,
  onAccept,
  onDecline,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(booking.dispatchTimerSeconds || 45);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline(booking); // Auto-decline when timer expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [booking]);

  const maxTime = booking.dispatchTimerSeconds || 45;
  const progressPercent = Math.max(0, (timeLeft / maxTime) * 100);

  return (
    <View style={styles.card}>
      {/* Header Alert Bar */}
      <View style={styles.headerBar}>
        <View style={styles.alertTitleRow}>
          <BellRing size={16} color={colors.amberText} />
          <Text style={styles.alertTitle}>New Assigned Job • Action Required</Text>
        </View>

        {/* Live Timer Pill */}
        <View style={styles.timerPill}>
          <Clock size={12} color={colors.amberText} />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>

      {/* Job Details */}
      <View style={styles.bodyBox}>
        <Text style={styles.jobIdText}>#{booking.id}</Text>
        <Text style={styles.serviceTitle}>{booking.serviceTitle}</Text>
        <Text style={styles.customerName}>Customer: {booking.customerName}</Text>

        <View style={styles.metaRow}>
          <MapPin size={14} color={colors.rose} />
          <Text style={styles.metaText} numberOfLines={1}>
            {booking.locality} • {booking.address}
          </Text>
        </View>

        {/* Earnings Highlight */}
        <View style={styles.earningsBox}>
          <View>
            <Text style={styles.earningsLabel}>Your Net Share (75%)</Text>
            <Text style={styles.earningsValue}>
              ₹{booking.partnerEarnings || Math.round(booking.totalAmount * 0.75)}
            </Text>
          </View>
          <View style={styles.instantTag}>
            <TrendingUp size={12} color={colors.emeraldText} />
            <Text style={styles.instantTagText}>Weekly Credit</Text>
          </View>
        </View>
      </View>

      {/* Accept & Decline Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.declineBtn}
          onPress={() => onDecline(booking)}
          activeOpacity={0.8}
        >
          <XCircle size={16} color={colors.rose} />
          <Text style={styles.declineBtnText}>DECLINE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => onAccept(booking)}
          activeOpacity={0.8}
        >
          <CheckCircle2 size={16} color={colors.card} />
          <Text style={styles.acceptBtnText}>ACCEPT JOB</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.amberBorder,
    marginBottom: 14,
    ...shadow.md,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.amberText,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.amberLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.amberBorder,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.amberText,
  },
  progressTrack: {
    height: 5,
    backgroundColor: colors.inputBg,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.amberText,
  },
  bodyBox: {
    marginBottom: 12,
  },
  jobIdText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: 2,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  earningsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.emeraldLight,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.emeraldBorder,
  },
  earningsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.emeraldText,
  },
  earningsValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  instantTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  instantTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.roseLight,
    borderWidth: 1,
    borderColor: colors.roseBorder,
    paddingVertical: 10,
    borderRadius: 12,
  },
  declineBtnText: {
    color: colors.rose,
    fontSize: 12,
    fontWeight: '900',
  },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.emeraldText,
    paddingVertical: 10,
    borderRadius: 12,
  },
  acceptBtnText: {
    color: colors.card,
    fontSize: 13,
    fontWeight: '900',
  },
});
