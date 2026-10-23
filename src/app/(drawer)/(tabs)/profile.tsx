import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SHADOWS } from '@/constants/theme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SafeImage } from '@/components/SafeImage';
import { useShop, UserRole } from '@/context/ShopContext';

export default function ProfileScreen() {
  const { user, switchRole, signOut, orders } = useShop();

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleToggleRole = () => {
    const nextRole: UserRole = user.role === 'Admin' ? 'Customer' : 'Admin';
    switchRole(nextRole);
  };

  const handleLogout = () => {
    signOut();
    router.replace('/signin');
  };

  // Role check: Profile & Edit Profile is for Customer only
  if (user.role === 'Admin') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />
        <ScreenHeader
          title="Customer Profile"
          subtitle="Customer Role Only"
          showDrawer={true}
          showCart={true}
        />
        <View style={styles.roleContainer}>
          <View style={styles.roleIconCircle}>
            <Ionicons name="person" size={44} color={COLORS.text} />
          </View>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>Customer Role Only</Text>
          </View>
          <Text style={styles.roleTitle}>Profile & Edit Profile</Text>
          <Text style={styles.roleDescription}>
            The Profile and Edit Profile screens are reserved exclusively for Customer accounts to manage personal delivery information and review order history.
          </Text>
          <Text style={styles.roleSubdescription}>
            You are currently signed in as an Administrator. Switch to Customer mode below to view and edit the Customer profile.
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
            onPress={() => router.push('/(drawer)/(tabs)')}
            activeOpacity={0.7}>
            <Text style={styles.backSecondaryText}>Browse Daily Grocery</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Header */}
      <ScreenHeader
        title="Customer Profile"
        subtitle={user.role}
        showDrawer={true}
        showCart={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, SHADOWS.small]}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              {user.avatarUrl ? (
                <SafeImage uri={user.avatarUrl} style={styles.avatar} resizeMode="cover" />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
              )}
            </View>

            <View style={styles.userMainInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>

              {/* Role badge */}
              <View style={[styles.roleBadge, styles.customerBadge]}>
                <Ionicons name="person" size={12} color={COLORS.text} />
                <Text style={styles.roleBadgeText}>Customer Account</Text>
              </View>
            </View>
          </View>

          {/* Contact Details */}
          <View style={styles.contactDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={17} color={COLORS.secondaryText} />
              <Text style={styles.detailText}>{user.phone}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={17} color={COLORS.secondaryText} />
              <Text style={styles.detailText}>{user.address}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.profileActionRow}>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handleEditProfile}
              activeOpacity={0.8}>
              <Ionicons name="create-outline" size={17} color={COLORS.text} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleSwitchButton}
              onPress={handleToggleRole}
              activeOpacity={0.8}>
              <Ionicons name="swap-horizontal" size={16} color={COLORS.secondaryText} />
              <Text style={styles.roleSwitchText}>Switch Role</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Order History Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order History ({orders.length})</Text>
          <Text style={styles.sectionSubtitle}>Recent grocery deliveries</Text>
        </View>

        {orders.length > 0 ? (
          <View style={styles.ordersList}>
            {orders.map((order) => (
              <View key={order.id} style={[styles.orderCard, SHADOWS.small]}>
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      order.status === 'Delivered'
                        ? styles.deliveredPill
                        : styles.confirmedPill,
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        order.status === 'Delivered'
                          ? styles.deliveredText
                          : styles.confirmedText,
                      ]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                {/* Items in order */}
                <View style={styles.orderItemsBreakdown}>
                  {order.items.map((item, idx) => (
                    <Text key={idx} style={styles.orderItemRow}>
                      • {item.product.name} ({item.quantity}x) — ₹
                      {item.price * item.quantity}
                    </Text>
                  ))}
                </View>

                <View style={styles.orderCardFooter}>
                  <Text style={styles.orderTotalLabel}>Total Paid:</Text>
                  <Text style={styles.orderTotalAmount}>₹{order.total}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noOrdersCard}>
            <Text style={styles.noOrdersText}>No past orders yet.</Text>
          </View>
        )}

        {/* Support & Logout Section */}
        <View style={styles.actionsList}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/(drawer)/help')}
            activeOpacity={0.7}>
            <View style={styles.actionIconCircle}>
              <Ionicons name="help-circle-outline" size={20} color={COLORS.text} />
            </View>
            <Text style={styles.actionItemTitle}>Order Information & Help</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.secondaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, styles.logoutActionItem]}
            onPress={handleLogout}
            activeOpacity={0.7}>
            <View style={[styles.actionIconCircle, styles.logoutIconCircle]}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            </View>
            <Text style={styles.logoutActionTitle}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    overflow: 'hidden',
    backgroundColor: '#E4DFBF',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
  },
  userMainInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  customerBadge: {
    backgroundColor: COLORS.selected,
  },
  adminBadge: {
    backgroundColor: COLORS.primary,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
  },
  contactDetails: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ECE7CE',
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
    lineHeight: 18,
  },
  profileActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  editProfileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  roleSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2DEC2',
  },
  roleSwitchText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  ordersList: {
    gap: 12,
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  deliveredPill: {
    backgroundColor: '#EBF5E7',
  },
  confirmedPill: {
    backgroundColor: '#FFF2D6',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  deliveredText: {
    color: COLORS.success,
  },
  confirmedText: {
    color: '#8A6800',
  },
  orderItemsBreakdown: {
    marginVertical: 6,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E8E2CB',
    gap: 4,
  },
  orderItemRow: {
    fontSize: 12.5,
    color: COLORS.secondaryText,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  orderTotalLabel: {
    fontSize: 13,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  orderTotalAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  noOrdersCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  noOrdersText: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
  actionsList: {
    gap: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  actionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionItemTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  logoutActionItem: {
    backgroundColor: '#FFF5F5',
    borderColor: '#F8D7D7',
  },
  logoutIconCircle: {
    backgroundColor: '#FFEAEA',
  },
  logoutActionTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.danger,
    flex: 1,
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
