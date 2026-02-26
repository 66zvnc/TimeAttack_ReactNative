import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: keyof typeof theme.spacing;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  elevated = true,
  padding = 'lg',
}) => {
  return (
    <View 
      style={[
        styles.card,
        elevated && theme.shadows.md,
        { padding: theme.spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
});
