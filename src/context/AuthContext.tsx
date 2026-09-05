import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { partnerProfileData, initialNotifications, AppNotification, Booking, PayoutRecord } from '../data/mockData';

export type LoginMode = 'partner' | 'super_admin' | 'office_admin';

export type ActiveTabType = 'dashboard' | 'bookings' | 'payouts' | 'services' | 'profile' | 'notifications';

const SESSION_KEY = '@helpmate_auth_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours in milliseconds

interface AuthContextType {
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  loginMode: LoginMode;
  setLoginMode: (mode: LoginMode) => void;
  partnerUser: typeof partnerProfileData | null;
  login: (identifier: string, pass: string, mode?: LoginMode) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  selectedJobForDetails: Booking | null;
  setSelectedJobForDetails: (job: Booking | null) => void;
  selectedPayoutForDetails: PayoutRecord | null;
  setSelectedPayoutForDetails: (payout: PayoutRecord | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [loginMode, setLoginMode] = useState<LoginMode>('partner');
  const [partnerUser, setPartnerUser] = useState<typeof partnerProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Booking | null>(null);
  const [selectedPayoutForDetails, setSelectedPayoutForDetails] = useState<PayoutRecord | null>(null);

  // Load and validate 24-hour persistent session on app initialization
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem(SESSION_KEY);
        if (storedSession) {
          const { isAuthenticated: isAuth, loginTimestamp } = JSON.parse(storedSession);
          const elapsed = Date.now() - loginTimestamp;

          // Check if session is within the 24-hour window
          if (isAuth && elapsed < SESSION_DURATION_MS) {
            setIsAuthenticated(true);
            setPartnerUser(partnerProfileData);
            setActiveTab('dashboard');
          } else {
            // Session expired (older than 24h) -> clear session
            await AsyncStorage.removeItem(SESSION_KEY);
            setIsAuthenticated(false);
            setPartnerUser(null);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoadingSession(false);
      }
    };

    checkSession();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const login = async (identifier: string, pass: string, mode: LoginMode = loginMode) => {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId || !pass) {
      return { success: false, error: 'Please enter both Email/Phone and Password.' };
    }

    const sessionData = {
      isAuthenticated: true,
      loginTimestamp: Date.now(),
      identifier: cleanId,
    };

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    setIsAuthenticated(true);
    setPartnerUser(partnerProfileData);
    setActiveTab('dashboard');
    return { success: true };
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    setIsAuthenticated(false);
    setPartnerUser(null);
    setSelectedJobForDetails(null);
    setSelectedPayoutForDetails(null);
  };

  const handleSetActiveTab = (tab: ActiveTabType) => {
    setSelectedJobForDetails(null);
    setSelectedPayoutForDetails(null);
    setActiveTab(tab);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoadingSession,
        loginMode,
        setLoginMode,
        partnerUser,
        login,
        logout,
        activeTab,
        setActiveTab: handleSetActiveTab,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        selectedJobForDetails,
        setSelectedJobForDetails,
        selectedPayoutForDetails,
        setSelectedPayoutForDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
