import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, shadow } from '../styles/theme';
import { Bell } from 'lucide-react-native';

export const NavigationHeader: React.FC = () => {
  const { partnerUser, setActiveTab, unreadCount } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Top Left: Official HelpMate Brand Logo */}
        <TouchableOpacity
          onPress={() => setActiveTab('dashboard')}
          activeOpacity={0.8}
          style={styles.logoTouch}
        >
          <Image
            source={{ uri: 'https://helpmate-theta.vercel.app/logo.png' }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Top Right: Notification Bell & Profile Avatar */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setActiveTab('notifications')}
            activeOpacity={0.7}
          >
            <Bell size={18} color={colors.brand500} />
            {unreadCount > 0 && (
              <View style={styles.badgeCountBox}>
                <View style={styles.badgeDot} />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.8}
            style={styles.avatarButton}
          >
            <Image
              source={{ uri: partnerUser?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&auto=format&fit=crop&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.statusDot} />
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
    paddingTop: Platform.OS === 'android' ? 6 : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.card,
    height: 48,
  },
  logoTouch: {
    justifyContent: 'center',
  },
  logoImage: {
    height: 32,
    width: 120,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brand50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.brand200,
    position: 'relative',
  },
  badgeCountBox: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand500,
  },
  avatarButton: {
    position: 'relative',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.brand200,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.emeraldText,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: colors.card,
  },
});
