// Defines the structure for brand-related design tokens and palettes used in room categories.
export interface BrandTokens {
  primary: string;
  surfaceBanner: string;
  surfaceCardHover: string;
  textHeading: string;
  badgeBackground: string;
  badgeText: string;
  headerBackground?: string; // Optional property for header background color
}

export interface BrandPalette {
  themeId: string;
  tokens: BrandTokens;
}
