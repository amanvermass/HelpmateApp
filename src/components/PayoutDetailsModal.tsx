import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { PayoutRecord } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import {
  X,
  Wallet,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  Download,
  Calendar,
  Percent,
  CheckCircle,
  FileText,
} from 'lucide-react-native';

interface PayoutDetailsModalProps {
  visible: boolean;
  payout: PayoutRecord | null;
  onClose: () => void;
}

export const PayoutDetailsModal: React.FC<PayoutDetailsModalProps> = ({
  visible,
  payout,
  onClose,
}) => {
  if (!payout) return null;

  const handleDownloadReceipt = () => {
    Alert.alert(
      'Download Receipt',
      `Official Settlement Statement PDF for ${payout.id} has been generated.`,
      [{ text: 'OK' }]
    );
  };

  // Mock list of jobs included in this payout
  const mockSettledJobs = [
    { id: 'JOB-901', title: 'Power Jet AC Servicing', customer: 'Aarav Sharma', gross: 699, net: 524 },
    { id: 'JOB-902', title: 'AC Gas Leakage Refill R32', customer: 'Sunil Malhotra', gross: 2499, net: 1874 },
    { id: 'JOB-903', title: 'AC PCB Circuit Repair', customer: 'Priya Singh', gross: 1499, net: 1124 },
    { id: 'JOB-904', title: '3-Phase MCB Repair', customer: 'Rajesh Verma', gross: 499, net: 374 },
    { id: 'JOB-905', title: 'Dual Capacitor Fitting', customer: 'Vivek Gupta', gross: 450, net: 338 },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <View style={styles.headerBadgeRow}>
                <View style={styles.payoutBadge}>
                  <Wallet size={12} color={colors.emeraldText} />
                  <Text style={styles.payoutBadgeText}>Weekly Auto Payout</Text>
                </View>
                <View style={styles.statusSettledTag}>
                  <CheckCircle2 size={12} color={colors.emeraldText} />
                  <Text style={styles.statusSettledText}>{payout.status}</Text>
                </View>
              </View>
              <Text style={styles.payoutIdText}>{payout.id}</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <X size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Amount Credited Card */}
            <View style={styles.amountCard}>
              <Text style={styles.amountLabel}>Total Net Share Credited (75%)</Text>
              <View style={styles.amountRow}>
                <Text style={styles.amountVal}>₹{payout.netPayoutAmount}</Text>
                <ArrowUpRight size={22} color={colors.emeraldText} />
              </View>
              <Text style={styles.amountSubText}>
                Transferred on {payout.payoutDate.split('(')[0].trim()}
              </Text>
            </View>

            {/* Bank Details Box */}
            <View style={styles.infoCard}>
              <Text style={styles.cardSectionTitle}>Destination Bank Account</Text>
              <View style={styles.bankRow}>
                <Building2 size={20} color={colors.brand500} />
                <View style={styles.bankTextCol}>
                  <Text style={styles.bankNameText}>{payout.bankAccount}</Text>
                  <Text style={styles.utrText}>Ref UTR: UTR-HDFC-9941820104</Text>
                </View>
              </View>
            </View>

            {/* Financial Breakdown Table */}
            <View style={styles.infoCard}>
              <Text style={styles.cardSectionTitle}>Financial Settlement Breakdown</Text>

              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Gross Customer Collection ({payout.completedJobsCount} Jobs)</Text>
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
                <Text style={styles.totalLabel}>Net Bank Transfer (75%)</Text>
                <Text style={styles.totalVal}>₹{payout.netPayoutAmount}</Text>
              </View>
            </View>

            {/* Settled Jobs List */}
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

          {/* Modal Footer Actions */}
          <View style={styles.modalFooter}>
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  payoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  payoutBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emeraldText,
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
  payoutIdText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
  },
  scrollBody: {
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
    fontSize: 28,
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
    fontSize: 14,
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
    paddingVertical: 8,
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
  modalFooter: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  downloadBtn: {
    backgroundColor: colors.brand500,
    borderRadius: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadow.lux,
  },
  downloadBtnText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '800',
  },
});
