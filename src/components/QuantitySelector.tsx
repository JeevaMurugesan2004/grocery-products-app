import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'small' | 'medium' | 'large';
  min?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  size = 'medium',
  min = 0,
}) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const buttonSize = isSmall ? 28 : isLarge ? 42 : 34;
  const iconSize = isSmall ? 14 : isLarge ? 20 : 16;
  const fontSize = isSmall ? 13 : isLarge ? 18 : 15;

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <TouchableOpacity
        style={[
          styles.btn,
          { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
          quantity <= min && styles.btnDisabled,
        ]}
        onPress={onDecrease}
        activeOpacity={0.7}
        disabled={quantity <= min}
        accessibilityLabel="Decrease quantity">
        <Ionicons
          name="remove"
          size={iconSize}
          color={quantity <= min ? COLORS.lightText : COLORS.text}
        />
      </TouchableOpacity>

      <View style={styles.qtyContainer}>
        <Text style={[styles.qtyText, { fontSize }]}>{quantity}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.btn,
          styles.btnPlus,
          { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
        ]}
        onPress={onIncrease}
        activeOpacity={0.7}
        accessibilityLabel="Increase quantity">
        <Ionicons name="add" size={iconSize} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBC8',
    borderRadius: 22,
    padding: 3,
  },
  containerSmall: {
    borderRadius: 16,
    padding: 2,
  },
  btn: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  btnPlus: {
    backgroundColor: COLORS.primary,
  },
  btnDisabled: {
    backgroundColor: '#E2E2BD',
    elevation: 0,
    shadowOpacity: 0,
  },
  qtyContainer: {
    paddingHorizontal: 12,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontWeight: '700',
    color: COLORS.text,
  },
});
