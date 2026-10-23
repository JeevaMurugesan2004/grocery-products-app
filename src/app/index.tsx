import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { COLORS, SHADOWS } from "@/constants/theme";
import { SafeImage } from "@/components/SafeImage";
import { useShop } from "@/context/ShopContext";

export default function WelcomeScreen() {
  const { user } = useShop();

  // Header animation
  const [headerOpacity] = useState(() => new Animated.Value(0));
  const [headerY] = useState(() => new Animated.Value(20));

  const [imageOpacity] = useState(() => new Animated.Value(0));
  const [imageScale] = useState(() => new Animated.Value(0.92));
  const [badgeOpacity] = useState(() => new Animated.Value(0));

  const [contentOpacity] = useState(() => new Animated.Value(0));
  const [contentY] = useState(() => new Animated.Value(25));

  const [buttonOpacity] = useState(() => new Animated.Value(0));
  const [buttonScale] = useState(() => new Animated.Value(0.9));

  const [authOpacity] = useState(() => new Animated.Value(0));
  const [roleOpacity] = useState(() => new Animated.Value(0));

  const [getStartedPressScale] = useState(() => new Animated.Value(1));
  const [signInPressScale] = useState(() => new Animated.Value(1));
  const [signUpPressScale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const animation = Animated.sequence([
      // Header
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(headerY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Hero image
      Animated.parallel([
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(imageScale, {
          toValue: 1,
          friction: 8,
          tension: 45,
          useNativeDriver: true,
        }),
      ]),

      // Organic badge
      Animated.timing(badgeOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),

      // Main content
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(contentY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Get Started button
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),

      // Authentication buttons and active role
      Animated.stagger(120, [
        Animated.timing(authOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(roleOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    headerOpacity,
    headerY,
    imageOpacity,
    imageScale,
    badgeOpacity,
    contentOpacity,
    contentY,
    buttonOpacity,
    buttonScale,
    authOpacity,
    roleOpacity,
  ]);

  // Navigate to the grocery home screen
  const handleGetStarted = () => {
    router.replace("/(drawer)/(tabs)");
  };

  const handleSignIn = () => {
    router.push("/signin");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  // Reusable press animation
  const animatePress = (scale: Animated.Value, toValue: number) => {
    Animated.spring(scale, {
      toValue,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Header */}
        <Animated.View
          style={[
            styles.topSection,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerY }],
            },
          ]}
        >
          <View style={styles.eyebrowContainer}>
            <Ionicons name="sparkles" size={12} color={COLORS.secondaryText} />

            <Text style={styles.eyebrow}>FRESH • HEALTHY • DAILY</Text>

            <Ionicons name="sparkles" size={12} color={COLORS.secondaryText} />
          </View>

          <Text style={styles.title}>Grocery Shop</Text>

          <Text style={styles.subtitle}>
            Fresh groceries delivered straight to your door.
          </Text>
        </Animated.View>

        {/* Animated Hero Image */}
        <Animated.View
          style={[
            styles.imageContainer,
            SHADOWS.medium,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          <SafeImage
            uri="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900&auto=format&fit=crop&q=80"
            style={styles.heroImage}
            resizeMode="cover"
            fallbackIcon="nutrition-outline"
          />

          <Animated.View
            style={[styles.badgeOverlay, { opacity: badgeOpacity }]}
          >
            <Ionicons name="shield-checkmark" size={14} color={COLORS.text} />

            <Text style={styles.badgeText}>100% Organic & Farm Fresh</Text>
          </Animated.View>
        </Animated.View>

        {/* Main Content */}
        <Animated.View
          style={[
            styles.bottomSection,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentY }],
            },
          ]}
        >
          <Text style={styles.heading}>Eat Fresh,{"\n"}Live Healthy!</Text>

          <Text style={styles.description}>
            Discover daily fresh fruits, vegetables and nutritious kitchen
            essentials curated for your home.
          </Text>

          {/* Get Started */}
          <Animated.View
            style={[
              styles.fullWidth,
              {
                opacity: buttonOpacity,
                transform: [
                  { scale: buttonScale },
                  { scale: getStartedPressScale },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.primaryButton, SHADOWS.small]}
              activeOpacity={0.9}
              onPress={handleGetStarted}
              onPressIn={() => animatePress(getStartedPressScale, 0.96)}
              onPressOut={() => animatePress(getStartedPressScale, 1)}
              accessibilityRole="button"
              accessibilityLabel="Get Started with Grocery Shopping"
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>

              <Ionicons name="arrow-forward" size={18} color={COLORS.text} />
            </TouchableOpacity>
          </Animated.View>

          {/* Sign In and Sign Up */}
          <Animated.View
            style={[styles.authButtonsRow, { opacity: authOpacity }]}
          >
            {/* Sign In */}
            <Animated.View
              style={[
                styles.authButtonWrapper,
                {
                  transform: [{ scale: signInPressScale }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.authOptionButton}
                onPress={handleSignIn}
                onPressIn={() => animatePress(signInPressScale, 0.96)}
                onPressOut={() => animatePress(signInPressScale, 1)}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel="Sign In as Admin or Customer"
              >
                <Ionicons name="log-in-outline" size={17} color={COLORS.text} />

                <Text style={styles.authOptionText}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Sign Up */}
            <Animated.View
              style={[
                styles.authButtonWrapper,
                {
                  transform: [{ scale: signUpPressScale }],
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.authOptionButton, styles.signUpButton]}
                onPress={handleSignUp}
                onPressIn={() => animatePress(signUpPressScale, 0.96)}
                onPressOut={() => animatePress(signUpPressScale, 1)}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel="Sign Up as Admin or Customer"
              >
                <Ionicons
                  name="person-add-outline"
                  size={17}
                  color={COLORS.text}
                />

                <Text style={styles.authOptionText}>Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* Active Role */}
          <Animated.View style={[styles.authRow, { opacity: roleOpacity }]}>
            <Text style={styles.authPrompt}>Active Role:</Text>

            <View
              style={[
                styles.roleIndicatorBadge,
                user.role === "Admin"
                  ? styles.adminBadge
                  : styles.customerBadge,
              ]}
            >
              <Text style={styles.roleIndicatorText}>{user.role}</Text>
            </View>

            <Text style={styles.userNameText}>({user.name})</Text>
          </Animated.View>

          <Text style={styles.footerNote}>
            Freshness you can trust, every day.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: "space-between",
  },

  topSection: {
    alignItems: "center",
    marginBottom: 16,
  },

  fullWidth: {
    width: "100%",
  },

  eyebrowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F5F5D9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },

  eyebrow: {
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.secondaryText,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    marginTop: 4,
    textAlign: "center",
  },

  imageContainer: {
    width: "100%",
    height: 290,
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: "#ECE7CE",
    marginVertical: 10,
    backgroundColor: "#EBEBC8",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  badgeOverlay: {
    position: "absolute",
    bottom: 12,
    left: 14,
    backgroundColor: "rgba(255, 249, 233, 0.94)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  badgeText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: COLORS.text,
  },

  bottomSection: {
    alignItems: "center",
    paddingTop: 10,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    color: COLORS.text,
    textAlign: "center",
  },

  description: {
    fontSize: 13.5,
    color: COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 12,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryButtonText: {
    color: COLORS.text,
    fontSize: 16.5,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  authButtonsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginTop: 12,
  },

  authButtonWrapper: {
    flex: 1,
  },

  authOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.card,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ECE7CE",
  },

  signUpButton: {
    backgroundColor: "#FCFCEE",
  },

  authOptionText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
  },

  authRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 4,
  },

  authPrompt: {
    fontSize: 12.5,
    color: COLORS.secondaryText,
  },

  roleIndicatorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  customerBadge: {
    backgroundColor: COLORS.selected,
  },

  adminBadge: {
    backgroundColor: COLORS.primary,
  },

  roleIndicatorText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: COLORS.text,
  },

  userNameText: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: "600",
  },

  footerNote: {
    fontSize: 11.5,
    color: COLORS.lightText,
    marginTop: 14,
  },
});
