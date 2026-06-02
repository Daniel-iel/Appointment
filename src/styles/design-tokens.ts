/**
 * Design tokens extracted from DESIGN.md (HashiCorp-inspired)
 * Adapted for balanced dark mode
 */

export const colors = {
  // Primary & Canvas
  primary: '#000000',
  'on-primary': '#ffffff',
  'accent-blue': '#2b89ff',
  
  // Ink (Text colors)
  ink: '#ffffff',
  'ink-muted': '#b2b6bd',
  'ink-subtle': '#656a76',
  
  // Canvas & Surfaces (adapted for balanced dark)
  canvas: '#0a0a0a', // Slightly lighter than pure black for better OLED support
  'surface-1': '#15181e',
  'surface-2': '#1f232b',
  'surface-3': '#3b3d45',
  
  // Borders
  hairline: '#3b3d45',
  'hairline-soft': '#252830',
  
  // Inverse (for buttons/highlights)
  'inverse-canvas': '#ffffff',
  'inverse-ink': '#000000',
  
  // Product Colors (HashiCorp products)
  'product-terraform': '#7b42bc',
  'product-terraform-bright': '#911ced',
  'product-vault': '#ffcf25',
  'product-consul': '#e62b1e',
  'product-waypoint': '#14c6cb',
  'product-waypoint-deep': '#12b6bb',
  'product-vagrant': '#1868f2',
  'product-nomad': '#00ca8e',
  'product-boundary': '#f24c53',
  
  // Semantic Colors
  'semantic-success': '#00ca8e',
  'semantic-warning': '#ffcf25',
  'semantic-error': '#e62b1e',
  'semantic-info': '#2b89ff',
} as const;

export const typography = {
  'display-xl': {
    fontSize: '80px',
    fontWeight: 700,
    lineHeight: 1.17,
    letterSpacing: '-2.5px',
  },
  'display-lg': {
    fontSize: '56px',
    fontWeight: 700,
    lineHeight: 1.18,
    letterSpacing: '-1.6px',
  },
  'display-md': {
    fontSize: '40px',
    fontWeight: 600,
    lineHeight: 1.19,
    letterSpacing: '-1.0px',
  },
  headline: {
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: 1.21,
    letterSpacing: '-0.6px',
  },
  'card-title': {
    fontSize: '22px',
    fontWeight: 600,
    lineHeight: 1.18,
    letterSpacing: '-0.4px',
  },
  subhead: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.35,
    letterSpacing: '-0.2px',
  },
  'body-lg': {
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: 1.69,
    letterSpacing: 0,
  },
  body: {
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: 1.50,
    letterSpacing: 0,
  },
  'body-sm': {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.71,
    letterSpacing: 0,
  },
  caption: {
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: 1.38,
    letterSpacing: '0.2px',
  },
  button: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.29,
    letterSpacing: 0,
  },
  eyebrow: {
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1.23,
    letterSpacing: '0.6px',
  },
} as const;

export const rounded = {
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '24px',
  pill: '9999px',
  full: '9999px',
} as const;

export const spacing = {
  hair: '1px',
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  section: '96px',
} as const;

/**
 * Get a product color by name
 */
export function getProductColor(product: 'terraform' | 'vault' | 'consul' | 'waypoint' | 'vagrant' | 'nomad' | 'boundary'): string {
  return colors[`product-${product}`];
}

/**
 * Get chart colors (array for multi-series charts)
 */
export function getChartColors(): string[] {
  return [
    colors['product-terraform'],
    colors['product-vault'],
    colors['product-waypoint'],
    colors['product-nomad'],
    colors['product-vagrant'],
    colors['product-consul'],
    colors['product-boundary'],
  ];
}

/**
 * Get semantic color by status
 */
export function getSemanticColor(status: 'success' | 'warning' | 'error' | 'info'): string {
  return colors[`semantic-${status}`];
}
