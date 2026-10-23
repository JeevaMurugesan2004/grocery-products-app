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
import { COLORS } from '@/constants/theme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ProductCard } from '@/components/ProductCard';
import { useShop } from '@/context/ShopContext';

export default function FavouritesScreen() {
  const { user, switchRole, favouriteProducts, favourites } = useShop();

  const handleExplore = () => {
    router.push('/(drawer)/(tabs)');
  };

  // Role check: Favourites screen is for Customer only
  if (user.role === 'Admin') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />
        <ScreenHeader
          title="Favourites"
          subtitle="Customer Feature"
          showDrawer={true}
          showCart={true}
        />
        <View style={styles.roleContainer}>
          <View style={styles.roleIconCircle}>
            <Ionicons name="heart" size={44} color={COLORS.danger} />
          </View>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>Customer Role Only</Text>
          </View>
          <Text style={styles.roleTitle}>Add & Manage Favourites</Text>
          <Text style={styles.roleDescription}>
            The Favourites screen is designed exclusively for Customer accounts to bookmark and quickly reorder their favourite fresh produce.
          </Text>
          <Text style={styles.roleSubdescription}>
            You are currently signed in as an Administrator. Switch to Customer mode below to test the Favourites feature.
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
            onPress={handleExplore}
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
        title="Favourites"
        subtitle={`${favourites.length} saved item${favourites.length === 1 ? '' : 's'}`}
        showDrawer={true}
        showCart={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Your Favourites</Text>
          <Text style={styles.subtitle}>
            Quick access to the fresh groceries you love most
          </Text>
        </View>

        {/* Two-Column Favourites Grid or Empty State */}
        {favouriteProducts.length > 0 ? (
          <View style={styles.productGrid}>
            {favouriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showRemoveFavourite={true}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-dislike-outline" size={44} color={COLORS.danger} />
            </View>
            <Text style={styles.emptyTitle}>No Favourites Saved</Text>
            <Text style={styles.emptyMessage}>
              You haven&apos;t marked any grocery items as favourites yet. Tap the heart
              icon on any fruit or vegetable to save it here for quick reordering!
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={handleExplore}
              activeOpacity={0.85}>
              <Ionicons name="storefront" size={17} color={COLORS.text} />
              <Text style={styles.exploreButtonText}>Browse Fresh Grocery</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 28,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  titleSection: {
    marginTop: 6,
    marginBottom: 18,
  },
  title: {
    fontSize: 27,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    marginTop: 3,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FDEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 290,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 22,
  },
  exploreButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
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
    backgroundColor: '#FDEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F8D7D7',
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
