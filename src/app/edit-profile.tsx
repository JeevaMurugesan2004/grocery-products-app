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
import { SafeImage } from '@/components/SafeImage';
import { useShop } from '@/context/ShopContext';

export default function EditProfileScreen() {
  const { user, updateProfile, switchRole } = useShop();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);

  // Errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Role check: Edit Profile is for Customer only
  if (user.role === 'Admin') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Cancel editing">
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.placeholderRight} />
        </View>

        <View style={styles.roleContainer}>
          <View style={styles.roleIconCircle}>
            <Ionicons name="person" size={44} color={COLORS.text} />
          </View>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>Customer Role Only</Text>
          </View>
          <Text style={styles.roleTitle}>Edit Profile Access</Text>
          <Text style={styles.roleDescription}>
            The Edit Profile screen is reserved exclusively for Customer accounts to update personal delivery details and contact information.
          </Text>
          <Text style={styles.roleSubdescription}>
            Administrators manage store operations. Switch to Customer mode to edit the Customer profile.
          </Text>

          <TouchableOpacity
            style={styles.switchActionButton}
            onPress={() => switchRole('Customer')}
            activeOpacity={0.85}>
            <Ionicons name="swap-horizontal" size={18} color={COLORS.text} />
            <Text style={styles.switchActionText}>Switch to Customer Role</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backSecondaryButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Text style={styles.backSecondaryText}>Back to Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const validate = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setAddressError('');

    if (!name.trim()) {
      setNameError('Full name is required.');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (phone.trim() && !/^[0-9+\s-]{8,15}$/.test(phone.trim())) {
      setPhoneError('Please enter a valid phone number (8-15 digits).');
      isValid = false;
    }

    if (!address.trim()) {
      setAddressError('Delivery address is required for grocery dispatch.');
      isValid = false;
    }

    return isValid;
  };

  const handleSave = () => {
    if (!validate()) return;

    updateProfile({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      router.back();
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Cancel editing">
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.placeholderRight} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Avatar Preview */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, SHADOWS.small]}>
              {user.avatarUrl ? (
                <SafeImage uri={user.avatarUrl} style={styles.avatar} resizeMode="cover" />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>{name.charAt(0) || 'U'}</Text>
                </View>
              )}
            </View>
            <Text style={styles.roleTag}>{user.role} Account</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Name */}
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
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (nameError) setNameError('');
                  }}
                  placeholder="Enter full name"
                  placeholderTextColor={COLORS.lightText}
                />
              </View>
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            {/* Email */}
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
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="Enter email address"
                  placeholderTextColor={COLORS.lightText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
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
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (phoneError) setPhoneError('');
                  }}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={COLORS.lightText}
                  keyboardType="phone-pad"
                />
              </View>
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}
            </View>

            {/* Delivery Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Default Delivery Address *</Text>
              <View
                style={[
                  styles.inputContainer,
                  styles.textAreaContainer,
                  addressError ? styles.inputError : null,
                ]}>
                <Ionicons
                  name="location-outline"
                  size={19}
                  color={COLORS.secondaryText}
                  style={[styles.inputIcon, styles.textAreaIcon]}
                />
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  value={address}
                  onChangeText={(val) => {
                    setAddress(val);
                    if (addressError) setAddressError('');
                  }}
                  placeholder="Enter delivery address, apartment, street, city"
                  placeholderTextColor={COLORS.lightText}
                  multiline
                  numberOfLines={3}
                />
              </View>
              {addressError ? (
                <Text style={styles.errorText}>{addressError}</Text>
              ) : null}
            </View>

            {/* Success message banner */}
            {savedSuccess ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.successText}>
                  Profile changes saved successfully!
                </Text>
              </View>
            ) : null}

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, SHADOWS.small]}
              onPress={handleSave}
              activeOpacity={0.85}
              accessibilityLabel="Save profile updates">
              <Ionicons name="save-outline" size={18} color={COLORS.text} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              activeOpacity={0.7}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECE7CE',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  placeholderRight: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 36,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: 'hidden',
    backgroundColor: '#E4DFBF',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.text,
  },
  roleTag: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondaryText,
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
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
  textAreaContainer: {
    height: 86,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginRight: 10,
  },
  textAreaIcon: {
    marginTop: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    color: COLORS.text,
  },
  textAreaInput: {
    textAlignVertical: 'top',
    height: '100%',
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
    marginBottom: 16,
  },
  successText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.success,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  roleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  roleIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  rolePill: {
    backgroundColor: COLORS.selected,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  rolePillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  roleDescription: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 6,
  },
  roleSubdescription: {
    fontSize: 13,
    color: COLORS.lightText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  switchActionButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 18,
    width: '100%',
    marginBottom: 12,
  },
  switchActionText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  backSecondaryButton: {
    paddingVertical: 12,
  },
  backSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondaryText,
    textDecorationLine: 'underline',
  },
});
