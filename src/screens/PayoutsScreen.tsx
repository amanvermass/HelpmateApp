import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { initialPayouts, PayoutRecord } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import { Wallet, CheckCircle2, ArrowUpRight, Building2, Eye, ChevronRight } from 'lucide-react-native';
import { PayoutDetailsModal } from '../components/PayoutDetailsModal';

export const PayoutsScreen: React.FC = () => {
  const [payouts] = useState<PayoutRecord[]>(initialPayouts);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRecord | null>(null);

  return (
    <View style={styles.safeArea}>
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
              <Building2 size={16} color={colors.brand500} />
              <Text style={styles.statLabel}>Registered Bank</Text>
            </View>
            <Text style={styles.bankNameText}>HDFC Bank Ltd</Text>
            <Text style={styles.bankAcText}>A/C: •••• 4910</Text>
            <Text style={styles.bankIfscText}>IFSC: HDFC0001820</Text>
          </View>
        </View>

        {/* Settlement Records List Header */}
        <Text style={styles.sectionTitle}>Settlement History (Tap for Details)</Text>

        {payouts.map((record) => (
          <TouchableOpacity
            key={record.id}
            style={styles.payoutCard}
            onPress={() => setSelectedPayout(record)}
            activeOpacity={0.8}
          >
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

            <View style={styles.payoutFooterRow}>
              <Text style={styles.bankAccountFoot}>Credited to: {record.bankAccount}</Text>
              <View style={styles.viewDetailsLink}>
                <Eye size={12} color={colors.brand500} />
                <Text style={styles.viewDetailsText}>View Statement</Text>
                <ChevronRight size={14} color={colors.brand500} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Payout Details Modal */}
        <PayoutDetailsModal
          visible={!!selectedPayout}
          payout={selectedPayout}
          onClose={() => setSelectedPayout(null)}
        />
      </ScrollView>
    </View>
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
    paddingTop: 12,
    paddingBottom: 12,
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
    paddingVertical: 14,
  },
  walletMainCard: {
    backgroundColor: colors.brand500,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    ...shadow.md,
  },
  walletHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  walletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    borderRadius: 12,
  },
  settlementPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  walletLabel: {
    fontSize: 12,
    color: colors.brand200,
    fontWeight: '600',
  },
  walletBalanceText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.card,
    marginVertical: 2,
  },
  nextPayoutDateText: {
    fontSize: 11,
    color: colors.brand50,
    fontWeight: '600',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
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
    marginTop: 4,
  },
  statSub: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  bankHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bankNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  bankAcText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 1,
  },
  bankIfscText: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  payoutCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
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
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
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
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  jobsCountText: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 10,
  },
  breakdownBox: {
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  platformCutText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.rose,
  },
  netRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
    marginTop: 4,
    marginBottom: 0,
  },
  netLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  netValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  netValue: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  payoutFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  bankAccountFoot: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  viewDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewDetailsText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brand500,
  },
});
