import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { useShop, UserRole } from '@/context/ShopContext';
import { SafeImage } from './SafeImage';

export const CustomDrawerContent: React.FC<any> = (props) => {
  const { user, switchRole, signOut, totalCartItems, favourites } = useShop();

  const handleNavigate = (path: string) => {
    props.navigation.closeDrawer();
    router.push(path as any);
  };

  const handleRoleToggle = () => {
    const nextRole: UserRole = user.role === 'Admin' ? 'Customer' : 'Admin';
    switchRole(nextRole);
  };

  const handleLogout = () => {
    props.navigation.closeDrawer();
    signOut();
    router.replace('/signin');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left']}>
      {/* Drawer User Header */}
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarContainer}>
            {user.avatarUrl ? (
              <SafeImage uri={user.avatarUrl} style={styles.avatar} resizeMode="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{user.name.charAt(0)}</Text>
              </View>
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
          </View>
        </View>

        {/* Role Badge & Switcher for Demo */}
        <View style={styles.roleContainer}>
          <View
            style={[
              styles.roleBadge,
              user.role === 'Admin' ? styles.adminBadge : styles.customerBadge,
            ]}>
            <Ionicons
              name={user.role === 'Admin' ? 'shield-checkmark' : 'person'}
              size={13}
              color={COLORS.text}
            />
            <Text style={styles.roleText}>{user.role} Mode</Text>
          </View>

          <TouchableOpacity
            style={styles.switchRoleButton}
            onPress={handleRoleToggle}
            activeOpacity={0.7}
            accessibilityLabel="Switch demo role">
            <Text style={styles.switchRoleText}>Switch Role</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Drawer Navigation Items */}
      <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuContent}>
        <Text style={styles.sectionTitle}>SHOPPING NAVIGATION</Text>

        {/* 1. Daily Grocery Products */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate('/(drawer)/(tabs)')}
          activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <Ionicons name="storefront-outline" size={20} color={COLORS.text} />
          </View>
          <Text style={styles.menuItemText}>Daily Grocery</Text>
        </TouchableOpacity>

        {/* Admin Add Product (Admin Only) */}
        {user.role === 'Admin' && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigate('/add-product')}
            activeOpacity={0.7}>
            <View style={[styles.iconCircle, styles.adminIconCircle]}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.text} />
            </View>
            <View style={styles.menuItemLabelCol}>
              <Text style={styles.menuItemText}>Add Product</Text>
              <Text style={styles.adminExclusiveTag}>Admin only</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* 2. Customer Favourite Products (Customer Only) */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate('/(drawer)/(tabs)/favourites')}
          activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={20} color={COLORS.danger} />
          </View>
          <View style={styles.menuItemLabelCol}>
            <Text style={styles.menuItemText}>Add Favourites</Text>
            {user.role === 'Admin' && (
              <Text style={styles.roleExclusiveTag}>Customer only</Text>
            )}
          </View>
          {user.role === 'Customer' && favourites.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{favourites.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 3. My Cart (Admin and Customer) */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate('/(drawer)/(tabs)/cart')}
          activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <Ionicons name="cart-outline" size={20} color={COLORS.text} />
          </View>
          <View style={styles.menuItemLabelCol}>
            <Text style={styles.menuItemText}>My Cart</Text>
          </View>
          {totalCartItems > 0 && (
            <View style={[styles.badge, styles.cartBadge]}>
              <Text style={styles.badgeText}>{totalCartItems}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 4. Customer Profile (Customer Only) */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate('/(drawer)/(tabs)/profile')}
          activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-outline" size={20} color={COLORS.text} />
          </View>
          <View style={styles.menuItemLabelCol}>
            <Text style={styles.menuItemText}>Customer Profile</Text>
            {user.role === 'Admin' && (
              <Text style={styles.roleExclusiveTag}>Customer only</Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>SUPPORT & SETTINGS</Text>

        {/* 5. Order Information & Help */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate('/(drawer)/help')}
          activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <Ionicons name="help-circle-outline" size={20} color={COLORS.text} />
          </View>
          <Text style={styles.menuItemText}>Order Info & Help</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Drawer Footer with Logout */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityLabel="Log out">
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#F5F5D9',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E4CE',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#E4DFBF',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ECECBF',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  customerBadge: {
    backgroundColor: '#FFE600',
  },
  adminBadge: {
    backgroundColor: '#D8C51D',
  },
  roleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  switchRoleButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2DEC2',
  },
  switchRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.secondaryText,
    marginVertical: 10,
    marginLeft: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemLabelCol: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  roleExclusiveTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9C6F00',
    marginTop: 1,
  },
  adminIconCircle: {
    backgroundColor: COLORS.primary,
  },
  adminExclusiveTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B7B12',
    marginTop: 1,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cartBadge: {
    backgroundColor: COLORS.selected,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#ECE7D0',
    marginVertical: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECE7D0',
    backgroundColor: COLORS.card,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    backgroundColor: '#FFF2F2',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F8D7D7',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.danger,
  },
});
