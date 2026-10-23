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

export default function HelpScreen() {
  const faqs = [
    {
      q: 'How fresh are the fruits and vegetables?',
      a: 'All our produce is procured daily from certified local farms and organic orchards at 4:00 AM, quality-checked and delivered directly to your doorstep within hours.',
    },
    {
      q: 'What are the delivery slots and timings?',
      a: 'We deliver 7 days a week from 6:30 AM to 10:30 PM. Express delivery takes approximately 30-45 minutes from confirmation.',
    },
    {
      q: 'Is there a minimum order for free delivery?',
      a: 'Orders above ₹200 qualify for 100% Free Delivery! For smaller orders under ₹200, a standard delivery fee of ₹30 applies.',
    },
    {
      q: 'What is the return and refund policy?',
      a: 'We have a hassle-free "No Questions Asked" replacement or refund policy if any fruit or vegetable fails your freshness inspection at delivery time.',
    },
    {
      q: 'What roles can I test in this app?',
      a: 'You can switch between Customer and Admin modes at any time via the Drawer menu or the Profile screen.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <ScreenHeader
        title="Order Info & Help"
        subtitle="Customer Support & FAQ"
        showDrawer={true}
        showCart={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Support Banner */}
        <View style={[styles.supportBanner, SHADOWS.small]}>
          <View style={styles.supportIconCircle}>
            <Ionicons name="headset" size={28} color={COLORS.text} />
          </View>
          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>Need Quick Assistance?</Text>
            <Text style={styles.supportSubtitle}>
              Our customer happiness team is active daily 7 AM – 10 PM.
            </Text>
          </View>
        </View>

        {/* Quick Contact Buttons */}
        <View style={styles.contactRow}>
          <View style={[styles.contactCard, SHADOWS.small]}>
            <Ionicons name="call" size={20} color={COLORS.text} />
            <Text style={styles.contactCardLabel}>Toll Free Helpline</Text>
            <Text style={styles.contactCardValue}>1800-419-GROCERY</Text>
          </View>

          <View style={[styles.contactCard, SHADOWS.small]}>
            <Ionicons name="mail" size={20} color={COLORS.text} />
            <Text style={styles.contactCardLabel}>Email Support</Text>
            <Text style={styles.contactCardValue}>help@groceryshop.com</Text>
          </View>
        </View>

        {/* FAQ Section */}
        <Text style={styles.faqHeading}>Frequently Asked Questions</Text>

        <View style={styles.faqsList}>
          {faqs.map((faq, index) => (
            <View key={index} style={[styles.faqCard, SHADOWS.small]}>
              <View style={styles.faqHeader}>
                <Ionicons
                  name="help-circle"
                  size={18}
                  color={COLORS.primary}
                  style={styles.faqIcon}
                />
                <Text style={styles.faqQuestion}>{faq.q}</Text>
              </View>
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            </View>
          ))}
        </View>

        {/* Back to Shop Button */}
        <TouchableOpacity
          style={[styles.backToShopBtn, SHADOWS.small]}
          onPress={() => router.push('/(drawer)/(tabs)')}
          activeOpacity={0.85}>
          <Ionicons name="storefront-outline" size={18} color={COLORS.text} />
          <Text style={styles.backToShopText}>Back to Daily Grocery</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  supportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  supportIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  supportSubtitle: {
    fontSize: 12.5,
    color: COLORS.secondaryText,
    marginTop: 3,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  contactCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  contactCardLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '600',
    marginTop: 8,
  },
  contactCardValue: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  faqHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 14,
  },
  faqsList: {
    gap: 12,
    marginBottom: 24,
  },
  faqCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECE7CE',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  faqIcon: {
    marginTop: 2,
  },
  faqQuestion: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: 13,
    color: COLORS.secondaryText,
    lineHeight: 20,
    marginLeft: 26,
  },
  backToShopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 18,
  },
  backToShopText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: COLORS.text,
  },
});
