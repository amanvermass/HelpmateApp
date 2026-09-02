import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  KeyRound,
  Percent,
} from 'lucide-react-native';
import { OtpAddonModal } from '../components/OtpAddonModal';

export const JobDetailsScreen: React.FC = () => {
  const { selectedJobForDetails, setSelectedJobForDetails } = useAuth();
  const [job, setJob] = useState<Booking | null>(selectedJobForDetails);
  const [selectedBookingForOtp, setSelectedBookingForOtp] = useState<Booking | null>(null);

  if (!job) return null;

  const handleCall = () => {
    Linking.openURL(`tel:${job.customerPhone}`);
  };

  const handleMap = () => {
    const query = encodeURIComponent(`${job.locality} ${job.address} Varanasi`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleBookingCompleted = (updatedBooking: Booking) => {
    setJob(updatedBooking);
    setSelectedJobForDetails(updatedBooking);
  };

  const isCompleted = job.status === 'Completed';

  // Financial calculations
  const baseRate = job.totalAmount;
  const addOnsTotal = job.addOnsFinalTotal || 0;
  const grandTotal = baseRate + addOnsTotal;
  const partnerShare = Math.round(grandTotal * 0.75);

  return (
    <View style={styles.safeArea}>
      {/* Top Header Bar with Back Button & Prominent Job ID */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setSelectedJobForDetails(null)}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerJobId}>Job #{job.id}</Text>
          <Text style={styles.headerSubText}>{job.category}</Text>
        </View>

        <View style={[styles.statusTag, isCompleted ? styles.statusTagCompleted : styles.statusTagPending]}>
          <Text style={[styles.statusTagText, isCompleted ? styles.statusTagTextCompleted : styles.statusTagTextPending]}>
            {job.status}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Service Title Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.categoryBadge}>
            <Wrench size={12} color={colors.brand500} />
            <Text style={styles.categoryBadgeText}>{job.category}</Text>
          </View>
          <Text style={styles.serviceTitle}>{job.serviceTitle}</Text>
          <Text style={styles.localityText}>Location: {job.locality} Zone, Varanasi</Text>
        </View>

        {/* Schedule Details */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Schedule Details</Text>
          <View style={styles.infoRow}>
            <Calendar size={16} color={colors.brand500} />
            <Text style={styles.infoText}>Scheduled Date: {job.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={16} color={colors.brand500} />
            <Text style={styles.infoText}>Time Slot: {job.timeSlot}</Text>
          </View>
        </View>

        {/* Customer Info & Quick Action Buttons */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Customer & Destination Address</Text>
          <Text style={styles.customerName}>{job.customerName}</Text>
          <Text style={styles.phoneText}>Phone: {job.customerPhone}</Text>

          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.rose} />
            <Text style={[styles.infoText, { flex: 1 }]}>{job.address}</Text>
          </View>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.8}>
              <Phone size={14} color={colors.card} />
              <Text style={styles.callBtnText}>Call Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mapBtn} onPress={handleMap} activeOpacity={0.8}>
              <MapPin size={14} color={colors.brand500} />
              <Text style={styles.mapBtnText}>Open Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Tracker */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Service Progress Timeline</Text>
          <View style={styles.timelineRow}>
            <View style={styles.timelineStep}>
              <CheckCircle2 size={20} color={colors.emeraldText} />
              <Text style={styles.timelineStepText}>Job Assigned</Text>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineStep}>
              <CheckCircle2 size={20} color={isCompleted || job.isOtpVerified ? colors.emeraldText : colors.textMuted} />
              <Text style={styles.timelineStepText}>OTP Verified</Text>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineStep}>
              <CheckCircle2 size={20} color={isCompleted ? colors.emeraldText : colors.textMuted} />
              <Text style={styles.timelineStepText}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Spare Parts Installed (If Any) */}
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

        {/* Financial Breakdown Card */}
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

      {/* Page Sticky Footer Action */}
      <View style={styles.bottomFooter}>
        {!isCompleted ? (
          <TouchableOpacity
            style={styles.verifyOtpBtn}
            onPress={() => setSelectedBookingForOtp(job)}
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
            <Text style={styles.completedBannerText}>Job Completed & Payout Settled</Text>
          </View>
        )}
      </View>

      {/* OTP Addon Modal */}
      <OtpAddonModal
        visible={!!selectedBookingForOtp}
        booking={selectedBookingForOtp}
        onClose={() => setSelectedBookingForOtp(null)}
        onCompleteBooking={handleBookingCompleted}
      />
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
  headerJobId: {
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTagPending: {
    backgroundColor: colors.amberLight,
  },
  statusTagCompleted: {
    backgroundColor: colors.emeraldLight,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTagTextPending: {
    color: colors.amberText,
  },
  statusTagTextCompleted: {
    color: colors.emeraldText,
  },
  scrollContent: {
    padding: 16,
  },
  bannerCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadow.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brand50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.brand500,
  },
  serviceTitle: {
    fontSize: 18,
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
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
    paddingVertical: 12,
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
    paddingVertical: 12,
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
    fontSize: 11,
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  addonName: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  addonPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.brand500,
  },
  earningsCard: {
    backgroundColor: colors.brand50,
    borderRadius: 20,
    padding: 18,
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
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  netShareBox: {
    backgroundColor: colors.emeraldLight,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  netShareLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  netShareVal: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  bottomFooter: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  verifyOtpBtn: {
    backgroundColor: colors.brand500,
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadow.lux,
  },
  verifyOtpBtnText: {
    color: colors.card,
    fontSize: 16,
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
