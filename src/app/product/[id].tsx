
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { safeBack } from '@/utils/safeBack';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS } from '@/data/products';
import { COLORS, SHADOWS } from '@/constants/theme';
import { SafeImage } from '@/components/SafeImage';
import { QuantitySelector } from '@/components/QuantitySelector';
import { useShop } from '@/context/ShopContext';


export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    user,
    switchRole,
    isFavourite,
    toggleFavourite,
    addToCart,
    totalCartItems,
    products,
    getProductById,
  } = useShop();

  const product =
    (id ? getProductById(id) : undefined) || products[0] || PRODUCTS[0];
  const favourite = isFavourite(product.id);

  // Selected quantity for detail page
  const [quantity, setQuantity] = useState(1);
  const [showAddedBanner, setShowAddedBanner] = useState(false);

  // Role check: Product Details Screen is for Customer only
  if (user.role === "Admin") {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => safeBack("/(drawer)/(tabs)")}
            accessibilityLabel="Back to products"
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Product Details</Text>
          <View style={styles.placeholderButton} />
        </View>

        <View style={styles.roleContainer}>
          <View style={styles.roleIconCircle}>
            <Ionicons name="shield" size={42} color={COLORS.text} />
          </View>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>Customer Role Only</Text>
          </View>
          <Text style={styles.roleTitle}>Customer Exclusive Screen</Text>
          <Text style={styles.roleDescription}>
            The Product Details screen (including detailed nutrition breakdown,
            freshness guarantees, and customer ratings) is reserved for Customer
            accounts.
          </Text>
          <Text style={styles.roleSubdescription}>
            As an Admin, you have catalogue and cart management access. Switch
            to Customer mode to view product details.
          </Text>

          <TouchableOpacity
            style={styles.switchActionButton}
            onPress={() => switchRole("Customer")}
            activeOpacity={0.85}
          >
            <Ionicons name="swap-horizontal" size={18} color={COLORS.text} />
            <Text style={styles.switchActionText}>Switch to Customer Role</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backSecondaryButton}
            onPress={() => safeBack("/(drawer)/(tabs)")}
            activeOpacity={0.7}
          >
            <Text style={styles.backSecondaryText}>Return to Grocery List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAddedBanner(true);
    setTimeout(() => {
      setShowAddedBanner(false);
    }, 2000);
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />

      {/* Custom Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => safeBack("/(drawer)/(tabs)")}
          accessibilityLabel="Back to products"
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          Product Details
        </Text>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => toggleFavourite(product.id)}
            accessibilityLabel={
              favourite ? "Remove favourite" : "Add favourite"
            }
          >
            <Ionicons
              name={favourite ? "heart" : "heart-outline"}
              size={22}
              color={favourite ? COLORS.danger : COLORS.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/(drawer)/(tabs)/cart")}
            accessibilityLabel="View Cart"
          >
            <Ionicons name="cart-outline" size={22} color={COLORS.text} />
            {totalCartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {totalCartItems > 99 ? "99+" : totalCartItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Hero Image */}
        <View style={[styles.imageCard, SHADOWS.medium]}>
          <SafeImage
            uri={product.image}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{product.category}</Text>
          </View>
        </View>

        {/* Added to Cart Toast Notification */}
        {showAddedBanner && (
          <View style={styles.toastBanner}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={COLORS.success}
            />
            <Text style={styles.toastText}>
              Added {quantity}x {product.name} to cart!
            </Text>
          </View>
        )}

        {/* Name, Unit, and Price Header */}
        <View style={styles.productHeader}>
          <View style={styles.titleColumn}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                <Ionicons name="star" size={15} color={COLORS.star} />
                <Text style={styles.ratingNumber}>
                  {product.rating.toFixed(1)}
                </Text>
              </View>
              <Text style={styles.reviewsCount}>
                ({product.reviewsCount || 85} reviews)
              </Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.inStockText}>In Stock (Fresh)</Text>
            </View>
          </View>

          <View style={styles.priceColumn}>
            <Text style={styles.priceAmount}>₹{product.price}</Text>
            <Text style={styles.priceUnit}>per {product.unit}</Text>
          </View>
        </View>

        {/* Quantity Selection Row */}
        <View style={styles.quantitySection}>
          <Text style={styles.sectionLabel}>Select Quantity:</Text>
          <QuantitySelector
            quantity={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            size="medium"
            min={1}
          />
        </View>

        {/* Nutritional & Origin Badges */}
        <View style={styles.factsGrid}>
          <View style={styles.factCard}>
            <Ionicons name="leaf-outline" size={18} color="#4A8A3A" />
            <Text style={styles.factTitle}>Origin</Text>
            <Text style={styles.factValue}>
              {product.origin || "Farm Fresh"}
            </Text>
          </View>

          <View style={styles.factCard}>
            <Ionicons name="flame-outline" size={18} color="#E07020" />
            <Text style={styles.factTitle}>Calories</Text>
            <Text style={styles.factValue}>
              {product.calories || "45 kcal"}
            </Text>
          </View>

          <View style={styles.factCard}>
            <Ionicons name="time-outline" size={18} color="#3B82F6" />
            <Text style={styles.factTitle}>Shelf Life</Text>
            <Text style={styles.factValue}>
              {product.shelfLife || "5-7 days"}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionLabel}>About This Product</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
          <Text style={styles.freshnessNotice}>
            🌿 100% Quality Guaranteed: Inspected by our produce specialists
            before dispatch.
          </Text>
        </View>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.sectionLabel}>More in {product.category}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedList}
            >
              {relatedProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.relatedCard}
                  onPress={() => {
                    setQuantity(1);
                    router.replace({
                      pathname: "/product/[id]",
                      params: { id: item.id },
                    });
                  }}
                  activeOpacity={0.8}
                >
                  <SafeImage
                    uri={item.image}
                    style={styles.relatedImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.relatedName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.relatedPrice}>
                    ₹{item.price} / {item.unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, SHADOWS.medium]}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomSubtotalLabel}>
            Total ({quantity} {product.unit})
          </Text>
          <Text style={styles.bottomSubtotalAmount}>
            ₹{product.price * quantity}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.85}
          accessibilityLabel={`Add ${quantity} of ${product.name} to cart`}
        >
          <Ionicons name="cart" size={20} color={COLORS.text} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECECBF",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  imageCard: {
    width: "100%",
    height: 270,
    borderRadius: 26,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#EBEBC8",
    borderWidth: 1,
    borderColor: "#ECE7CE",
    marginVertical: 10,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 12,
    left: 14,
    backgroundColor: "rgba(255, 249, 233, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  toastBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EBF5E7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 6,
  },
  toastText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.success,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 12,
    marginBottom: 16,
  },
  titleColumn: {
    flex: 1,
    paddingRight: 10,
  },
  productName: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.text,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    flexWrap: "wrap",
    gap: 6,
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.text,
  },
  reviewsCount: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  dotSeparator: {
    color: COLORS.secondaryText,
  },
  inStockText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.success,
  },
  priceColumn: {
    alignItems: "flex-end",
  },
  priceAmount: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.text,
  },
  priceUnit: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: "600",
  },
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ECE7CE",
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  factsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  factCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECE7CE",
  },
  factTitle: {
    fontSize: 10.5,
    color: COLORS.secondaryText,
    marginTop: 4,
    fontWeight: "600",
  },
  factValue: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 2,
    textAlign: "center",
  },
  descriptionSection: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ECE7CE",
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 22,
    marginTop: 8,
  },
  freshnessNotice: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A6B3A",
    marginTop: 10,
    lineHeight: 18,
  },
  relatedSection: {
    marginBottom: 10,
  },
  relatedList: {
    gap: 12,
    paddingTop: 10,
  },
  relatedCard: {
    width: 110,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ECE7CE",
  },
  relatedImage: {
    width: "100%",
    height: 75,
    borderRadius: 10,
  },
  relatedName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 6,
  },
  relatedPrice: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: "600",
    marginTop: 2,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5D9",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E8E2CB",
  },
  bottomPriceContainer: {
    flex: 1,
  },
  bottomSubtotalLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: "600",
  },
  bottomSubtotalAmount: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 18,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  placeholderButton: {
    width: 42,
    height: 42,
  },
  roleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  roleIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ECE7CE",
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
    fontWeight: "800",
    color: COLORS.text,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },
  roleDescription: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 6,
  },
  roleSubdescription: {
    fontSize: 13,
    color: COLORS.lightText,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  switchActionButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 18,
    width: "100%",
    marginBottom: 12,
  },
  switchActionText: {
    fontSize: 15.5,
    fontWeight: "800",
    color: COLORS.text,
  },
  backSecondaryButton: {
    paddingVertical: 12,
  },
  backSecondaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.secondaryText,
    textDecorationLine: "underline",
  },
});
