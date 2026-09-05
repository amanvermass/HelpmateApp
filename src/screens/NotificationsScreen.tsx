import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, shadow } from '../styles/theme';
import {
  Bell,
  CheckCheck,
  Trash2,
  CalendarCheck,
  Wallet,
  Star,
  Gift,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react-native';
import { AppNotification } from '../data/mockData';

export const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    setActiveTab,
  } = useAuth();

  const [filterTab, setFilterTab] = useState<'All' | 'Unread' | 'Jobs' | 'Payouts'>('All');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filterTab === 'Unread') return !n.read;
    if (filterTab === 'Jobs') return n.category === 'Job';
    if (filterTab === 'Payouts') return n.category === 'Payout';
    return true;
  });

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'Job':
        return <CalendarCheck size={18} color={colors.brand500} />;
      case 'Payout':
        return <Wallet size={18} color={colors.emeraldText} />;
      case 'Rating':
        return <Star size={18} color={colors.amberText} />;
      case 'Bonus':
        return <Gift size={18} color={colors.purpleText} />;
      case 'System':
        return <ShieldCheck size={18} color={colors.primary} />;
      default:
        return <Bell size={18} color={colors.brand500} />;
    }
  };

  const handleNotificationPress = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.targetTab) {
      setActiveTab(notif.targetTab);
    }
  };

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.headerTitleRow}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.pageTitle}>Notifications</Text>
            {unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
              </View>
            ) : null}
          </View>

          {/* Quick Header Actions */}
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={styles.headerActionBtn}
                onPress={markAllAsRead}
                activeOpacity={0.7}
              >
                <CheckCheck size={14} color={colors.brand500} />
                <Text style={styles.headerActionText}>Read All</Text>
              </TouchableOpacity>
            )}

            {notifications.length > 0 && (
              <TouchableOpacity
                style={styles.headerActionBtn}
                onPress={clearNotifications}
                activeOpacity={0.7}
              >
                <Trash2 size={14} color={colors.rose} />
                <Text style={[styles.headerActionText, { color: colors.rose }]}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['All', 'Unread', 'Jobs', 'Payouts'] as const).map((tab) => {
            const isActive = filterTab === tab;
            const count = notifications.filter((n) =>
              tab === 'All'
                ? true
                : tab === 'Unread'
                ? !n.read
                : tab === 'Jobs'
                ? n.category === 'Job'
                : n.category === 'Payout'
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

      {/* Notifications Body */}
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
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Bell size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
          </View>
        ) : (
          filteredNotifications.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
              onPress={() => handleNotificationPress(notif)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                {getCategoryIcon(notif.category)}
              </View>

              <View style={styles.contentContainer}>
                <View style={styles.topRow}>
                  <Text style={styles.notifTitle} numberOfLines={1}>
                    {notif.title}
                  </Text>
                  <Text style={styles.timeText}>{notif.time}</Text>
                </View>

                <Text style={styles.notifMessage}>{notif.message}</Text>

                {notif.targetTab && (
                  <View style={styles.actionPromptRow}>
                    <Text style={styles.actionPromptText}>Tap to view details</Text>
                    <ArrowRight size={12} color={colors.brand500} />
                  </View>
                )}
              </View>

              {!notif.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        )}
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  unreadBadge: {
    backgroundColor: colors.brand50,
    borderWidth: 1,
    borderColor: colors.brand200,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.brand500,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brand500,
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
    paddingVertical: 16,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  notifCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    ...shadow.sm,
  },
  notifCardUnread: {
    backgroundColor: colors.brand50,
    borderColor: colors.brand200,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
  notifMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  actionPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  actionPromptText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brand500,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand500,
    position: 'absolute',
    top: 14,
    right: 12,
  },
});
