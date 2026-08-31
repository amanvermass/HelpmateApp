import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { initialPayouts, PayoutRecord } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import { Wallet, CheckCircle2, CreditCard, ArrowUpRight, DollarSign, Building2 } from 'lucide-react-native';

export const PayoutsScreen: React.FC = () => {
  const [payouts] = useState<PayoutRecord[]>(initialPayouts);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBox}>
        <Text style={styles.pageTitle}>Wallet & Payouts</Text>
        <Text style={styles.pageSubtitle}>Weekly bank settlements & lifetime earnings history</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Main Wallet Balance Card */}
        <View style={styles.walletMainCard}>
          <View style={styles.walletHeaderRow}>
            <View style={styles.walletIconCircle}>
              <Wallet size={24} color={colors.card} />
            </View>
            <View style={styles.settlementPill}>
              <CheckCircle2 size={12} color={colors.emeraldText} />
              <Text style={styles.settlementPillText}>Auto Weekly Settlement</Text>
            </View>
          </View>

          <Text style={styles.walletLabel}>Ready For Next Payout</Text>
          <Text style={styles.walletBalanceText}>₹6,450</Text>
          <Text style={styles.nextPayoutDateText}>Next Auto Transfer: Monday, 03 Aug 2026</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Lifetime */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Lifetime Payouts</Text>
            <Text style={styles.statValue}>₹1,84,200</Text>
            <Text style={styles.statSub}>148 Completed Jobs</Text>
          </View>

          {/* Registered Bank */}
          <View style={styles.statCard}>
            <View style={styles.bankHeaderRow}>
              <Building2 size={16} color={colors.primary} />
              <Text style={styles.statLabel}>Registered Bank</Text>
            </View>
            <Text style={styles.bankNameText}>HDFC Bank Ltd</Text>
            <Text style={styles.bankAcText}>A/C: •••• 4910</Text>
            <Text style={styles.bankIfscText}>IFSC: HDFC0001820</Text>
          </View>
        </View>

        {/* Settlement Records List Header */}
        <Text style={styles.sectionTitle}>Settlement History</Text>

        {payouts.map((record) => (
          <View key={record.id} style={styles.payoutCard}>
            <View style={styles.payoutHeader}>
              <Text style={styles.payoutIdText}>{record.id}</Text>
              <View style={styles.statusSettledTag}>
                <CheckCircle2 size={12} color={colors.emeraldText} />
                <Text style={styles.statusSettledText}>{record.status}</Text>
              </View>
            </View>

            <Text style={styles.cycleText}>{record.payoutDate}</Text>
            <Text style={styles.jobsCountText}>{record.completedJobsCount} Jobs Completed</Text>

            {/* Breakdown box */}
            <View style={styles.breakdownBox}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Gross Collection</Text>
                <Text style={styles.breakdownValue}>₹{record.grossAmount}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Platform Cut (25%)</Text>
                <Text style={styles.platformCutText}>-₹{record.commissionCut}</Text>
              </View>
              <View style={[styles.breakdownRow, styles.netRow]}>
                <Text style={styles.netLabel}>Net Credited Amount (75%)</Text>
                <View style={styles.netValueRow}>
                  <Text style={styles.netValue}>₹{record.netPayoutAmount}</Text>
                  <ArrowUpRight size={16} color={colors.emeraldText} />
                </View>
              </View>
            </View>

            <Text style={styles.bankAccountFoot}>Credited to: {record.bankAccount}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBox: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  walletMainCard: {
    backgroundColor: '#059669', // Vibrant emerald
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    ...shadow.md,
  },
  walletHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  walletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settlementPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  settlementPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  walletLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ecfdf5',
  },
  walletBalanceText: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.card,
    marginVertical: 4,
  },
  nextPayoutDateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ecfdf5',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  statSub: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  bankHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  bankNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bankAcText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.textSecondary,
    marginTop: 2,
  },
  bankIfscText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  payoutCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadow.sm,
  },
  payoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  payoutIdText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.primary,
  },
  statusSettledTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusSettledText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  cycleText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  jobsCountText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  breakdownBox: {
    backgroundColor: colors.inputBg,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  breakdownLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  platformCutText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.rose,
  },
  netRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
    marginTop: 4,
  },
  netLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  netValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  netValue: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  bankAccountFoot: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
