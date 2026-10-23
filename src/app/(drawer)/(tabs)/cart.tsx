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
import { QuantitySelector } from '@/components/QuantitySelector';
import { useShop } from '@/context/ShopContext';

export default function CartScreen() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalCartItems,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    placeOrder,
  } = useShop();

  const handleBookNow = () => {
    if (cart.length === 0) {
      return;
    }

    const order = placeOrder();
    if (order) {
      router.push('/order-confirmation');
    }
  };

  const handleShopNow = () => {
    router.push('/(drawer)/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Header */}
      <ScreenHeader
        title="My Cart"
        subtitle={`${totalCartItems} item${totalCartItems === 1 ? '' : 's'}`}
        showDrawer={true}
        showCart={false}
        rightComponent={
          cart.length > 0 ? (
            <TouchableOpacity
              style={styles.clearHeaderButton}
              onPress={clearCart}
              activeOpacity={0.7}
              accessibilityLabel="Clear cart">
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      {cart.length > 0 ? (
        <View style={styles.mainContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Review Your Basket</Text>
              <Text style={styles.subtitle}>
                Fresh items will be hand-picked upon confirmation
              </Text>
            </View>

            {/* Free Delivery Banner */}
            <View style={styles.deliveryPromoBanner}>
              <Ionicons
                name={cartDeliveryFee === 0 ? 'checkmark-circle' : 'bicycle'}
                size={18}
                color={cartDeliveryFee === 0 ? COLORS.success : '#8A7A08'}
              />
              <Text style={styles.deliveryPromoText}>
                {cartDeliveryFee === 0
                  ? 'Yay! You unlocked FREE Delivery on this order.'
                  : `Add ₹${Math.max(0, 200 - cartSubtotal)} more to qualify for FREE Delivery!`}
              </Text>
            </View>

            {/* Cart Items List */}
            <View style={styles.itemsList}>
              {cart.map((item) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <View
                    key={item.product.id}
                    style={[styles.cartItemCard, SHADOWS.small]}>
                    {/* Item Thumbnail */}
                    <TouchableOpacity
                      style={styles.thumbnailContainer}
                      onPress={() =>
                        router.push({
                          pathname: '/product/[id]',
                          params: { id: item.product.id },
                        })
                      }
                      activeOpacity={0.8}>
                      <SafeImage
                        uri={item.product.image}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>

                    {/* Item Info */}
                    <View style={styles.itemInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.product.name}
                        </Text>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => removeFromCart(item.product.id)}
                          activeOpacity={0.7}
                          accessibilityLabel={`Remove ${item.product.name}`}>
                          <Ionicons
                            name="close-circle-outline"
                            size={20}
                            color={COLORS.danger}
                          />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.unitPrice}>
                        ₹{item.product.price} / {item.product.unit}
                      </Text>

                      {/* Controls and Line Total */}
                      <View style={styles.itemActionsRow}>
                        <QuantitySelector
                          quantity={item.quantity}
                          onIncrease={() => increaseQuantity(item.product.id)}
                          onDecrease={() => decreaseQuantity(item.product.id)}
                          size="small"
                        />

                        <View style={styles.lineTotalContainer}>
                          <Text style={styles.lineTotalLabel}>Line Total</Text>
                          <Text style={styles.lineTotalAmount}>₹{lineTotal}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Order Bill Summary */}
            <View style={[styles.summaryCard, SHADOWS.small]}>
              <Text style={styles.summaryTitle}>Bill Details</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Items Subtotal ({totalCartItems} items)
                </Text>
                <Text style={styles.summaryValue}>₹{cartSubtotal}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                {cartDeliveryFee === 0 ? (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>FREE</Text>
                  </View>
                ) : (
                  <Text style={styles.summaryValue}>₹{cartDeliveryFee}</Text>
                )}
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryTotalRow}>
                <View>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.taxIncludedText}>Inclusive of all taxes</Text>
                </View>
                <Text style={styles.totalAmount}>₹{cartTotal}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Bottom Checkout Bar */}
          <View style={[styles.bottomBar, SHADOWS.medium]}>
            <View style={styles.bottomPriceInfo}>
              <Text style={styles.bottomTotalLabel}>Total to Pay</Text>
              <Text style={styles.bottomTotalAmount}>₹{cartTotal}</Text>
            </View>

            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={handleBookNow}
              activeOpacity={0.85}
              accessibilityLabel="Book Now">
              <Text style={styles.bookNowText}>Book Now</Text>
              <Ionicons name="arrow-forward" size={19} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={54} color={COLORS.secondaryText} />
          </View>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptyMessage}>
            Looks like you haven&apos;t added any fresh groceries to your basket yet.
            Explore our daily harvest to get started!
          </Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={handleShopNow}
            activeOpacity={0.85}>
            <Ionicons name="storefront" size={18} color={COLORS.text} />
            <Text style={styles.shopNowText}>Shop Fresh Groceries</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  clearHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    marginTop: 6,
    marginBottom: 14,
  },
  title: {
    fontSize: 27,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 3,
  },
  deliveryPromoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F5D9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  deliveryPromoText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  itemsList: {
    marginBottom: 16,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  thumbnailContainer: {
    width: 82,
    height: 82,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#EBEBC8',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
  },
  deleteButton: {
    padding: 2,
    marginLeft: 6,
  },
  unitPrice: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 1,
  },
  itemActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  lineTotalContainer: {
    alignItems: 'flex-end',
  },
  lineTotalLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  lineTotalAmount: {
    fontSize: 15.5,
    fontWeight: '900',
    color: COLORS.text,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECE7CE',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
  },
  summaryValue: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  freeBadge: {
    backgroundColor: '#EBF5E7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.success,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E8E2CB',
    marginVertical: 10,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  taxIncludedText: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 1,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5D9',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E8E2CB',
  },
  bottomPriceInfo: {
    flex: 1,
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bottomTotalAmount: {
    fontSize: 21,
    fontWeight: '900',
    color: COLORS.text,
  },
  bookNowButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
  },
  bookNowText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  shopNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 18,
    marginTop: 22,
  },
  shopNowText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: COLORS.text,
  },
});
