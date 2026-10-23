import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useShop, UserRole } from '@/context/ShopContext';

export default function SignInScreen() {
  const { signIn } = useShop();

  const [role, setRole] = useState<UserRole>('Customer');
  const [email, setEmail] = useState('customer@groceryshop.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Errors state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formFeedback, setFormFeedback] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setFormFeedback('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleSignIn = () => {
    if (!validate()) return;

    const name = role === 'Admin' ? 'Admin Manager' : 'Aarav Sharma';
    signIn(email, role, name);
    setFormFeedback('Signed in successfully! Redirecting...');
    setTimeout(() => {
      router.replace('/(drawer)/(tabs)');
    }, 300);
  };

  const handleQuickFill = (targetRole: UserRole) => {
    setRole(targetRole);
    if (targetRole === 'Admin') {
      setEmail('admin@groceryshop.com');
      setPassword('adminpass');
    } else {
      setEmail('customer@groceryshop.com');
      setPassword('password123');
    }
    setEmailError('');
    setPasswordError('');
  };

  const handleGuest = () => {
    signIn('guest@groceryshop.com', 'Customer', 'Guest Shopper');
    router.replace('/(drawer)/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              accessibilityLabel="Back">
              <Ionicons name="arrow-back" size={22} color={COLORS.text} />
            </TouchableOpacity>

            <View style={styles.headerIconContainer}>
              <Ionicons name="basket" size={32} color={COLORS.text} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to your Grocery Shop account
            </Text>
          </View>

          {/* Role Selection Tabs */}
          <View style={styles.roleTabsContainer}>
            <Text style={styles.inputLabel}>Select Your Role:</Text>
            <View style={styles.roleTabs}>
              <TouchableOpacity
                style={[
                  styles.roleTab,
                  role === 'Customer' && styles.roleTabActive,
                ]}
                onPress={() => handleQuickFill('Customer')}
                activeOpacity={0.8}>
                <Ionicons
                  name="person"
                  size={16}
                  color={role === 'Customer' ? COLORS.text : COLORS.secondaryText}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'Customer' && styles.roleTabTextActive,
                  ]}>
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleTab,
                  role === 'Admin' && styles.roleTabActive,
                ]}
                onPress={() => handleQuickFill('Admin')}
                activeOpacity={0.8}>
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={role === 'Admin' ? COLORS.text : COLORS.secondaryText}
                />
                <Text
                  style={[
                    styles.roleTabText,
                    role === 'Admin' && styles.roleTabTextActive,
                  ]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Demo Pill */}
          <TouchableOpacity
            style={styles.quickFillPill}
            onPress={() => handleQuickFill(role)}
            activeOpacity={0.7}>
            <Ionicons name="flash" size={14} color="#8A7A08" />
            <Text style={styles.quickFillText}>
              Click to autofill demo credentials for {role}
            </Text>
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  emailError ? styles.inputError : null,
                ]}>
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color={COLORS.secondaryText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@example.com"
                  placeholderTextColor={COLORS.lightText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  passwordError ? styles.inputError : null,
                ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color={COLORS.secondaryText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.lightText}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={19}
                    color={COLORS.secondaryText}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            {formFeedback ? (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>{formFeedback}</Text>
              </View>
            ) : null}

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.submitButton, SHADOWS.small]}
              onPress={handleSignIn}
              activeOpacity={0.85}>
              <Text style={styles.submitButtonText}>Sign In as {role}</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.text} />
            </TouchableOpacity>

            {/* Guest Action */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuest}
              activeOpacity={0.7}>
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>

          {/* Footer - Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account yet? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    marginTop: 4,
    textAlign: 'center',
  },
  roleTabsContainer: {
    marginBottom: 14,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#EBEBC8',
    borderRadius: 16,
    padding: 4,
    marginTop: 6,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  roleTabActive: {
    backgroundColor: COLORS.selected,
  },
  roleTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  roleTabTextActive: {
    color: COLORS.text,
  },
  quickFillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5F5D9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  quickFillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A5E04',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E2CB',
    paddingHorizontal: 14,
    height: 52,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    color: COLORS.text,
  },
  eyeIcon: {
    padding: 6,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '600',
  },
  feedbackContainer: {
    backgroundColor: '#EBF5E7',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.success,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  guestButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
  },
  footerLink: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.text,
    textDecorationLine: 'underline',
  },
});
