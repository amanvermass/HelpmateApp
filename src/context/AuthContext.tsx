import React, { createContext, useContext, useState } from 'react';
import { partnerProfileData, initialNotifications, AppNotification } from '../data/mockData';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginMode, setLoginMode] = useState<LoginMode>('partner');
  const [partnerUser, setPartnerUser] = useState<typeof partnerProfileData | null>(partnerProfileData);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

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
        setActiveTab,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
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
