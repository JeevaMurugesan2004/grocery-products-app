import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Product } from "@/data/products";
import { COLORS, SHADOWS } from "@/constants/theme";
import { SafeImage } from "./SafeImage";
import { useShop } from "@/context/ShopContext";

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  showRemoveFavourite?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showRemoveFavourite = false,
}) => {
  const {
    user,
    isFavourite,
    toggleFavourite,
    addToCart,
    getItemQuantity,
    decreaseQuantity,
    deleteProduct,
  } = useShop();
  const favourite = isFavourite(product.id);
  const cartQty = getItemQuantity(product.id);

  const handleCardPress = () => {
    if (user.role === "Admin") {
      router.push({
        pathname: "/add-product",
        params: { editId: product.id },
      });
    } else {
      router.push({
        pathname: "/product/[id]",
        params: { id: product.id },
      });
    }
  };

  const handleAdd = (e: any) => {
    e.stopPropagation?.();
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart(product, 1);
    }
  };

  const handleFavourite = (e: any) => {
    e.stopPropagation?.();
    toggleFavourite(product.id);
  };

  const handleDelete = (e: any) => {
    e.stopPropagation?.();
    if (Platform.OS === "web") {
      if (
        typeof window !== "undefined" &&
        window.confirm(`Are you sure you want to delete "${product.name}"?`)
      ) {
        deleteProduct(product.id);
      }
    } else {
      Alert.alert(
        "Delete Product",
        `Are you sure you want to delete "${product.name}" from store inventory?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteProduct(product.id),
          },
        ],
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, SHADOWS.small]}
      onPress={handleCardPress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${product.name}`}
    >
      {/* Product Image & Favourite Button */}
      <View style={styles.imageContainer}>
        <SafeImage
          uri={product.image}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favourite Button (Customer Only) */}
        {user.role === "Customer" && (
          <TouchableOpacity
            style={styles.favouriteButton}
            onPress={handleFavourite}
            activeOpacity={0.8}
            accessibilityLabel={
              favourite ? "Remove from favourites" : "Add to favourites"
            }
          >
            <Ionicons
              name={favourite ? "heart" : "heart-outline"}
              size={18}
              color={favourite ? COLORS.danger : COLORS.text}
            />
          </TouchableOpacity>
        )}

        {/* Category Pill Tag */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{product.category}</Text>
        </View>
      </View>

      {/* Product Details */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={COLORS.star} />
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price} numberOfLines={1}>
              ₹{product.price}
              {cartQty === 0 && (
                <Text style={styles.unit}> / {product.unit}</Text>
              )}
            </Text>
            {cartQty > 0 && (
              <Text style={styles.unit} numberOfLines={1}>
                / {product.unit}
              </Text>
            )}
          </View>

          {cartQty === 0 ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAdd}
              activeOpacity={0.8}
              accessibilityLabel={`Add ${product.name} to cart`}
            >
              <Ionicons name="add" size={18} color={COLORS.text} />
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={(e) => {
                  e.stopPropagation?.();
                  decreaseQuantity(product.id);
                }}
                accessibilityLabel="Decrease quantity"
              >
                <Ionicons name="remove" size={14} color={COLORS.text} />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{cartQty}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleAdd}
                accessibilityLabel="Increase quantity"
              >
                <Ionicons name="add" size={14} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Admin Edit & Delete Actions */}
        {user.role === "Admin" && (
          <View style={styles.adminActionRow}>
            <TouchableOpacity
              style={styles.adminEditBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                router.push({
                  pathname: "/add-product",
                  params: { editId: product.id },
                });
              }}
              activeOpacity={0.8}
              accessibilityLabel={`Edit ${product.name}`}
            >
              <Ionicons name="create-outline" size={13} color={COLORS.text} />
              <Text style={styles.adminEditText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.adminDeleteBtn}
              onPress={handleDelete}
              activeOpacity={0.8}
              accessibilityLabel={`Delete ${product.name}`}
            >
              <Ionicons name="trash-outline" size={13} color={COLORS.danger} />
              <Text style={styles.adminDeleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.selected,
    borderRadius: 18,
    paddingHorizontal: 3,
    minWidth: 70,
    height: 32,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: COLORS.text,
    minWidth: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,
    width: "48%",
    borderWidth: 1,
    borderColor: "#ECECBF",
    ...Platform.select({
      android: { overflow: "hidden" as const },
    }),
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1.18,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#EBEBC8",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favouriteButton: {
    position: "absolute",
    top: 7,
    right: 7,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: COLORS.secondaryText,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoContainer: {
    paddingTop: 9,
    paddingHorizontal: 2,
  },
  name: {
    fontSize: 15.5,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 3,
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    minHeight: 32,
  },
  priceContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  unit: {
    fontSize: 10.5,
    fontWeight: "500",
    color: COLORS.secondaryText,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButtonActive: {
    backgroundColor: COLORS.selected,
    paddingHorizontal: 4,
    minWidth: 34,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  cartQtyText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
  },
  adminActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ECE7CE",
  },
  adminEditBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: "#F5F5D9",
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ECE7CE",
  },
  adminEditText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
  },
  adminDeleteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: "#FFF2F2",
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FBD2D2",
  },
  adminDeleteText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.danger,
  },
});
