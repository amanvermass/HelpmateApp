import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { BookingsScreen } from './src/screens/BookingsScreen';
import { PayoutsScreen } from './src/screens/PayoutsScreen';
import { ServicesScreen } from './src/screens/ServicesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { JobDetailsScreen } from './src/screens/JobDetailsScreen';
import { PayoutDetailsScreen } from './src/screens/PayoutDetailsScreen';
import { NavigationHeader } from './src/components/NavigationHeader';
import { BottomTabBar } from './src/components/BottomTabBar';
import { AnimatedSplashScreen } from './src/components/AnimatedSplashScreen';
import { colors } from './src/styles/theme';

const MainNavigator: React.FC = () => {
  const {
    isAuthenticated,
    isLoadingSession,
    activeTab,
    setActiveTab,
    selectedJobForDetails,
    setSelectedJobForDetails,
    selectedPayoutForDetails,
    setSelectedPayoutForDetails,
  } = useAuth();

  // Handle Android Mobile Hardware & Gesture Back Navigation
  useEffect(() => {
    const handleHardwareBackPress = () => {
      // 1. If viewing Job Details full page -> go back to list
      if (selectedJobForDetails) {
        setSelectedJobForDetails(null);
        return true; // Prevent app exit
      }
      // 2. If viewing Payout Details full page -> go back to list
      if (selectedPayoutForDetails) {
        setSelectedPayoutForDetails(null);
        return true; // Prevent app exit
      }
      // 3. If on any other main tab -> go back to Dashboard
      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
        return true; // Prevent app exit
      }
      // 4. On Dashboard -> allow standard phone app exit
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleHardwareBackPress
    );

    return () => backHandler.remove();
  }, [
    selectedJobForDetails,
    selectedPayoutForDetails,
    activeTab,
    setSelectedJobForDetails,
    setSelectedPayoutForDetails,
    setActiveTab,
  ]);

  if (!isAuthenticated && !isLoadingSession) {
    return <LoginScreen />;
  }

  // Render standalone full screen details pages if active
  if (selectedJobForDetails) {
    return (
      <View style={styles.appContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.card} />
        <JobDetailsScreen />
      </View>
    );
  }

  if (selectedPayoutForDetails) {
    return (
      <View style={styles.appContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.card} />
        <PayoutDetailsScreen />
      </View>
    );
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

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  return (
    <View style={{ flex: 1 }}>
      <MainNavigator />
      {showSplash && (
        <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />
      )}
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
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
