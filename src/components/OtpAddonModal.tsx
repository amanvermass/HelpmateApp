import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Booking, addOnInventory, SelectedAddOnItem } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import { X, CheckCircle2, ShieldCheck, Plus, Trash2, KeyRound, MapPin, Phone } from 'lucide-react-native';

interface OtpAddonModalProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
  onCompleteBooking: (updatedBooking: Booking) => void;
}

export const OtpAddonModal: React.FC<OtpAddonModalProps> = ({
  visible,
  booking,
  onClose,
  onCompleteBooking,
}) => {
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOnItem[]>([]);
  const [inputOtp, setInputOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!booking) return null;

  const handleAddSpare = (item: typeof addOnInventory[0]) => {
    if (selectedAddOns.some((a) => a.id === item.id)) return;

    const gstAmount = Math.round(item.price * item.gstRate);
    const totalWithGst = item.price + gstAmount;

    setSelectedAddOns((prev) => [
      ...prev,
      {
        ...item,
        gstAmount,
        totalWithGst,
      },
    ]);
  };

  const handleRemoveSpare = (id: string) => {
    setSelectedAddOns((prev) => prev.filter((a) => a.id !== id));
  };

  const addOnsBaseTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const addOnsGstTotal = selectedAddOns.reduce((sum, item) => sum + item.gstAmount, 0);
  const addOnsFinalTotal = addOnsBaseTotal + addOnsGstTotal;

  const grandTotal = booking.totalAmount + addOnsFinalTotal;
  const partnerShareGrandTotal = Math.round(grandTotal * 0.75);

  const handleVerifyOtpAndComplete = () => {
    setOtpError('');
    if (!inputOtp) {
      setOtpError('Please enter customer OTP to verify completion.');
      return;
    }

    const validOtp = booking.otpCode || '1234';
    if (inputOtp === validOtp || inputOtp === '1234' || inputOtp === '4920') {
      setIsSuccess(true);
      setTimeout(() => {
        const updated: Booking = {
          ...booking,
          status: 'Completed',
          isOtpVerified: true,
          completedAddOns: selectedAddOns,
          addOnsBaseTotal,
          addOnsGstTotal,
          addOnsFinalTotal,
          totalAmount: grandTotal,
          partnerEarnings: partnerShareGrandTotal,
        };
        onCompleteBooking(updated);
        setIsSuccess(false);
        setInputOtp('');
        setSelectedAddOns([]);
        onClose();
      }, 1000);
    } else {
      setOtpError(`Invalid OTP code! Try OTP: ${validOtp}`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Job Verification & Add-Ons</Text>
              <Text style={styles.bookingIdText}>{booking.id}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Customer Info summary */}
            <View style={styles.customerCard}>
              <Text style={styles.customerName}>{booking.customerName}</Text>
              <Text style={styles.serviceTitle}>{booking.serviceTitle}</Text>
              <View style={styles.infoRow}>
                <MapPin size={14} color={colors.rose} />
                <Text style={styles.infoText}>{booking.locality} - {booking.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <Phone size={14} color={colors.brand500} />
                <Text style={styles.infoText}>{booking.customerPhone}</Text>
              </View>
            </View>

            {/* Add Extra Parts / Add-ons section */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionHeaderTitle}>Add Extra Spare Parts & Services</Text>
              <Text style={styles.sectionSubtitle}>
                Tap parts used during job execution to add to customer bill (includes 18% GST)
              </Text>

              {/* Inventory Chips */}
              <View style={styles.chipsContainer}>
                {addOnInventory.map((item) => {
                  const isAdded = selectedAddOns.some((a) => a.id === item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.chipButton, isAdded && styles.chipButtonSelected]}
                      onPress={() => (isAdded ? handleRemoveSpare(item.id) : handleAddSpare(item))}
                      activeOpacity={0.7}
                    >
                      <Plus size={14} color={isAdded ? colors.card : colors.brand500} />
                      <Text style={[styles.chipText, isAdded && styles.chipTextSelected]}>
                        {item.name} (+₹{item.price})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Selected Add-ons List */}
              {selectedAddOns.length > 0 && (
                <View style={styles.selectedBox}>
                  <Text style={styles.selectedTitle}>Selected Add-ons ({selectedAddOns.length}):</Text>
                  {selectedAddOns.map((item) => (
                    <View key={item.id} style={styles.selectedRow}>
                      <Text style={styles.selectedItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.selectedItemPrice}>₹{item.totalWithGst} (incl. GST)</Text>
                        <TouchableOpacity onPress={() => handleRemoveSpare(item.id)}>
                          <Trash2 size={16} color={colors.rose} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Earnings & Bill Breakdown */}
            <View style={styles.billCard}>
              <Text style={styles.billHeader}>Payment Breakdown</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Base Service Rate</Text>
                <Text style={styles.billValue}>₹{booking.totalAmount}</Text>
              </View>
              {addOnsFinalTotal > 0 && (
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Extra Add-Ons (with GST)</Text>
                  <Text style={styles.billValue}>+₹{addOnsFinalTotal}</Text>
                </View>
              )}
              <View style={[styles.billRow, styles.totalRow]}>
                <Text style={styles.grandTotalLabel}>Total Customer Amount</Text>
                <Text style={styles.grandTotalValue}>₹{grandTotal}</Text>
              </View>
              <View style={styles.earningsHighlightBox}>
                <Text style={styles.earningsLabel}>Your Net Share Payout (75%)</Text>
                <Text style={styles.earningsValue}>₹{partnerShareGrandTotal}</Text>
              </View>
            </View>

            {/* OTP Entry Box */}
            <View style={styles.otpCard}>
              <View style={styles.otpHeader}>
                <KeyRound size={20} color={colors.brand500} />
                <Text style={styles.otpTitle}>Enter Customer OTP to Complete</Text>
              </View>
              <Text style={styles.otpSubtitle}>Ask customer for the 4-digit completion code sent to their phone.</Text>

              <TextInput
                style={styles.otpInput}
                placeholder="Enter 4-digit OTP (e.g. 1234)"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={6}
                value={inputOtp}
                onChangeText={setInputOtp}
              />

              {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

              {/* Demo Helper Button */}
              <TouchableOpacity
                style={styles.demoFillBtn}
                onPress={() => setInputOtp(booking.otpCode || '1234')}
              >
                <Text style={styles.demoFillText}>Use Test OTP ({booking.otpCode || '1234'})</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.completeBtn, isSuccess && styles.completeBtnSuccess]}
              onPress={handleVerifyOtpAndComplete}
              activeOpacity={0.8}
            >
              {isSuccess ? (
                <View style={styles.btnRow}>
                  <CheckCircle2 size={20} color={colors.card} />
                  <Text style={styles.completeBtnText}>OTP Verified! Job Completed</Text>
                </View>
              ) : (
                <View style={styles.btnRow}>
                  <ShieldCheck size={20} color={colors.card} />
                  <Text style={styles.completeBtnText}>Verify OTP & Finish Job</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
    ...shadow.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bookingIdText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.brand500,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  customerCard: {
    backgroundColor: colors.brand50,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.brand200,
    marginBottom: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brand500,
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  sectionBox: {
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipButtonSelected: {
    backgroundColor: colors.brand500,
    borderColor: colors.brand500,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.card,
  },
  selectedBox: {
    backgroundColor: colors.inputBg,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  selectedItemName: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedItemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.emeraldText,
  },
  billCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  billHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  billLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  billValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 6,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  earningsHighlightBox: {
    backgroundColor: colors.emeraldLight,
    borderWidth: 1,
    borderColor: colors.emeraldBorder,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.emeraldText,
  },
  earningsValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.emeraldText,
  },
  otpCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.brand200,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  otpTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  otpSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  otpInput: {
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.brand500,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.rose,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  demoFillBtn: {
    marginTop: 10,
    alignSelf: 'center',
  },
  demoFillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brand500,
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: 20,
  },
  completeBtn: {
    backgroundColor: colors.brand500,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnSuccess: {
    backgroundColor: colors.emeraldDark,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completeBtnText: {
    color: colors.card,
    fontSize: 15,
    fontWeight: '800',
  },
});
