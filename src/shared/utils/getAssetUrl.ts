/**
 * Resolves the absolute URL for an asset.
 * Automatically prepends the base CDN URL from environment variables.
 * * @param path The relative path inside the 'assets' directory (e.g., 'features/calculator/kitchen.png')
 */
export const getAssetUrl = (path: string): string => {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("/")
  ) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_CDN_BASE_URL || "/assets";

  // Ensure we don't have double slashes
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${cleanBase}/${cleanPath}`;
};
