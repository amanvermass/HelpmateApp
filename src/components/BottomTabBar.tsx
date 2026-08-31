import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, shadow } from '../styles/theme';
import { LayoutDashboard, CalendarCheck, Wallet, Tag, UserCheck } from 'lucide-react-native';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'bookings', label: 'Jobs', icon: CalendarCheck },
    { id: 'payouts', label: 'Payouts', icon: Wallet },
    { id: 'services', label: 'Rate Card', icon: Tag },
    { id: 'profile', label: 'Profile', icon: UserCheck },
  ] as const;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabBarContainer}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Icon
                size={20}
                color={isActive ? colors.brand500 : colors.textMuted}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                style={[styles.tabLabel, isActive && styles.activeTabLabel]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'android' ? 8 : 0,
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: colors.card,
    ...shadow.sm,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 12,
    flex: 1,
  },
  activeTabButton: {
    backgroundColor: colors.brand50,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 3,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: colors.brand500,
    fontWeight: '800',
  },
});
