import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { initialPayouts, PayoutRecord } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import { Wallet, CheckCircle2, ArrowUpRight, Building2, Eye, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export const PayoutsScreen: React.FC = () => {
  const { setSelectedPayoutForDetails } = useAuth();
  const [payouts, setPayouts] = useState<PayoutRecord[]>(initialPayouts);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setPayouts(initialPayouts);
      setRefreshing(false);
    }, 600);
  }, []);

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerBox}>
        <Text style={styles.pageTitle}>Wallet & Payouts</Text>
        <Text style={styles.pageSubtitle}>Weekly bank settlements & lifetime earnings history</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.brand500]}
            tintColor={colors.brand500}
          />
        }
      >
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
            <Text style={styles.statSub}>A/C: •••• 4910</Text>
          </View>
        </View>

        {/* Payout Settlements List */}
        <Text style={styles.sectionHeaderTitle}>Payout Statements</Text>

        {payouts.map((record) => (
          <TouchableOpacity
            key={record.id}
            style={styles.statementCard}
            onPress={() => setSelectedPayoutForDetails(record)}
            activeOpacity={0.9}
          >
            <View style={styles.statementHeader}>
              <View style={styles.payoutIdRow}>
                <Text style={styles.payoutIdText}>#{record.id}</Text>
                <View style={styles.settledBadge}>
                  <CheckCircle2 size={12} color={colors.emeraldText} />
                  <Text style={styles.settledBadgeText}>{record.status}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewDetailsBtn}
                onPress={() => setSelectedPayoutForDetails(record)}
              >
                <Eye size={14} color={colors.brand500} />
                <Text style={styles.viewDetailsText}>View Statement</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.payoutDateText}>{record.payoutDate}</Text>

            {/* Financial Breakdown Row */}
            <View style={styles.financialRow}>
              <View style={styles.finCol}>
                <Text style={styles.finLabel}>Gross Total ({record.completedJobsCount} Jobs)</Text>
                <Text style={styles.finGrossValue}>₹{record.grossAmount.toLocaleString()}</Text>
              </View>

              <View style={styles.finColRight}>
                <Text style={styles.finLabel}>Net Transfer (75%)</Text>
                <Text style={styles.finNetValue}>₹{record.netPayoutAmount.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.bankInfoFooter}>
              <Building2 size={12} color={colors.textMuted} />
              <Text style={styles.bankInfoText}>{record.bankAccount}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 14,
    ...shadow.md,
  },
  walletHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  walletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
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
    paddingVertical: 5,
    borderRadius: 12,
  },
  settlementPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  walletLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  walletBalanceText: {
    color: colors.card,
    fontSize: 34,
    fontWeight: '900',
    marginVertical: 4,
  },
  nextPayoutDateText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '700',
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
  bankHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  bankNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  statSub: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  statementCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadow.sm,
  },
  statementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  payoutIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payoutIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
  },
  settledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  settledBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brand50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.brand200,
  },
  viewDetailsText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brand500,
  },
  payoutDateText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  financialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBg,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  finCol: {},
  finColRight: {
    alignItems: 'flex-end',
  },
  finLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  finGrossValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textSecondary,
    marginTop: 2,
  },
  finNetValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.emeraldText,
    marginTop: 2,
  },
  bankInfoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankInfoText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
