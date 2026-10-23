import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { COLORS } from "@/constants/theme";
import { useShop } from "@/context/ShopContext";

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showDrawer?: boolean;
  showCart?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showDrawer = false,
  showCart = true,
  onBackPress,
  rightComponent,
}) => {
  const navigation = useNavigation();
  const { totalCartItems } = useShop();

  const handleLeftPress = () => {
    if (showBack) {
      if (onBackPress) {
        onBackPress();
        return;
      }

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(drawer)/(tabs)");
      }

      return;
    }

    if (showDrawer) {
      let currentNavigation: any = navigation;

      while (currentNavigation) {
        if (currentNavigation.getState?.().type === "drawer") {
          currentNavigation.dispatch(DrawerActions.toggleDrawer());
          return;
        }

        currentNavigation = currentNavigation.getParent?.();
      }

      console.warn("Drawer navigator not found.");
    }
  };

  const handleCartPress = () => {
    router.push("/(drawer)/(tabs)/cart");
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleLeftPress}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
        ) : showDrawer ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleLeftPress}
            activeOpacity={0.7}
            accessibilityLabel="Open navigation menu"
            accessibilityRole="button"
          >
            <Ionicons name="menu" size={24} color={COLORS.text} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.titleContainer}>
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}

        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightContainer}>
        {rightComponent ? (
          rightComponent
        ) : showCart ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleCartPress}
            activeOpacity={0.7}
            accessibilityLabel={`Cart with ${totalCartItems} items`}
            accessibilityRole="button"
          >
            <Ionicons name="cart-outline" size={23} color={COLORS.text} />

            {totalCartItems > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {totalCartItems > 99 ? "99+" : totalCartItems}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  leftContainer: {
    width: 44,
    alignItems: "flex-start",
  },
  rightContainer: {
    width: 44,
    alignItems: "flex-end",
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
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 2,
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
});
