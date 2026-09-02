import React, { createContext, useContext, useState } from 'react';
import { partnerProfileData, initialNotifications, AppNotification, Booking, PayoutRecord } from '../data/mockData';

export type LoginMode = 'partner' | 'super_admin' | 'office_admin';

export type ActiveTabType = 'dashboard' | 'bookings' | 'payouts' | 'services' | 'profile' | 'notifications';

interface AuthContextType {
  isAuthenticated: boolean;
  loginMode: LoginMode;
  setLoginMode: (mode: LoginMode) => void;
  partnerUser: typeof partnerProfileData | null;
  login: (identifier: string, pass: string, mode?: LoginMode) => { success: boolean; error?: string };
  logout: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginMode, setLoginMode] = useState<LoginMode>('partner');
  const [partnerUser, setPartnerUser] = useState<typeof partnerProfileData | null>(partnerProfileData);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Booking | null>(null);
  const [selectedPayoutForDetails, setSelectedPayoutForDetails] = useState<PayoutRecord | null>(null);

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

  const login = (identifier: string, pass: string, mode: LoginMode = loginMode) => {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId || !pass) {
      return { success: false, error: 'Please enter both Email/Phone and Password.' };
    }

    setIsAuthenticated(true);
    setPartnerUser(partnerProfileData);
    setActiveTab('dashboard');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPartnerUser(null);
  };

  const handleSetActiveTab = (tab: ActiveTabType) => {
    // Reset full screen details when changing main tabs
    setSelectedJobForDetails(null);
    setSelectedPayoutForDetails(null);
    setActiveTab(tab);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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
