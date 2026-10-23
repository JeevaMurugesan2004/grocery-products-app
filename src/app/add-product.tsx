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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '@/constants/theme';
import { SafeImage } from '@/components/SafeImage';
import { useShop } from '@/context/ShopContext';
import { ProductGroupCategory } from '@/data/products';

// 1-Tap Autofill Presets for Tomato, Apple, Rice, Milk, and Bread
const PRESET_PRODUCTS: {
  name: string;
  category: ProductGroupCategory;
  price: string;
  unit: string;
  image: string;
  rating: string;
  description: string;
  origin: string;
}[] = [
  {
    name: 'Tomato',
    category: 'Vegetables',
    price: '40',
    unit: 'kg',
    image:
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=700&auto=format&fit=crop&q=80',
    rating: '4.7',
    description:
      'Juicy, vine-ripened red tomatoes picked fresh. Rich in antioxidants and vitamins, ideal for curries, salads, and soups.',
    origin: 'Greenhouse Organic',
  },
  {
    name: 'Apple',
    category: 'Fruits',
    price: '140',
    unit: 'kg',
    image:
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=700&auto=format&fit=crop&q=80',
    rating: '4.8',
    description:
      'Crisp, juicy Royal Gala apples with sweet aromatic flavor. Packed with fiber and vitamin C for your daily energy.',
    origin: 'Mountain Orchards',
  },
  {
    name: 'Rice',
    category: 'Rice & Grains',
    price: '110',
    unit: 'kg',
    image:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&auto=format&fit=crop&q=80',
    rating: '4.9',
    description:
      'Aged long-grain royal Basmati rice with exquisite aroma and slender fluffy grains. Perfect for biryanis, pulao, and daily meals.',
    origin: 'Punjab Foothills',
  },
  {
    name: 'Milk',
    category: 'Dairy',
    price: '65',
    unit: 'litre',
    image:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&auto=format&fit=crop&q=80',
    rating: '4.8',
    description:
      'Pure, pasteurized farm-fresh whole milk rich in natural calcium, vitamin D, and protein. Wholesome and creamy for daily vitality.',
    origin: 'Dairy Pastures',
  },
  {
    name: 'Bread',
    category: 'Bakery',
    price: '45',
    unit: 'pack',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&auto=format&fit=crop&q=80',
    rating: '4.6',
    description:
      'Freshly baked 100% whole wheat bread loaf with golden crust and soft texture. High in dietary fiber, ideal for breakfast toasts.',
    origin: 'Artisan Bakehouse',
  },
];

// All 7 Supported Categories
const CATEGORY_OPTIONS: ProductGroupCategory[] = [
  'Vegetables',
  'Fruits',
  'Rice & Grains',
  'Dairy',
  'Bakery',
  'Beverages',
  'Pantry',
];

// Category Icons Mapping
const CATEGORY_ICONS: Record<ProductGroupCategory, keyof typeof Ionicons.glyphMap> = {
  Vegetables: 'leaf',
  Fruits: 'nutrition',
  'Rice & Grains': 'layers',
  Dairy: 'water',
  Bakery: 'pizza',
  Beverages: 'cafe',
  Pantry: 'basket',
};

// All 8 Supported Units
const UNIT_OPTIONS = [
  'kg',
  'gram',
  'piece',
  'box',
  'pack',
  'bunch',
  'litre',
  'dozen',
];

export default function AddProductScreen() {
  const { user, addProduct, updateProduct, deleteProduct, getProductById, switchRole } =
    useShop();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditing = Boolean(editId);

  const editingProduct = editId ? getProductById(editId) : undefined;
  const [prevEditId, setPrevEditId] = useState(editId);

  // Form states initialized directly with editing product if provided
  const [name, setName] = useState(() => editingProduct?.name || '');
  const [price, setPrice] = useState(() => (editingProduct ? String(editingProduct.price) : ''));
  const [category, setCategory] = useState<ProductGroupCategory>(
    () => editingProduct?.category || 'Vegetables'
  );
  const [unit, setUnit] = useState(() => editingProduct?.unit || 'kg');
  const [image, setImage] = useState(() => editingProduct?.image || '');
  const [rating, setRating] = useState(() =>
    editingProduct ? String(editingProduct.rating) : '4.8'
  );
  const [description, setDescription] = useState(
    () => editingProduct?.description || ''
  );
  const [origin, setOrigin] = useState(
    () => editingProduct?.origin || 'Farm Fresh'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  // Validation error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Adjust state during render if editId changed
  if (prevEditId !== editId) {
    setPrevEditId(editId);
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setPrice(String(editingProduct.price));
      setUnit(editingProduct.unit);
      setImage(editingProduct.image);
      setRating(String(editingProduct.rating));
      setDescription(editingProduct.description);
      setOrigin(editingProduct.origin || 'Farm Fresh');
    }
  }

  // Role guard: Only Admin can access
  if (user.role !== 'Admin') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Grocery Product</Text>
          <View style={styles.placeholderRight} />
        </View>

        <View style={styles.guardContainer}>
          <View style={styles.guardIconCircle}>
            <Ionicons name="lock-closed" size={44} color={COLORS.text} />
          </View>
          <View style={styles.adminOnlyBadge}>
            <Text style={styles.adminOnlyBadgeText}>Admin Role Required</Text>
          </View>
          <Text style={styles.guardTitle}>Admin Exclusive Feature</Text>
          <Text style={styles.guardText}>
            Adding and editing grocery produce requires Administrator privileges.
            Customers can browse the catalogue, view details, and purchase items.
          </Text>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => switchRole('Admin')}
            activeOpacity={0.85}>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.text} />
            <Text style={styles.switchButtonText}>Switch to Admin Role</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelSecondaryButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Text style={styles.cancelSecondaryText}>Return to Grocery Shop</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    const parsedPrice = parseFloat(price.trim());
    if (!price.trim()) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(parsedPrice) || parsedPrice <= 0) {
      newErrors.price = 'Please enter a valid positive price greater than ₹0.';
    }

    if (!unit.trim()) {
      newErrors.unit = 'Unit is required (e.g. kg, gram, piece, pack).';
    }

    if (!image.trim()) {
      newErrors.image = 'Product image URL is required.';
    } else if (!/^https?:\/\//i.test(image.trim())) {
      newErrors.image = 'Image URL must start with http:// or https://';
    }

    const parsedRating = parseFloat(rating.trim());
    if (!rating.trim() || isNaN(parsedRating) || parsedRating < 1.0 || parsedRating > 5.0) {
      newErrors.rating = 'Rating must be between 1.0 and 5.0';
    }

    if (!description.trim()) {
      newErrors.description = 'Product description is required.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPreset = (preset: (typeof PRESET_PRODUCTS)[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    setPrice(preset.price);
    setUnit(preset.unit);
    setImage(preset.image);
    setRating(preset.rating);
    setDescription(preset.description);
    setOrigin(preset.origin);
    setErrors({});
  };

  const handleSaveProduct = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    const parsedPrice = parseFloat(price.trim());
    const parsedRating = parseFloat(rating.trim()) || 4.8;

    try {
      if (isEditing && editId) {
        await updateProduct(editId, {
          name: name.trim(),
          category,
          price: parsedPrice,
          unit: unit.trim(),
          image: image.trim(),
          rating: parsedRating,
          description: description.trim(),
          origin: origin.trim() || 'Farm Fresh',
        });
        setSuccessBanner(`"${name.trim()}" updated successfully!`);
      } else {
        await addProduct({
          name: name.trim(),
          category,
          price: parsedPrice,
          unit: unit.trim(),
          image: image.trim(),
          rating: parsedRating,
          description: description.trim(),
          origin: origin.trim() || 'Farm Fresh',
          calories: '50 kcal / 100g',
          shelfLife: '5-7 days',
        });
        setSuccessBanner(`"${name.trim()}" added to inventory successfully!`);
      }

      setTimeout(() => {
        setIsSubmitting(false);
        router.replace('/(drawer)/(tabs)');
      }, 650);
    } catch {
      setIsSubmitting(false);
      setErrors({ form: 'Failed to save product. Please try again.' });
    }
  };

  const handleDeleteProduct = () => {
    if (!editId) return;

    const performDelete = async () => {
      setIsSubmitting(true);
      try {
        await deleteProduct(editId);
        setSuccessBanner(`"${name.trim() || 'Product'}" deleted from inventory.`);
        setTimeout(() => {
          setIsSubmitting(false);
          router.replace('/(drawer)/(tabs)');
        }, 600);
      } catch {
        setIsSubmitting(false);
        setErrors({ form: 'Failed to delete product.' });
      }
    };

    if (Platform.OS === 'web') {
      if (
        typeof window !== 'undefined' &&
        window.confirm(`Are you sure you want to permanently delete "${name || 'this product'}"?`)
      ) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Product',
        `Are you sure you want to delete "${name || 'this product'}" from the store inventory?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Cancel">
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Add Grocery Product</Text>
            <Text style={styles.headerSubtitle}>Admin Inventory Manager</Text>
          </View>
          <View style={styles.placeholderRight} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Edit Mode Notice Banner */}
          {isEditing && (
            <View style={styles.editModeBanner}>
              <Ionicons name="create" size={17} color={COLORS.text} />
              <Text style={styles.editModeText}>
                Editing Product: <Text style={styles.editModeBold}>{name || 'Selected Item'}</Text>
              </Text>
            </View>
          )}

          {/* Quick Autofill Presets (1-Tap Test) */}
          <View style={styles.presetSection}>
            <View style={styles.presetHeader}>
              <Ionicons name="flash" size={15} color="#8A7A08" />
              <Text style={styles.presetSectionTitle}>
                Quick Autofill Presets (1-Tap Test)
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.presetScroll}
              contentContainerStyle={styles.presetScrollContent}>
              {PRESET_PRODUCTS.map((preset) => (
                <TouchableOpacity
                  key={preset.name}
                  style={styles.presetChip}
                  onPress={() => handleApplyPreset(preset)}
                  activeOpacity={0.8}
                  accessibilityLabel={`Autofill ${preset.name}`}>
                  <Text style={styles.presetChipText}>+ {preset.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Product Image Preview */}
          <View style={styles.previewSection}>
            <Text style={styles.inputLabel}>Product Image Preview</Text>
            <View style={[styles.previewContainer, SHADOWS.small]}>
              <SafeImage
                uri={image}
                style={styles.previewImage}
                resizeMode="cover"
                placeholderText="Enter Image URL below to see live preview"
              />
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Product Name * */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Product Name *</Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.name ? styles.inputError : null,
                ]}>
                <Ionicons
                  name="pricetag-outline"
                  size={19}
                  color={COLORS.secondaryText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Fresh Red Tomatoes"
                  placeholderTextColor={COLORS.lightText}
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                />
              </View>
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
            </View>

            {/* Category * */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScrollContent}>
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryPill,
                        isSelected && styles.categoryPillActive,
                      ]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}>
                      <Ionicons
                        name={CATEGORY_ICONS[cat]}
                        size={16}
                        color={isSelected ? COLORS.text : COLORS.secondaryText}
                      />
                      <Text
                        style={[
                          styles.categoryPillText,
                          isSelected && styles.categoryPillTextActive,
                        ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Price (₹) * & Unit * Row */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.inputLabel}>Price (₹) *</Text>
                <View
                  style={[
                    styles.inputContainer,
                    errors.price ? styles.inputError : null,
                  ]}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 40"
                    placeholderTextColor={COLORS.lightText}
                    keyboardType="numeric"
                    value={price}
                    onChangeText={(val) => {
                      setPrice(val);
                      if (errors.price)
                        setErrors((prev) => ({ ...prev, price: '' }));
                    }}
                  />
                </View>
                {errors.price ? (
                  <Text style={styles.errorText}>{errors.price}</Text>
                ) : null}
              </View>

              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.inputLabel}>Unit *</Text>
                <View
                  style={[
                    styles.inputContainer,
                    errors.unit ? styles.inputError : null,
                  ]}>
                  <Ionicons
                    name="scale-outline"
                    size={18}
                    color={COLORS.secondaryText}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. kg, litre"
                    placeholderTextColor={COLORS.lightText}
                    value={unit}
                    onChangeText={(val) => {
                      setUnit(val);
                      if (errors.unit)
                        setErrors((prev) => ({ ...prev, unit: '' }));
                    }}
                  />
                </View>
                {errors.unit ? (
                  <Text style={styles.errorText}>{errors.unit}</Text>
                ) : null}
              </View>
            </View>

            {/* Quick unit Suggestions */}
            <View style={styles.unitSuggestionsRow}>
              <Text style={styles.unitHelpLabel}>Quick unit</Text>
              {UNIT_OPTIONS.map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => setUnit(u)}
                  style={[
                    styles.unitChip,
                    unit === u && styles.unitChipSelected,
                  ]}
                  activeOpacity={0.75}
                  accessibilityLabel={`Select unit ${u}`}>
                  <Text
                    style={[
                      styles.unitChipText,
                      unit === u && styles.unitChipTextSelected,
                    ]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Image URL * */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Image URL *</Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.image ? styles.inputError : null,
                ]}>
                <Ionicons
                  name="image-outline"
                  size={19}
                  color={COLORS.secondaryText}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="https://images.unsplash.com/photo-..."
                  placeholderTextColor={COLORS.lightText}
                  keyboardType="url"
                  autoCapitalize="none"
                  value={image}
                  onChangeText={(val) => {
                    setImage(val);
                    if (errors.image)
                      setErrors((prev) => ({ ...prev, image: '' }));
                  }}
                />
              </View>
              {errors.image ? (
                <Text style={styles.errorText}>{errors.image}</Text>
              ) : null}
            </View>

            {/* Rating (1.0–5.0) * & Origin (Farm/Region) Row */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.inputLabel}>Rating (1.0–5.0) *</Text>
                <View
                  style={[
                    styles.inputContainer,
                    errors.rating ? styles.inputError : null,
                  ]}>
                  <Ionicons
                    name="star"
                    size={17}
                    color={COLORS.star}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="4.8"
                    placeholderTextColor={COLORS.lightText}
                    keyboardType="numeric"
                    value={rating}
                    onChangeText={(val) => {
                      setRating(val);
                      if (errors.rating)
                        setErrors((prev) => ({ ...prev, rating: '' }));
                    }}
                  />
                </View>
                {errors.rating ? (
                  <Text style={styles.errorText}>{errors.rating}</Text>
                ) : null}
              </View>

              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.inputLabel}>Origin (Farm/Region)</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={COLORS.secondaryText}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Local Organic"
                    placeholderTextColor={COLORS.lightText}
                    value={origin}
                    onChangeText={setOrigin}
                  />
                </View>
              </View>
            </View>

            {/* Product Description * */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Product Description *</Text>
              <View
                style={[
                  styles.inputContainer,
                  styles.textAreaContainer,
                  errors.description ? styles.inputError : null,
                ]}>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  placeholder="Describe produce freshness, aroma, taste, and culinary uses..."
                  placeholderTextColor={COLORS.lightText}
                  multiline
                  numberOfLines={4}
                  value={description}
                  onChangeText={(val) => {
                    setDescription(val);
                    if (errors.description)
                      setErrors((prev) => ({ ...prev, description: '' }));
                  }}
                />
              </View>
              {errors.description ? (
                <Text style={styles.errorText}>{errors.description}</Text>
              ) : null}
            </View>

            {/* General Form Error */}
            {errors.form ? (
              <Text style={styles.errorText}>{errors.form}</Text>
            ) : null}

            {/* Success Banner */}
            {successBanner ? (
              <View style={styles.successBanner}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.success}
                />
                <Text style={styles.successText}>{successBanner}</Text>
              </View>
            ) : null}

            {/* Main Action Button: Add or Save Changes */}
            <TouchableOpacity
              style={[styles.submitButton, SHADOWS.small]}
              onPress={handleSaveProduct}
              disabled={isSubmitting}
              activeOpacity={0.85}
              accessibilityLabel={isEditing ? 'Save Changes' : 'Add Product to Store'}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.text} />
              ) : (
                <>
                  <Ionicons
                    name={isEditing ? 'checkmark-circle-outline' : 'add-circle-outline'}
                    size={20}
                    color={COLORS.text}
                  />
                  <Text style={styles.submitButtonText}>
                    {isEditing ? 'Save Product Changes' : 'Add Product to Store'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Delete Button (Displayed when editing an existing product) */}
            {isEditing && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteProduct}
                disabled={isSubmitting}
                activeOpacity={0.85}
                accessibilityLabel="Delete Product">
                <Ionicons name="trash-outline" size={19} color={COLORS.danger} />
                <Text style={styles.deleteButtonText}>Delete Product from Store</Text>
              </TouchableOpacity>
            )}

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
              accessibilityLabel="Cancel">
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
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  placeholderRight: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 40,
  },
  editModeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.selected,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2CA00',
  },
  editModeText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
  },
  editModeBold: {
    fontWeight: '800',
  },
  presetSection: {
    backgroundColor: '#F5F5D9',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  presetSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6A5E04',
  },
  presetScroll: {
    flexDirection: 'row',
  },
  presetScrollContent: {
    paddingRight: 10,
    gap: 8,
  },
  presetChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2DEC2',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  previewSection: {
    marginBottom: 16,
  },
  previewContainer: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#EBEBC8',
    borderWidth: 1,
    borderColor: '#ECE7CE',
    marginTop: 6,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
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
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    color: COLORS.text,
  },
  textAreaContainer: {
    height: 96,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  textAreaInput: {
    textAlignVertical: 'top',
    height: '100%',
  },
  categoryScrollContent: {
    gap: 8,
    paddingVertical: 2,
    paddingRight: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  categoryPillActive: {
    backgroundColor: COLORS.selected,
    borderColor: '#E2CA00',
  },
  categoryPillText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  categoryPillTextActive: {
    color: COLORS.text,
  },
  unitSuggestionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  unitHelpLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '700',
    marginRight: 2,
  },
  unitChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E2CB',
  },
  unitChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: '#D4DC7A',
  },
  unitChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  unitChipTextSelected: {
    color: COLORS.text,
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
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  successText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.success,
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  deleteButton: {
    backgroundColor: '#FFF0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FBD2D2',
  },
  deleteButtonText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.danger,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 6,
  },
  cancelButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  guardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  guardIconCircle: {
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
  adminOnlyBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  adminOnlyBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  guardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  guardText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  switchButton: {
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
  switchButtonText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  cancelSecondaryButton: {
    paddingVertical: 12,
  },
  cancelSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondaryText,
    textDecorationLine: 'underline',
  },
});
