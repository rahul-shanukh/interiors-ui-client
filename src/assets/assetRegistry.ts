//src/assets/assetRegistry.ts

import kitchenLShaped from "./features/calculator/layouts/kitchen/Lshaped.avif";
import kitchenStraight from "./features/calculator/layouts/kitchen/straight.avif";
import kitchenUShaped from "./features/calculator/layouts/kitchen/ushaped.avif";
import kitchenParallel from "./features/calculator/layouts/kitchen/parallel.avif";
// import packageEssential from "./features/calculator/packages/general/essential.png";
// import packagePremium from "./features/calculator/packages/general/premium.png";
// import packageLuxe from "./features/calculator/packages/general/luxe.png";
import packageLuxe_avif from "./features/calculator/packages/general/luxe.avif";
import packagePremium_avif from "./features/calculator/packages/general/premium.avif";
import packageEssential_avif from "./features/calculator/packages/general/essential.avif";
import packageLuxe_webp from "./features/calculator/packages/general/luxe.webp";
import packagePremium_webp from "./features/calculator/packages/general/premium.webp";
import packageEssential_webp from "./features/calculator/packages/general/essential.webp";

import kitchenPackageEssential from "./features/calculator/packages/kitchen/kessential.avif";
import kitchenPackagePremium from "./features/calculator/packages/kitchen/kpremium.avif";
import kitchenPackageLuxury from "./features/calculator/packages/kitchen/kluxury.avif";

export const ASSETS = {
  calculator: {
    kitchen: {
      lShaped: kitchenLShaped,
      straight: kitchenStraight,
      uShaped: kitchenUShaped,
      parallel: kitchenParallel,
    },
    packages: {
      general: {
        essential: {
          avif: packageEssential_avif,
          fallback: packageEssential_webp,
        },
        premium: {
          avif: packagePremium_avif,
          fallback: packagePremium_webp,
        },
        luxe: {
          avif: packageLuxe_avif,
          fallback: packageLuxe_webp,
        },
      },
      kitchen: {
        kessential: kitchenPackageEssential,
        kpremium: kitchenPackagePremium,
        kluxury: kitchenPackageLuxury,
      },
    },
  },
} as const;
