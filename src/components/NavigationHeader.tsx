import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, shadow } from '../styles/theme';
import { ShieldCheck, Bell } from 'lucide-react-native';

export const NavigationHeader: React.FC = () => {
  const { partnerUser, setActiveTab, unreadCount } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* HelpMate Logo & User Info */}
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: partnerUser?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&auto=format&fit=crop&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.partnerName} numberOfLines={1}>
                {partnerUser?.name || 'Ramesh Yadav'}
              </Text>
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={12} color={colors.emeraldText} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.partnerRole} numberOfLines={1}>
              {partnerUser?.category || 'AC Servicing Expert'} • {partnerUser?.rating || 4.9} ★
            </Text>
          </View>
        </TouchableOpacity>

        {/* Header Right Actions - Bell Button to Notifications */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setActiveTab('notifications')}
            activeOpacity={0.7}
          >
            <Bell size={18} color={colors.brand500} />
            {unreadCount > 0 && (
              <View style={styles.badgeCountBox}>
                <Text style={styles.badgeCountText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.card,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: colors.brand200,
  },
  nameContainer: {
    marginLeft: 10,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.emeraldLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.emeraldText,
  },
  partnerRole: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.brand50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.brand200,
    position: 'relative',
  },
  badgeCountBox: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.brand500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.card,
  },
});
