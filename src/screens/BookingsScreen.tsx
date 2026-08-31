import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Platform,
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
} from 'lucide-react-native';
import { OtpAddonModal } from '../components/OtpAddonModal';

export const BookingsScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filterTab, setFilterTab] = useState<'All' | 'Pending' | 'Assigned' | 'Completed'>('All');
  const [selectedBookingForOtp, setSelectedBookingForOtp] = useState<Booking | null>(null);

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
    <SafeAreaView style={styles.safeArea}>
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

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <CalendarCheck size={36} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No jobs found in '{filterTab}' status</Text>
          </View>
        ) : (
          filteredBookings.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.jobIdText}>{job.id}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    job.status === 'Completed' ? styles.statusCompleted : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      job.status === 'Completed' ? styles.statusTextCompleted : styles.statusTextPending,
                    ]}
                  >
                    {job.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.serviceTitle}>{job.serviceTitle}</Text>

              {/* Customer Details */}
              <View style={styles.customerBox}>
                <Text style={styles.customerName}>{job.customerName}</Text>
                <Text style={styles.customerPhoneText}>{job.customerPhone}</Text>
              </View>

              {/* Address with Google Map Button */}
              <View style={styles.addressBox}>
                <MapPin size={16} color={colors.rose} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.localityText}>{job.locality}</Text>
                  <Text style={styles.fullAddressText}>{job.address}</Text>
                </View>
              </View>

              {/* Time Slot */}
              <View style={styles.metaRow}>
                <Clock size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>Scheduled: {job.date} ({job.timeSlot})</Text>
              </View>

              {/* Add-ons List if completed */}
              {job.completedAddOns && job.completedAddOns.length > 0 && (
                <View style={styles.addonsSummaryBox}>
                  <Text style={styles.addonsSummaryTitle}>Extra Spare Parts Added:</Text>
                  {job.completedAddOns.map((ao, idx) => (
                    <Text key={idx} style={styles.addonLine}>
                      • {ao.name}: ₹{ao.totalWithGst}
                    </Text>
                  ))}
                </View>
              )}

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.earningsLabel}>Your Net Share (75%)</Text>
                  <Text style={styles.earningsValue}>
                    ₹{job.partnerEarnings || Math.round(job.totalAmount * 0.75)}
                  </Text>
                </View>

                <View style={styles.actionGroup}>
                  {/* Call Phone */}
                  <TouchableOpacity
                    style={styles.actionBtnSecondary}
                    onPress={() => handleCallCustomer(job.customerPhone)}
                  >
                    <Phone size={15} color={colors.brand500} />
                    <Text style={styles.actionBtnSecondaryText}>Call</Text>
                  </TouchableOpacity>

                  {/* Open Map */}
                  <TouchableOpacity
                    style={styles.actionBtnSecondary}
                    onPress={() => handleOpenMap(job.address, job.locality)}
                  >
                    <Navigation size={15} color={colors.rose} />
                    <Text style={styles.actionBtnSecondaryText}>Map</Text>
                  </TouchableOpacity>

                  {/* Verify OTP / Manage Add-ons */}
                  {job.status !== 'Completed' ? (
                    <TouchableOpacity
                      style={styles.actionBtnPrimary}
                      onPress={() => setSelectedBookingForOtp(job)}
                    >
                      <KeyRound size={14} color={colors.card} />
                      <Text style={styles.actionBtnPrimaryText}>Verify OTP</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.completedTag}>
                      <CheckCircle2 size={14} color={colors.emeraldText} />
                      <Text style={styles.completedTagText}>Completed</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))
        )}

        <OtpAddonModal
          visible={!!selectedBookingForOtp}
          booking={selectedBookingForOtp}
          onClose={() => setSelectedBookingForOtp(null)}
          onCompleteBooking={handleBookingCompleted}
        />
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
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
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
    paddingVertical: 16,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 10,
  },
  jobCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.brand500,
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
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  customerBox: {
    backgroundColor: colors.inputBg,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  customerPhoneText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.brand500,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  localityText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  fullAddressText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  addonsSummaryBox: {
    backgroundColor: colors.emeraldLight,
    borderWidth: 1,
    borderColor: colors.emeraldBorder,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addonsSummaryTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.emeraldText,
    marginBottom: 4,
  },
  addonLine: {
    fontSize: 11,
    color: colors.emeraldText,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  earningsLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  earningsValue: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnSecondaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brand500,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnPrimaryText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.card,
  },
  completedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  completedTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.emeraldText,
  },
});
