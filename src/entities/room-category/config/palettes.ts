import type { BrandPalette } from "../model/types";

export const ROOM_PALETTES: Record<string, BrandPalette> = {
  kitchen: {
    themeId: "kitchen-warm-coral",
    tokens: {
      primary: "#e63946",
      surfaceBanner: "linear-gradient(135deg, #fff0f3 0%, #ffccd5 100%)",
      surfaceCardHover: "#fff8f9",
      textHeading: "#590d22",
      badgeBackground: "#ffb3c1",
      badgeText: "#800f2f",
      headerBackground: "#ffe6eb",
    },
  },
  wardrobe: {
    themeId: "wardrobe-luxury-slate",
    tokens: {
      primary: "#212529",
      surfaceBanner: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      surfaceCardHover: "#f1f3f5",
      textHeading: "#212529",
      badgeBackground: "#dee2e6",
      badgeText: "#212529",
    },
  },
  "pooja-room": {
    themeId: "pooja-royal-amber",
    tokens: {
      primary: "#d97706",
      surfaceBanner: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      surfaceCardHover: "#fffdf5",
      textHeading: "#78350f",
      badgeBackground: "#fde68a",
      badgeText: "#92400e",
    },
  },
};
