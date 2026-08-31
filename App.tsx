import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { BookingsScreen } from './src/screens/BookingsScreen';
import { PayoutsScreen } from './src/screens/PayoutsScreen';
import { ServicesScreen } from './src/screens/ServicesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { NavigationHeader } from './src/components/NavigationHeader';
import { BottomTabBar } from './src/components/BottomTabBar';
import { colors } from './src/styles/theme';

const MainNavigator: React.FC = () => {
  const { isAuthenticated, activeTab } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'bookings':
        return <BookingsScreen />;
      case 'payouts':
        return <PayoutsScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />
      <NavigationHeader />
      <View style={styles.contentContainer}>
        {renderActiveScreen()}
      </View>
      <BottomTabBar />
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
  },
});
