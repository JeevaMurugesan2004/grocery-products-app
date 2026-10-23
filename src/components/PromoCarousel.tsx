import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface PromoBanner {
  id: "dairy_deals" | "fruits_veg";
  title: string;
  badge: string;
  itemsList: string;
  tagline: string;
  buttonLabel: string;
  image: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

const BANNERS: PromoBanner[] = [
  {
    id: "dairy_deals",
    title: "Dairy Deals",
    badge: "DAILY FRESH • UP TO 30% OFF",
    itemsList: "Milk, cheese, butter, and yogurt",
    tagline: "Farm-fresh dairy essentials delivered chilled to your doorstep.",
    buttonLabel: "Shop Dairy Deals",
    image:
      "https://media.istockphoto.com/id/1194287257/photo/dairy-products-on-rustic-wooden-table.jpg?s=612x612&w=0&k=20&c=WFbC5ZtHzp7En_Zmpa19pfHlP9z7Xs3aMrT33rT537c=",
    accentColor: "#1E5E3A",
    badgeBg: "#E8F5E9",
    badgeText: "#1E5E3A",
  },
  {
    id: "fruits_veg",
    title: "Fresh Fruits & Veg",
    badge: "FARM HARVEST • FLAT 20% OFF",
    itemsList: "Fresh fruits and vegetables",
    tagline:
      "Handpicked crisp green veggies and naturally sweet orchard fruits.",
    buttonLabel: "Shop Fruits & Veg",
    image:
      "https://san-j.com/wp-content/uploads/2024/02/01-healthiest-fruits-vegetables-REV02.jpg",
    accentColor: "#2E7D32",
    badgeBg: "#E8F5E9",
    badgeText: "#2E7D32",
  },
];

interface PromoCarouselProps {
  onSelectDairy: () => void;
  onSelectFruitsAndVeg: () => void;
  isActive?: boolean;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_HEIGHT = 240;

export const PromoCarousel: React.FC<PromoCarouselProps> = ({
  onSelectDairy,
  onSelectFruitsAndVeg,
  isActive = true,
}) => {
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const [containerWidth, setContainerWidth] = useState(
    Math.max(SCREEN_WIDTH - 40, 280),
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    if (width > 0) {
      setContainerWidth((previous) =>
        Math.abs(previous - width) > 1 ? width : previous,
      );
    }
  }, []);

  const handleBannerPress = useCallback(
    (id: PromoBanner["id"]) => {
      if (id === "dairy_deals") {
        onSelectDairy();
      } else {
        onSelectFruitsAndVeg();
      }
    },
    [onSelectDairy, onSelectFruitsAndVeg],
  );

  useEffect(() => {
    if (!isActive || containerWidth <= 0) return;

    const timer = setInterval(() => {
      setActiveIndex((previous) => {
        const next = (previous + 1) % BANNERS.length;

        scrollRef.current?.scrollTo({
          x: next * containerWidth,
          animated: true,
        });

        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isActive, containerWidth]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (containerWidth <= 0) return;

    const index = Math.max(
      0,
      Math.min(
        BANNERS.length - 1,
        Math.round(event.nativeEvent.contentOffset.x / containerWidth),
      ),
    );

    setActiveIndex(index);
  };

  const handleDotPress = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({
      x: index * containerWidth,
      animated: true,
    });
  };

  return (
    <View style={styles.wrapper} onLayout={handleLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {BANNERS.map((banner) => {
          const hasImageError = false;

          return (
            <View
              key={banner.id}
              style={[styles.slideContainer, { width: containerWidth }]}
            >
              <View style={styles.card}>
                {hasImageError ? (
                  <View style={styles.imageFallback}>
                    <Ionicons
                      name={
                        banner.id === "dairy_deals"
                          ? "water-outline"
                          : "nutrition-outline"
                      }
                      size={46}
                      color="#FFFFFF"
                    />
                    <Text style={styles.fallbackText}>Image unavailable</Text>
                  </View>
                ) : (
                  <ImageBackground
                    source={{ uri: banner.image }}
                    style={styles.cardBackground}
                    imageStyle={styles.backgroundImage}
                    resizeMode="cover"
                  >
                    <View pointerEvents="none" style={styles.imageOverlay} />

                    <View style={styles.contentCol}>
                      <View
                        style={[
                          styles.badgeContainer,
                          { backgroundColor: banner.badgeBg },
                        ]}
                      >
                        <Ionicons
                          name={banner.id === "dairy_deals" ? "water" : "leaf"}
                          size={12}
                          color={banner.badgeText}
                        />
                        <Text
                          style={[
                            styles.badgeText,
                            { color: banner.badgeText },
                          ]}
                          numberOfLines={2}
                        >
                          {banner.badge}
                        </Text>
                      </View>

                      <View style={styles.textGroup}>
                        <Text style={styles.bannerTitle} numberOfLines={2}>
                          {banner.title}
                        </Text>

                        <Text style={styles.itemsListText} numberOfLines={2}>
                          {banner.itemsList}
                        </Text>

                        <Text style={styles.taglineText} numberOfLines={3}>
                          {banner.tagline}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: banner.accentColor },
                        ]}
                        onPress={() => handleBannerPress(banner.id)}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel={banner.buttonLabel}
                      >
                        <Text style={styles.actionButtonText}>
                          {banner.buttonLabel}
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={14}
                          color="#FFFFFF"
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.organicTag}>
                      <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color="#2E7D32"
                      />
                      <Text style={styles.organicTagText}>100% Fresh</Text>
                    </View>
                  </ImageBackground>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.paginationRow}>
        {BANNERS.map((banner, index) => (
          <TouchableOpacity
            key={banner.id}
            style={[
              styles.dot,
              index === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
            onPress={() => handleDotPress(index)}
            accessibilityRole="button"
            accessibilityLabel={`Show banner ${index + 1}`}
            accessibilityState={{ selected: index === activeIndex }}
            activeOpacity={0.7}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 16,
  },
  scrollView: {
    width: "100%",
    flexGrow: 0,
  },
  slideContainer: {
    paddingHorizontal: 1,
    paddingVertical: 3,
  },
  card: {
    width: "100%",
    height: CARD_HEIGHT,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#D1E7D5",
    backgroundColor: "#42633C",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  cardBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  backgroundImage: {
    opacity: 0.42,
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.30)",
  },
  contentCol: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: "78%",
  },
  badgeText: {
    flexShrink: 1,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  textGroup: {
    width: "100%",
    flexShrink: 1,
    marginVertical: 6,
  },
  bannerTitle: {
    color: "#17452B",
    fontSize: 19,
    fontWeight: "900",
  },

  itemsListText: {
    color: "#245D38",
    fontSize: 11,
    fontWeight: "700",
  },

  taglineText: {
    color: "#294B36",
    fontSize: 10.5,
    lineHeight: 14,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  organicTag: {
    position: "absolute",
    right: 8,
    top: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    elevation: 2,
  },
  organicTagText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#1E5E3A",
  },
  imageFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#42633C",
  },
  fallbackText: {
    marginTop: 8,
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: "#2E7D32",
  },
  dotInactive: {
    width: 6,
    backgroundColor: "#C8E6C9",
  },
});
