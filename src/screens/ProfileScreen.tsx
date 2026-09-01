import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { partnerProfileData, KycDoc } from '../data/mockData';
import { colors, shadow } from '../styles/theme';
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Building2,
  FileText,
  Eye,
  LogOut,
} from 'lucide-react-native';
import { DocumentViewerModal } from '../components/DocumentViewerModal';

export const ProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const [profile] = useState(partnerProfileData);
  const [selectedDoc, setSelectedDoc] = useState<KycDoc | null>(null);

  const handleLogoutPress = () => {
    logout();
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerBox}>
        <Text style={styles.pageTitle}>Profile & Verification</Text>
        <Text style={styles.pageSubtitle}>Verified credentials, bank account & document vault</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <View style={styles.profileHeaderInfo}>
              <View style={styles.verifiedTag}>
                <ShieldCheck size={12} color={colors.emeraldText} />
                <Text style={styles.verifiedTagText}>Active & Verified</Text>
              </View>
              <Text style={styles.partnerName}>{profile.name}</Text>
              <Text style={styles.partnerRole}>{profile.role}</Text>
              <Text style={styles.partnerId}>ID: {profile.id}</Text>
            </View>
          </View>

          {/* Rating & Job stats bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{profile.rating} ★</Text>
              <Text style={styles.statSub}>Customer Rating</Text>
            </View>
            <View style={styles.dividerV} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{profile.totalJobs}</Text>
              <Text style={styles.statSub}>Jobs Completed</Text>
            </View>
            <View style={styles.dividerV} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{profile.partnerSharePercent}</Text>
              <Text style={styles.statSub}>Earnings Cut</Text>
            </View>
          </View>
        </View>

        {/* Contact Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Contact & Zone Details</Text>
          <View style={styles.infoRow}>
            <Phone size={16} color={colors.brand500} />
            <Text style={styles.infoText}>{profile.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Mail size={16} color={colors.brand500} />
            <Text style={styles.infoText}>{profile.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.rose} />
            <Text style={styles.infoText}>{profile.address}</Text>
          </View>

          <Text style={styles.subLabel}>Assigned Pincodes:</Text>
          <View style={styles.chipsContainer}>
            {profile.pincodes.map((pin, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{pin}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bank & Payout Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Payout Bank Account</Text>
          <View style={styles.infoRow}>
            <Building2 size={16} color={colors.brand500} />
            <Text style={styles.infoText}>{profile.bankName} - {profile.branch}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account No:</Text>
            <Text style={styles.infoTextMono}>{profile.accountNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>IFSC Code:</Text>
            <Text style={styles.infoTextMono}>{profile.ifscCode}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>UPI Handle:</Text>
            <Text style={styles.infoTextMono}>{profile.upiId}</Text>
          </View>
        </View>

        {/* e-KYC & Police NOC Status Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Government Verification & Police NOC</Text>

          {/* Aadhaar */}
          <View style={styles.kycRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kycItemTitle}>Aadhaar e-KYC</Text>
              <Text style={styles.infoTextMono}>No: {profile.aadhaarNumber}</Text>
            </View>
            <View style={styles.badgeSuccess}>
              <CheckCircle2 size={12} color={colors.emeraldText} />
              <Text style={styles.badgeSuccessText}>Verified</Text>
            </View>
          </View>

          {/* Police Clearance NOC */}
          <View style={styles.kycRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kycItemTitle}>Police Verification NOC</Text>
              <Text style={styles.infoTextSub}>{profile.policeThana}</Text>
              <Text style={styles.infoTextMono}>NOC: {profile.policeNocNumber}</Text>
            </View>
            <View style={styles.badgeSuccess}>
              <ShieldCheck size={12} color={colors.emeraldText} />
              <Text style={styles.badgeSuccessText}>Approved</Text>
            </View>
          </View>

          {/* Emergency Guarantor */}
          <View style={styles.guarantorBox}>
            <Text style={styles.guarantorTitle}>Emergency Guarantor Contact:</Text>
            <Text style={styles.guarantorName}>{profile.guarantorName} ({profile.guarantorRelation})</Text>
            <Text style={styles.guarantorPhone}>{profile.guarantorPhone}</Text>
          </View>
        </View>

        {/* Document Vault Cards */}
        <Text style={styles.sectionTitle}>Uploaded Documents Vault</Text>

        {profile.uploadedDocs.map((doc) => (
          <View key={doc.id} style={styles.docCard}>
            <View style={styles.docInfo}>
              <FileText size={20} color={colors.brand500} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <Text style={styles.docSub}>{doc.type} • {doc.dateUploaded}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewDocBtn}
              onPress={() => setSelectedDoc(doc)}
              activeOpacity={0.7}
            >
              <Eye size={14} color={colors.brand500} />
              <Text style={styles.viewDocBtnText}>Preview</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Logout Action Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPress} activeOpacity={0.8}>
          <LogOut size={18} color={colors.rose} />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>

        <DocumentViewerModal
          visible={!!selectedDoc}
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
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
    paddingTop: 16,
    paddingBottom: 14,
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
    paddingVertical: 16,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadow.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.brand200,
  },
  profileHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  partnerRole: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  partnerId: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.brand500,
    marginTop: 2,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  dividerV: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  statNum: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  statSub: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadow.sm,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 90,
  },
  infoText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  infoTextMono: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.brand500,
    fontWeight: '700',
  },
  infoTextSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 6,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: colors.brand50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.brand500,
  },
  kycRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  kycItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeSuccessText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.emeraldText,
  },
  guarantorBox: {
    backgroundColor: colors.inputBg,
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guarantorTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  guarantorName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  guarantorPhone: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.brand500,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  docCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  docSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  viewDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brand50,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewDocBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brand500,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.roseLight,
    borderWidth: 1,
    borderColor: colors.roseBorder,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.rose,
  },
});
