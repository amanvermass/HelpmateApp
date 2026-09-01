import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Booking } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import {
  X,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  KeyRound,
  PlusCircle,
  Percent,
} from 'lucide-react-native';

interface JobDetailsModalProps {
  visible: boolean;
  job: Booking | null;
  onClose: () => void;
  onOpenOtpModal: (job: Booking) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  visible,
  job,
  onClose,
  onOpenOtpModal,
}) => {
  if (!job) return null;

  const handleCall = () => {
    Linking.openURL(`tel:${job.customerPhone}`);
  };

  const handleMap = () => {
    const query = encodeURIComponent(`${job.address}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const isCompleted = job.status === 'Completed';

  // Calculate totals
  const baseRate = job.totalAmount;
  const addOnsTotal = job.addOnsFinalTotal || 0;
  const grandTotal = baseRate + addOnsTotal;
  const partnerShare = Math.round(grandTotal * 0.75);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Top Header */}
          <View style={styles.modalHeader}>
            <View>
              <View style={styles.headerBadgeRow}>
                <View style={styles.categoryTag}>
                  <Wrench size={12} color={colors.brand500} />
                  <Text style={styles.categoryTagText}>{job.category}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    isCompleted ? styles.statusBadgeCompleted : styles.statusBadgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isCompleted ? styles.statusBadgeTextCompleted : styles.statusBadgeTextPending,
                    ]}
                  >
                    {job.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.jobIdText}>Job #{job.id}</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <X size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Service Title Banner */}
            <View style={styles.bannerBox}>
              <Text style={styles.serviceTitle}>{job.serviceTitle}</Text>
              <Text style={styles.localityText}>Location: {job.locality} Zone, Varanasi</Text>
            </View>

            {/* Scheduled Date & Time */}
            <View style={styles.infoCard}>
              <Text style={styles.cardSectionTitle}>Schedule Details</Text>
              <View style={styles.infoRow}>
                <Calendar size={16} color={colors.brand500} />
                <Text style={styles.infoText}>Date: {job.date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Clock size={16} color={colors.brand500} />
                <Text style={styles.infoText}>Time Slot: {job.timeSlot}</Text>
              </View>
            </View>

            {/* Customer Details */}
            <View style={styles.infoCard}>
              <Text style={styles.cardSectionTitle}>Customer & Address</Text>
              <Text style={styles.customerName}>{job.customerName}</Text>

              <View style={styles.infoRow}>
                <MapPin size={16} color={colors.brand500} />
                <Text style={[styles.infoText, { flex: 1 }]}>{job.address}</Text>
              </View>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.8}>
                  <Phone size={14} color={colors.card} />
                  <Text style={styles.callBtnText}>Call Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mapBtn} onPress={handleMap} activeOpacity={0.8}>
                  <MapPin size={14} color={colors.brand500} />
                  <Text style={styles.mapBtnText}>Open Map</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Job Timeline Tracker */}
            <View style={styles.infoCard}>
              <Text style={styles.cardSectionTitle}>Service Progress Timeline</Text>
              <View style={styles.timelineRow}>
                <View style={styles.timelineStep}>
                  <CheckCircle2 size={18} color={colors.emeraldText} />
                  <Text style={styles.timelineStepText}>Job Assigned</Text>
                </View>
                <View style={styles.timelineLine} />
                <View style={styles.timelineStep}>
                  <CheckCircle2 size={18} color={isCompleted || job.isOtpVerified ? colors.emeraldText : colors.textMuted} />
                  <Text style={styles.timelineStepText}>OTP Verified</Text>
                </View>
                <View style={styles.timelineLine} />
                <View style={styles.timelineStep}>
                  <CheckCircle2 size={18} color={isCompleted ? colors.emeraldText : colors.textMuted} />
                  <Text style={styles.timelineStepText}>Completed</Text>
                </View>
              </View>
            </View>

            {/* Add-Ons / Spare Parts (If Any) */}
            {job.completedAddOns && job.completedAddOns.length > 0 && (
              <View style={styles.infoCard}>
                <Text style={styles.cardSectionTitle}>Installed Spare Parts & Add-Ons</Text>
                {job.completedAddOns.map((addon) => (
                  <View key={addon.id} style={styles.addonItemRow}>
                    <Text style={styles.addonName}>{addon.name}</Text>
                    <Text style={styles.addonPrice}>₹{addon.totalWithGst}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Earnings Breakdown */}
            <View style={styles.earningsCard}>
              <View style={styles.earningsHeader}>
                <Percent size={18} color={colors.brand500} />
                <Text style={styles.earningsTitle}>Financial Breakdown (75% Share)</Text>
              </View>

              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Service Fixed Rate</Text>
                <Text style={styles.calcVal}>₹{baseRate}</Text>
              </View>

              {addOnsTotal > 0 && (
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Add-Ons & Spare Parts</Text>
                  <Text style={styles.calcVal}>+₹{addOnsTotal}</Text>
                </View>
              )}

              <View style={styles.calcDivider} />

              <View style={styles.calcRow}>
                <Text style={styles.totalLabel}>Total Customer Billing</Text>
                <Text style={styles.totalVal}>₹{grandTotal}</Text>
              </View>

              <View style={styles.netShareBox}>
                <Text style={styles.netShareLabel}>Your Net Earnings (75%)</Text>
                <Text style={styles.netShareVal}>₹{partnerShare}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer Actions */}
          <View style={styles.modalFooter}>
            {!isCompleted ? (
              <TouchableOpacity
                style={styles.verifyOtpBtn}
                onPress={() => {
                  onClose();
                  onOpenOtpModal(job);
                }}
                activeOpacity={0.8}
              >
                <KeyRound size={18} color={colors.card} />
                <Text style={styles.verifyOtpBtnText}>
                  {job.isOtpVerified ? 'Complete Job' : 'Verify Customer OTP'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.completedBanner}>
                <ShieldCheck size={18} color={colors.emeraldText} />
                <Text style={styles.completedBannerText}>Job Successfully Completed & Settled</Text>
              </View>
            )}
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
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brand50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.brand500,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgePending: {
    backgroundColor: colors.amberLight,
  },
  statusBadgeCompleted: {
    backgroundColor: colors.emeraldLight,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadgeTextPending: {
    color: colors.amberText,
  },
  statusBadgeTextCompleted: {
    color: colors.emeraldText,
  },
  jobIdText: {
    fontSize: 14,
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
  bannerBox: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadow.sm,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  localityText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadow.sm,
  },
  cardSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.brand500,
    paddingVertical: 10,
    borderRadius: 12,
  },
  callBtnText: {
    color: colors.card,
    fontSize: 13,
    fontWeight: '800',
  },
  mapBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.brand50,
    borderWidth: 1,
    borderColor: colors.brand200,
    paddingVertical: 10,
    borderRadius: 12,
  },
  mapBtnText: {
    color: colors.brand500,
    fontSize: 13,
    fontWeight: '800',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  timelineStep: {
    alignItems: 'center',
    gap: 4,
  },
  timelineStepText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 6,
    marginBottom: 16,
  },
  addonItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  addonName: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  addonPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.brand500,
  },
  earningsCard: {
    backgroundColor: colors.brand50,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.brand200,
    marginBottom: 16,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  earningsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.brand500,
  },
  calcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  calcLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  calcVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  calcDivider: {
    height: 1,
    backgroundColor: colors.brand200,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  netShareBox: {
    backgroundColor: colors.emeraldLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  netShareLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  netShareVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  modalFooter: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  verifyOtpBtn: {
    backgroundColor: colors.brand500,
    borderRadius: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadow.lux,
  },
  verifyOtpBtnText: {
    color: colors.card,
    fontSize: 15,
    fontWeight: '800',
  },
  completedBanner: {
    backgroundColor: colors.emeraldLight,
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completedBannerText: {
    color: colors.emeraldText,
    fontSize: 14,
    fontWeight: '800',
  },
});
