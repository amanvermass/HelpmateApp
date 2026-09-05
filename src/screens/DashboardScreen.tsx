import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { initialBookings, Booking } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import {
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  UserCheck,
  Navigation,
  Eye,
  KeyRound,
} from 'lucide-react-native';
import { OtpAddonModal } from '../components/OtpAddonModal';
import { ShimmerKpiGrid, ShimmerJobCard, ShimmerBox } from '../components/ShimmerCard';
import { AnimatedDataView } from '../components/AnimatedDataView';
import { AssignedJobAcceptCard } from '../components/AssignedJobAcceptCard';

export const DashboardScreen: React.FC = () => {
  const { partnerUser, setActiveTab, setSelectedJobForDetails } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedBookingForOtp, setSelectedBookingForOtp] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    // Smooth data loading transition effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setBookings(initialBookings);
      setIsLoading(false);
      setRefreshing(false);
    }, 600);
  }, []);

  const activeBookings = bookings.filter(
    (b) => b.status === 'Pending' || b.status === 'Assigned' || b.status === 'In Progress'
  );
  const pendingCount = activeBookings.length;

  const handleAcceptJob = (acceptedJob: Booking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === acceptedJob.id ? { ...b, status: 'In Progress' as const } : b))
    );
  };

  const handleDeclineJob = (declinedJob: Booking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === declinedJob.id ? { ...b, status: 'Declined' as const } : b))
    );
  };

  const handleOpenMap = (address: string, locality: string) => {
    const query = encodeURIComponent(`${locality} ${address} Varanasi`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(mapsUrl).catch(() => {});
  };

  const handleCallCustomer = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const handleBookingCompleted = (updatedBooking: Booking) => {
    setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
  };

  return (
    <View style={styles.safeArea}>
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
        {/* Welcome Banner Card */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <View style={styles.bannerIconBox}>
              <UserCheck size={24} color={colors.brand500} />
            </View>
            <View style={styles.bannerTitleBox}>
              <Text style={styles.bannerTitle}>Welcome, {partnerUser?.name}!</Text>
              <Text style={styles.bannerSubtitle}>
                {partnerUser?.role} • {partnerUser?.address.split(',')[1] || 'Sigra Varanasi'}
              </Text>
            </View>
          </View>

          <View style={styles.zonePillContainer}>
            {partnerUser?.pincodes.map((pin, i) => (
              <View key={i} style={styles.zonePill}>
                <MapPin size={10} color={colors.brand500} />
                <Text style={styles.zonePillText}>{pin}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* KPI Metrics Grid */}
        <Text style={styles.sectionHeaderTitle}>Performance Overview</Text>

        {isLoading ? (
          <View>
            <ShimmerKpiGrid />
            <View style={styles.sectionRow}>
              <ShimmerBox width={160} height={18} borderRadius={6} />
            </View>
            <ShimmerJobCard />
            <ShimmerJobCard />
          </View>
        ) : (
          <AnimatedDataView>
            <View style={styles.kpiGrid}>
              {/* KPI 1 */}
              <View style={[styles.kpiCard, { borderColor: colors.emeraldBorder }]}>
                <Text style={styles.kpiLabel}>This Month Earnings</Text>
                <Text style={[styles.kpiValue, { color: colors.emeraldText }]}>₹24,850</Text>
                <Text style={styles.kpiSub}>75% Net Share Paid Weekly</Text>
              </View>

              {/* KPI 2 */}
              <View style={[styles.kpiCard, { borderColor: colors.amberBorder }]}>
                <Text style={[styles.kpiLabel, { color: colors.amberText }]}>Assigned New Jobs</Text>
                <Text style={[styles.kpiValue, { color: colors.amberText }]}>{pendingCount} Active</Text>
                <Text style={styles.kpiSub}>Accept & OTP Verification</Text>
              </View>

              {/* KPI 3 */}
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Authorized Services</Text>
                <Text style={styles.kpiValue}>4 Skill Sets</Text>
                <Text style={styles.kpiSub}>AC & Smart Electrician</Text>
              </View>

              {/* KPI 4 */}
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Coverage Zone</Text>
                <Text style={styles.kpiValue}>Varanasi South</Text>
                <Text style={styles.kpiSub}>3 Pincodes Active</Text>
              </View>
            </View>

            {/* Active Jobs Header */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionHeaderTitle}>Assigned Jobs ({pendingCount})</Text>
              <TouchableOpacity onPress={() => setActiveTab('bookings')} activeOpacity={0.7}>
                <Text style={styles.viewAllText}>View All Jobs →</Text>
              </TouchableOpacity>
            </View>

            {/* Jobs Cards List */}
            {activeBookings.length === 0 ? (
              <View style={styles.emptyCard}>
                <CheckCircle2 size={32} color={colors.emeraldText} />
                <Text style={styles.emptyTitle}>All Jobs Completed!</Text>
                <Text style={styles.emptySubtitle}>No active jobs assigned right now.</Text>
              </View>
            ) : (
              activeBookings.map((job, index) => (
                <AnimatedDataView key={job.id} delay={index * 80}>
                  {/* If job is ASSIGNED -> render Accept/Decline Card with live timer */}
                  {job.status === 'Assigned' ? (
                    <AssignedJobAcceptCard
                      booking={job}
                      onAccept={handleAcceptJob}
                      onDecline={handleDeclineJob}
                    />
                  ) : (
                    /* Standard Active / Accepted Job Card */
                    <TouchableOpacity
                      style={styles.jobCard}
                      onPress={() => setSelectedJobForDetails(job)}
                      activeOpacity={0.9}
                    >
                      <View style={styles.jobCardHeader}>
                        <Text style={styles.jobIdText}>#{job.id}</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            job.status === 'Completed'
                              ? styles.statusCompleted
                              : styles.statusPending,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              job.status === 'Completed'
                                ? styles.statusTextCompleted
                                : styles.statusTextPending,
                            ]}
                          >
                            {job.status}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.jobServiceTitle}>{job.serviceTitle}</Text>
                      <Text style={styles.jobCustomerName}>{job.customerName}</Text>

                      {/* Address */}
                      <View style={styles.jobMetaRow}>
                        <MapPin size={14} color={colors.rose} />
                        <Text style={styles.jobMetaText} numberOfLines={1}>
                          {job.locality} • {job.address}
                        </Text>
                      </View>

                      {/* Time Slot */}
                      <View style={styles.jobMetaRow}>
                        <Clock size={14} color={colors.textMuted} />
                        <Text style={styles.jobMetaText}>{job.timeSlot}</Text>
                      </View>

                      {/* Footer Share & Actions */}
                      <View style={styles.jobFooter}>
                        <View>
                          <Text style={styles.shareLabel}>Your Share (75%)</Text>
                          <Text style={styles.shareValue}>
                            ₹{job.partnerEarnings || Math.round(job.totalAmount * 0.75)}
                          </Text>
                        </View>

                        <View style={styles.jobActionsRow}>
                          {/* Job Details Button */}
                          <TouchableOpacity
                            style={styles.detailsIconBtn}
                            onPress={() => setSelectedJobForDetails(job)}
                          >
                            <Eye size={14} color={colors.brand500} />
                            <Text style={styles.detailsBtnText}>Details</Text>
                          </TouchableOpacity>

                          {/* Call Customer */}
                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => handleCallCustomer(job.customerPhone)}
                          >
                            <Phone size={14} color={colors.brand500} />
                          </TouchableOpacity>

                          {/* Open Map */}
                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => handleOpenMap(job.address, job.locality)}
                          >
                            <Navigation size={14} color={colors.rose} />
                          </TouchableOpacity>

                          {/* Verify OTP & Finish */}
                          <TouchableOpacity
                            style={styles.otpVerifyBtn}
                            onPress={() => setSelectedBookingForOtp(job)}
                          >
                            <KeyRound size={14} color={colors.card} />
                            <Text style={styles.otpVerifyBtnText}>OTP</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </AnimatedDataView>
              ))
            )}
          </AnimatedDataView>
        )}

        {/* OTP & Addons Modal */}
        <OtpAddonModal
          visible={!!selectedBookingForOtp}
          booking={selectedBookingForOtp}
          onClose={() => setSelectedBookingForOtp(null)}
          onCompleteBooking={handleBookingCompleted}
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
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bannerCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadow.sm,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.brand50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTitleBox: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  zonePillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  zonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  zonePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.brand500,
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
    ...shadow.sm,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  emptyCard: {
    backgroundColor: colors.emeraldLight,
    borderWidth: 1,
    borderColor: colors.emeraldBorder,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.emeraldText,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.emeraldText,
    marginTop: 2,
  },
  jobCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadow.sm,
  },
  jobCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  jobIdText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPending: {
    backgroundColor: colors.amberLight,
  },
  statusCompleted: {
    backgroundColor: colors.emeraldLight,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextPending: {
    color: colors.amberText,
  },
  statusTextCompleted: {
    color: colors.emeraldText,
  },
  jobServiceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  jobCustomerName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  jobMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  jobMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  jobFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    flexWrap: 'wrap',
    gap: 6,
  },
  shareLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.emeraldText,
  },
  shareValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  jobActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  detailsIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 72,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.brand50,
    borderWidth: 1,
    borderColor: colors.brand200,
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brand500,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpVerifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brand500,
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 10,
  },
  otpVerifyBtnText: {
    color: colors.card,
    fontSize: 11,
    fontWeight: '800',
  },
});
