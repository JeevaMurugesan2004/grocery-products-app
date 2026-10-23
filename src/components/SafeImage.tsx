import React, { useState } from 'react';
import {
  Image,
  ImageProps,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

interface SafeImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  placeholderText?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  uri,
  style,
  fallbackIcon = 'basket-outline',
  placeholderText,
  ...rest
}) => {
  const [prevUri, setPrevUri] = useState(uri);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (prevUri !== uri) {
    setPrevUri(uri);
    setHasError(false);
    setIsLoading(true);
  }

  if (hasError || !uri) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Ionicons name={fallbackIcon} size={32} color={COLORS.secondaryText} />
        {placeholderText ? (
          <Text style={styles.fallbackText}>{placeholderText}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, style]}>
      <Image
        source={{ uri }}
        style={[styles.fillImage, style]}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...rest}
      />
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: '#EBEBC8',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  fillImage: {
    width: '100%',
    height: '100%',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(245, 245, 217, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContainer: {
    backgroundColor: '#EBEBC8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    padding: 8,
  },
  fallbackText: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 4,
    fontWeight: '600',
  },
});
