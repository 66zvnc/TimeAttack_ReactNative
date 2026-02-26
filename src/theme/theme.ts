// OVERLAP Design System
// Premium motorsport telemetry UI theme

export const theme = {
  // Colors
  colors: {
    // Primary
    primary: '#0A84FF',
    primaryDark: '#0070E0',
    accent: '#00D1FF',
    
    // Status
    success: '#22C55E',
    warning: '#F5B301',
    error: '#EF4444',
    
    // Background
    background: '#F5F7FA',
    backgroundDark: '#0E1116',
    
    // Cards
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    
    // Text
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    glassBackground: 'rgba(255, 255, 255, 0.95)',
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border Radius
  radius: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    pill: 999,
  },
  
  // Typography
  typography: {
    // Sizes
    sizes: {
      tiny: 12,
      small: 14,
      body: 15,
      medium: 16,
      subtitle: 18,
      title: 20,
      heading: 28,
      display: 32,
      timer: 56,
    },
    
    // Weights
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    
    // Families
    families: {
      default: 'Inter-Regular',
      medium: 'Inter-Medium',
      semibold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
      monospace: 'Menlo',
    },
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
      elevation: 8,
    },
  },
};

// Helper function to get the correct font family based on weight
export const getFontFamily = (weight?: '400' | '500' | '600' | '700'): string => {
  switch (weight) {
    case '500':
      return theme.typography.families.medium;
    case '600':
      return theme.typography.families.semibold;
    case '700':
      return theme.typography.families.bold;
    case '400':
    default:
      return theme.typography.families.default;
  }
};

export type Theme = typeof theme;
