import React from "react";
import { ROOM_PALETTES } from "../../../entities/room-category/config/palettes";

interface CategoryThemeProviderProps {
  roomSlug: string;
  children: React.ReactNode;
}

const toCssVariable = (key: string) =>
  `--${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;

export const CategoryThemeProvider: React.FC<CategoryThemeProviderProps> = ({
  roomSlug,
  children,
}) => {
  const palette = ROOM_PALETTES[roomSlug] ?? ROOM_PALETTES["kitchen"];

  const cssVariables = Object.fromEntries(
    Object.entries(palette.tokens).map(([key, value]) => [
      toCssVariable(key),
      value,
    ]),
  ) as React.CSSProperties;

  return (
    <div
      style={cssVariables}
      data-theme={palette.themeId}
      className="transition-colors duration-500"
    >
      {children}
    </div>
  );
};
