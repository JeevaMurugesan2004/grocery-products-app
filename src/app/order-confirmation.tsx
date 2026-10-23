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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useShop } from '@/context/ShopContext';

export default function OrderConfirmationScreen() {
  const { lastOrder, user } = useShop();

  const handleContinueShopping = () => {
    router.replace('/(drawer)/(tabs)');
  };

  const handleViewProfile = () => {
    router.replace('/(drawer)/(tabs)/profile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark" size={54} color={COLORS.white} />
        </View>

        <Text style={styles.title}>Order Booked!</Text>
        <Text style={styles.subtitle}>
          Thank you, {user.name}! Your fresh groceries are being packed.
        </Text>

        {/* Order Details Card */}
        <View style={[styles.orderCard, SHADOWS.medium]}>
          <View style={styles.orderHeaderRow}>
            <View>
              <Text style={styles.orderLabel}>Order Number</Text>
              <Text style={styles.orderId}>{lastOrder?.id || 'GS-89214'}</Text>
            </View>

            <View style={styles.statusPill}>
              <Ionicons name="checkmark-done" size={14} color={COLORS.success} />
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Delivery Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={COLORS.secondaryText} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Estimated Delivery</Text>
                <Text style={styles.infoValue}>Today, within 30-45 minutes</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={COLORS.secondaryText} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Delivery Destination</Text>
                <Text style={styles.infoValue}>{lastOrder?.deliveryAddress || user.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Items Summary */}
          <Text style={styles.itemsTitle}>Items in this Order</Text>
          <View style={styles.itemsList}>
            {lastOrder?.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.product.name} ({item.product.unit})
                </Text>
                <Text style={styles.itemPrice}>
                  ₹{item.price * item.quantity}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Totals */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalRowLabel}>Subtotal</Text>
              <Text style={styles.totalRowValue}>₹{lastOrder?.subtotal || 0}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalRowLabel}>Delivery Fee</Text>
              <Text style={styles.totalRowValue}>
                {lastOrder?.deliveryFee === 0 ? 'FREE' : `₹${lastOrder?.deliveryFee}`}
              </Text>
            </View>

            <View style={styles.finalTotalRow}>
              <Text style={styles.finalTotalLabel}>Total Paid</Text>
              <Text style={styles.finalTotalAmount}>₹{lastOrder?.total || 0}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={[styles.primaryButton, SHADOWS.small]}
          onPress={handleContinueShopping}
          activeOpacity={0.85}>
          <Ionicons name="storefront" size={18} color={COLORS.text} />
          <Text style={styles.primaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleViewProfile}
          activeOpacity={0.7}>
          <Ionicons name="receipt-outline" size={17} color={COLORS.secondaryText} />
          <Text style={styles.secondaryButtonText}>View in Order History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 36,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 27,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  orderCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ECE7CE',
    marginBottom: 22,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 11.5,
    color: COLORS.secondaryText,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  orderId: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBF5E7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E2CB',
    marginVertical: 14,
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11.5,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  itemsList: {
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemQuantity: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8A7A08',
    width: 28,
  },
  itemName: {
    fontSize: 13.5,
    color: COLORS.text,
    flex: 1,
  },
  itemPrice: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalsSection: {
    gap: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRowLabel: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
  totalRowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E8E2CB',
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  finalTotalAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
});
