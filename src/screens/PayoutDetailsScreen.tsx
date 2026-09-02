import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, shadow } from '../styles/theme';
import {
  ArrowLeft,
  Wallet,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  Download,
} from 'lucide-react-native';

export const PayoutDetailsScreen: React.FC = () => {
  const { selectedPayoutForDetails, setSelectedPayoutForDetails } = useAuth();
  const payout = selectedPayoutForDetails;

  if (!payout) return null;

  const handleDownloadReceipt = () => {
    Alert.alert(
      'Download Statement PDF',
      `Official Settlement Statement PDF for ${payout.id} has been generated and saved to your device downloads.`,
      [{ text: 'OK' }]
    );
  };

  // Mock list of jobs included in this payout
  const mockSettledJobs = [
    { id: 'JOB-VAR-2026-101', title: 'Power Jet AC Servicing', customer: 'Aarav Sharma', gross: 699, net: 524 },
    { id: 'JOB-VAR-2026-102', title: 'AC Gas Leakage Refill R32', customer: 'Sunil Malhotra', gross: 2499, net: 1874 },
    { id: 'JOB-VAR-2026-103', title: 'AC PCB Circuit Repair', customer: 'Priya Singh', gross: 1499, net: 1124 },
    { id: 'JOB-VAR-2026-104', title: '3-Phase MCB Repair', customer: 'Rajesh Verma', gross: 499, net: 374 },
    { id: 'JOB-VAR-2026-105', title: 'Dual Capacitor Fitting', customer: 'Vivek Gupta', gross: 450, net: 338 },
  ];

  return (
    <View style={styles.safeArea}>
      {/* Top Header Bar with Back Button & Prominent Payout ID */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setSelectedPayoutForDetails(null)}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerPayoutId}>{payout.id}</Text>
          <Text style={styles.headerSubText}>{payout.payoutDate.split('(')[0].trim()}</Text>
        </View>

        <View style={styles.statusTag}>
          <CheckCircle2 size={12} color={colors.emeraldText} />
          <Text style={styles.statusTagText}>{payout.status}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Amount Credited Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Net Share Credited (75%)</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountVal}>₹{payout.netPayoutAmount}</Text>
            <ArrowUpRight size={24} color={colors.emeraldText} />
          </View>
          <Text style={styles.amountSubText}>
            Directly Credited via IMPS on {payout.payoutDate.split('(')[0].trim()}
          </Text>
        </View>

        {/* Bank Account Information */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Destination Bank Account</Text>
          <View style={styles.bankRow}>
            <Building2 size={22} color={colors.brand500} />
            <View style={styles.bankTextCol}>
              <Text style={styles.bankNameText}>{payout.bankAccount}</Text>
              <Text style={styles.utrText}>Bank Reference UTR: UTR-HDFC-9941820104</Text>
            </View>
          </View>
        </View>

        {/* Financial Settlement Breakdown */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Financial Settlement Breakdown</Text>

          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Gross Collection ({payout.completedJobsCount} Jobs)</Text>
            <Text style={styles.calcVal}>₹{payout.grossAmount}</Text>
          </View>

          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Platform Service Cut (25%)</Text>
            <Text style={styles.cutVal}>-₹{payout.commissionCut}</Text>
          </View>

          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>TDS / Tax Withheld</Text>
            <Text style={styles.calcVal}>₹0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.calcRow}>
            <Text style={styles.totalLabel}>Net Credited Amount (75%)</Text>
            <Text style={styles.totalVal}>₹{payout.netPayoutAmount}</Text>
          </View>
        </View>

        {/* Included Jobs List */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Included Jobs ({payout.completedJobsCount} Jobs)</Text>

          {mockSettledJobs.map((jobItem) => (
            <View key={jobItem.id} style={styles.jobItemRow}>
              <View style={styles.jobItemInfo}>
                <Text style={styles.jobItemTitle}>{jobItem.title}</Text>
                <Text style={styles.jobItemCustomer}>
                  {jobItem.customer} • #{jobItem.id}
                </Text>
              </View>
              <View style={styles.jobItemAmountCol}>
                <Text style={styles.jobItemNet}>₹{jobItem.net}</Text>
                <Text style={styles.jobItemGross}>Gross: ₹{jobItem.gross}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Page Footer Action */}
      <View style={styles.bottomFooter}>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={handleDownloadReceipt}
          activeOpacity={0.8}
        >
          <Download size={18} color={colors.card} />
          <Text style={styles.downloadBtnText}>Download Settlement Statement (PDF)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerPayoutId: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  headerSubText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  scrollContent: {
    padding: 16,
  },
  amountCard: {
    backgroundColor: colors.emeraldLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.emeraldBorder,
    marginBottom: 14,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.emeraldText,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  amountVal: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  amountSubText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.emeraldText,
    opacity: 0.9,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadow.sm,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankTextCol: {
    flex: 1,
  },
  bankNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  utrText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  calcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calcLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  calcVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cutVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.rose,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  jobItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  jobItemInfo: {
    flex: 1,
    marginRight: 10,
  },
  jobItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  jobItemCustomer: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  jobItemAmountCol: {
    alignItems: 'flex-end',
  },
  jobItemNet: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  jobItemGross: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  bottomFooter: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  downloadBtn: {
    backgroundColor: colors.brand500,
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadow.lux,
  },
  downloadBtnText: {
    color: colors.card,
    fontSize: 15,
    fontWeight: '800',
  },
});
