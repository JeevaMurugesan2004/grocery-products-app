import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, ProductCategory } from '@/data/products';
import { COLORS } from '@/constants/theme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ProductCard } from '@/components/ProductCard';
import { PromoCarousel } from '@/components/PromoCarousel';
import { useShop } from '@/context/ShopContext';

export type ActiveCategoryFilter = ProductCategory | 'Fresh Fruits & Veg';

export default function ProductsListScreen() {
  const { user, products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<ActiveCategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  // Focus effect to pause/resume promotional auto-sliding
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => {
        setIsScreenFocused(false);
      };
    }, [])
  );

  // Filter products by selected category and search term
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All'
          ? true
          : selectedCategory === 'Fresh Fruits & Veg'
          ? product.category === 'Fruits' || product.category === 'Vegetables'
          : product.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleSelectDairy = () => {
    setSelectedCategory('Dairy');
    setSearchQuery('');
  };

  const handleSelectFruitsAndVeg = () => {
    setSelectedCategory('Fresh Fruits & Veg');
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Header with Drawer button & Cart badge */}
      <ScreenHeader
        title="Grocery Shop"
        subtitle={`Welcome, ${user.name.split(' ')[0]}`}
        showDrawer={true}
        showCart={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleTextCol}>
            <Text style={styles.title}>Daily Grocery Food</Text>
            <Text style={styles.subtitle}>Fresh picks for your healthy home</Text>
          </View>
          {user.role === 'Admin' && (
            <TouchableOpacity
              style={styles.adminAddButton}
              onPress={() => router.push('/add-product')}
              activeOpacity={0.85}
              accessibilityLabel="Add New Grocery Product">
              <Ionicons name="add" size={17} color={COLORS.text} />
              <Text style={styles.adminAddButtonText}>Add Product</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.secondaryText}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search fresh vegetables, fruits..."
            placeholderTextColor={COLORS.lightText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchButton}
              accessibilityLabel="Clear search text">
              <Ionicons name="close-circle" size={18} color={COLORS.secondaryText} />
            </TouchableOpacity>
          )}
        </View>

        {/* Automatic Promotional Advertisement Slider / Carousel */}
        <PromoCarousel
          isActive={isScreenFocused}
          onSelectDairy={handleSelectDairy}
          onSelectFruitsAndVeg={handleSelectFruitsAndVeg}
        />

        {/* Active Promotional Filter Banner (if Fresh Fruits & Veg promo active) */}
        {selectedCategory === 'Fresh Fruits & Veg' && (
          <View style={styles.activePromoFilterRow}>
            <View style={styles.activePromoBadge}>
              <Ionicons name="leaf" size={13} color="#1E5E3A" />
              <Text style={styles.activePromoText}>
                Promotional Filter: Fresh Fruits & Vegetables (20% OFF)
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedCategory('All')}
              style={styles.clearPromoFilterButton}
              activeOpacity={0.7}
              accessibilityLabel="Clear promo filter">
              <Text style={styles.clearPromoFilterText}>Show All</Text>
              <Ionicons name="close-circle" size={15} color="#1E5E3A" />
            </TouchableOpacity>
          </View>
        )}

        {/* Category Pills */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}>
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}>
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextActive,
                    ]}>
                    {category}
                  </Text>
                  {category !== 'All' && (
                    <Text
                      style={[
                        styles.categoryCount,
                        isSelected && styles.categoryCountActive,
                      ]}>
                      {
                        products.filter((p) => p.category === category).length
                      }
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Product Count & Active Category Indicator */}
        <View style={styles.resultsInfoRow}>
          <Text style={styles.resultsCountText}>
            Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
          </Text>
          {searchQuery ? (
            <Text style={styles.filterTag}>Filter: &ldquo;{searchQuery}&rdquo;</Text>
          ) : null}
        </View>

        {/* 2-Column Product Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <View style={styles.productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="search" size={38} color={COLORS.secondaryText} />
            </View>
            <Text style={styles.emptyTitle}>No Products Found</Text>
            <Text style={styles.emptyMessage}>
              We couldn&apos;t find any grocery items matching &ldquo;{searchQuery}&rdquo; in {selectedCategory}.
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              activeOpacity={0.8}>
              <Ionicons name="refresh" size={16} color={COLORS.text} />
              <Text style={styles.resetButtonText}>Reset Filters & Search</Text>
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
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleTextCol: {
    flex: 1,
  },
  adminAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4,
  },
  adminAddButtonText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.text,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECE7CE',
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  clearSearchButton: {
    padding: 6,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    gap: 10,
    paddingRight: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5D9',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ECE7CE',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: COLORS.selected,
    borderColor: '#E2CA00',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  categoryChipTextActive: {
    color: COLORS.text,
  },
  categoryCount: {
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    color: COLORS.secondaryText,
  },
  categoryCountActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: COLORS.text,
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultsCountText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  filterTag: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.secondaryText,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptyMessage: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 18,
  },
  resetButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  activePromoFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  activePromoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  activePromoText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E5E3A',
  },
  clearPromoFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 8,
  },
  clearPromoFilterText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E5E3A',
    textDecorationLine: 'underline',
  },
});
