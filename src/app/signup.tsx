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

export default function SignUpScreen() {
  const { signUp } = useShop();

  const [role, setRole] = useState<UserRole>('Customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Errors state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmError('');

    // Name check
    if (!name.trim()) {
      setNameError('Full name is required.');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters long.');
      isValid = false;
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    // Phone check (optional format check if filled)
    if (phone.trim() && !/^[0-9+\s-]{8,15}$/.test(phone.trim())) {
      setPhoneError('Please enter a valid phone number.');
      isValid = false;
    }

    // Password check
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    // Confirm password check
    if (!confirmPassword) {
      setConfirmError('Please confirm your password.');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = () => {
    if (!validate()) return;

    signUp(name, email, role, phone);
    setSuccessMsg('Account created successfully! Taking you in...');
    setTimeout(() => {
      router.replace('/(drawer)/(tabs)');
    }, 400);
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Grocery Shop to enjoy daily fresh produce
            </Text>
          </View>

          {/* Role Selection */}
          <View style={styles.roleTabsContainer}>
            <Text style={styles.inputLabel}>I am registering as:</Text>
            <View style={styles.roleTabs}>
              <TouchableOpacity
                style={[
                  styles.roleTab,
                  role === 'Customer' && styles.roleTabActive,
                ]}
                onPress={() => setRole('Customer')}
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
                onPress={() => setRole('Admin')}
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

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <View
                style={[
                  styles.inputContainer,
                  nameError ? styles.inputError : null,
                ]}>
                <Ionicons
                  name="person-outline"
                  size={19}
                  color={COLORS.secondaryText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Priya Sharma"
                  placeholderTextColor={COLORS.lightText}
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (nameError) setNameError('');
                  }}
                />
              </View>
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
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
                  placeholder="e.g. priya@example.com"
                  placeholderTextColor={COLORS.lightText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (emailError) setEmailError('');
                  }}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
              <View
                style={[
                  styles.inputContainer,
                  phoneError ? styles.inputError : null,
                ]}>
                <Ionicons
                  name="call-outline"
                  size={19}
                  color={COLORS.secondaryText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={COLORS.lightText}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (phoneError) setPhoneError('');
                  }}
                />
              </View>
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password (min. 6 characters) *</Text>
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
                  placeholder="Create a strong password"
                  placeholderTextColor={COLORS.lightText}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
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

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password *</Text>
              <View
                style={[
                  styles.inputContainer,
                  confirmError ? styles.inputError : null,
                ]}>
                <Ionicons
                  name="shield-outline"
                  size={19}
                  color={COLORS.secondaryText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Re-enter your password"
                  placeholderTextColor={COLORS.lightText}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    if (confirmError) setConfirmError('');
                  }}
                />
              </View>
              {confirmError ? (
                <Text style={styles.errorText}>{confirmError}</Text>
              ) : null}
            </View>

            {successMsg ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.successText}>{successMsg}</Text>
              </View>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, SHADOWS.small]}
              onPress={handleSignUp}
              activeOpacity={0.85}>
              <Text style={styles.submitButtonText}>Create Account</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signin')}>
              <Text style={styles.footerLink}>Sign In</Text>
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
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    marginTop: 4,
    textAlign: 'center',
  },
  roleTabsContainer: {
    marginBottom: 16,
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
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 14,
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EBF5E7',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },
  successText: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
