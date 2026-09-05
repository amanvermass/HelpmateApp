import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  RefreshControl,
} from 'react-native';
import { initialBookings, Booking } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import {
  CalendarCheck,
  MapPin,
  Phone,
  Navigation,
  KeyRound,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react-native';
import { OtpAddonModal } from '../components/OtpAddonModal';
import { useAuth } from '../context/AuthContext';
import { AnimatedDataView } from '../components/AnimatedDataView';

export const BookingsScreen: React.FC = () => {
  const { setSelectedJobForDetails } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filterTab, setFilterTab] = useState<'All' | 'Pending' | 'Assigned' | 'Completed'>('All');
  const [selectedBookingForOtp, setSelectedBookingForOtp] = useState<Booking | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setBookings(initialBookings);
      setRefreshing(false);
    }, 600);
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Pending') return b.status === 'Pending';
    if (filterTab === 'Assigned') return b.status === 'Assigned' || b.status === 'In Progress';
    if (filterTab === 'Completed') return b.status === 'Completed';
    return true;
  });

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
      <View style={styles.headerBox}>
        <Text style={styles.pageTitle}>Job Management & Tasks</Text>
        <Text style={styles.pageSubtitle}>Manage customer visits, OTP verification & extra parts</Text>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['All', 'Pending', 'Assigned', 'Completed'] as const).map((tab) => {
            const isActive = filterTab === tab;
            const count = bookings.filter((b) =>
              tab === 'All'
                ? true
                : tab === 'Assigned'
                ? b.status === 'Assigned' || b.status === 'In Progress'
                : b.status === tab
            ).length;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setFilterTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <CalendarCheck size={36} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No jobs found in '{filterTab}' status</Text>
          </View>
        ) : (
          filteredBookings.map((job, index) => (
            <AnimatedDataView key={job.id} delay={index * 60}>
              <TouchableOpacity
                style={styles.jobCard}
                onPress={() => setSelectedJobForDetails(job)}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.jobIdText}>#{job.id}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      job.status === 'Completed' ? styles.statusCompleted : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        job.status === 'Completed'
                          ? styles.statusBadgeTextCompleted
                          : styles.statusBadgeTextPending,
                      ]}
                    >
                      {job.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.serviceTitle}>{job.serviceTitle}</Text>

                <View style={styles.customerBox}>
                  <Text style={styles.customerName}>{job.customerName}</Text>
                  <Text style={styles.timeText}>{job.date} • {job.timeSlot}</Text>
                </View>

                <View style={styles.addressRow}>
                  <MapPin size={14} color={colors.rose} />
                  <Text style={styles.addressText} numberOfLines={1}>
                    {job.locality} • {job.address}
                  </Text>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.shareCol}>
                    <Text style={styles.shareLabel}>Net Share (75%)</Text>
                    <Text style={styles.shareAmount}>
                      ₹{job.partnerEarnings || Math.round(job.totalAmount * 0.75)}
                    </Text>
                  </View>

                  <View style={styles.actionGroup}>
                    {/* View Details Button */}
                    <TouchableOpacity
                      style={styles.detailsBtn}
                      onPress={() => setSelectedJobForDetails(job)}
                    >
                      <Eye size={14} color={colors.brand500} />
                      <Text style={styles.detailsBtnText}>Details</Text>
                    </TouchableOpacity>

                    {/* Call Customer */}
                    <TouchableOpacity
                      style={styles.callIconBtn}
                      onPress={() => handleCallCustomer(job.customerPhone)}
                    >
                      <Phone size={14} color={colors.brand500} />
                    </TouchableOpacity>

                    {/* Open Maps */}
                    <TouchableOpacity
                      style={styles.mapIconBtn}
                      onPress={() => handleOpenMap(job.address, job.locality)}
                    >
                      <Navigation size={14} color={colors.rose} />
                    </TouchableOpacity>

                    {/* Verify OTP */}
                    {job.status !== 'Completed' && (
                      <TouchableOpacity
                        style={styles.otpBtn}
                        onPress={() => setSelectedBookingForOtp(job)}
                      >
                        <KeyRound size={14} color={colors.card} />
                        <Text style={styles.otpBtnText}>OTP</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </AnimatedDataView>
          ))
        )}
      </ScrollView>

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
    marginBottom: 10,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.brand500,
    borderColor: colors.brand500,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.card,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 10,
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
  cardHeader: {
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
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  customerBox: {
    marginVertical: 4,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    flexWrap: 'wrap',
    gap: 6,
  },
  shareCol: {},
  shareLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.emeraldText,
  },
  shareAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  detailsBtn: {
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
  callIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brand500,
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 10,
  },
  otpBtnText: {
    color: colors.card,
    fontSize: 11,
    fontWeight: '800',
  },
});
