import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, shadow } from '../styles/theme';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('9839011220');
  const [password, setPassword] = useState('partner2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setErrorMessage('');
    if (!identifier || !password) {
      setErrorMessage('Please enter both email/phone and password.');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      const res = await login(identifier, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Login failed.');
      }
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo & Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoCard}>
              <Image
                source={{ uri: 'https://helpmate-theta.vercel.app/logo.png' }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.portalTitle}>HelpMate</Text>
            <Text style={styles.portalSubtitle}>
              Sign in with your registered Email / Phone Number & Password
            </Text>
          </View>

          {/* Clean Login Form Card */}
          <View style={styles.card}>
            {/* Error Display */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Email / Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email or Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Mail size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email or 10-digit phone"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  value={identifier}
                  onChangeText={setIdentifier}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={colors.textMuted} />
                  ) : (
                    <Eye size={18} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <Text style={styles.submitBtnText}>Authenticating...</Text>
              ) : (
                <View style={styles.btnRow}>
                  <Text style={styles.submitBtnText}>Sign In</Text>
                  <ArrowRight size={18} color={colors.card} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>
            HelpMate © 2026 • Service Network
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
    minHeight: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCard: {
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    ...shadow.sm,
  },
  logoImage: {
    height: 52,
    width: 170,
  },
  portalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  portalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.md,
  },
  errorBox: {
    backgroundColor: colors.roseLight,
    borderWidth: 1,
    borderColor: colors.roseBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: colors.rose,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  eyeIcon: {
    padding: 8,
  },
  submitBtn: {
    backgroundColor: colors.brand500,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...shadow.lux,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '800',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 24,
    fontWeight: '500',
  },
});
