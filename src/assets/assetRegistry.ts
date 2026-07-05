//src/assets/assetRegistry.ts

import kitchenLShaped from "./features/calculator/layouts/kitchen/Lshaped.png";
import kitchenStraight from "./features/calculator/layouts/kitchen/straight.png";
import kitchenUShaped from "./features/calculator/layouts/kitchen/ushaped.png";
import kitchenParallel from "./features/calculator/layouts/kitchen/parallel.png";
import packageEssential from "./features/calculator/packages/general/essential.png";
import packagePremium from "./features/calculator/packages/general/premium.png";
import packageLuxe from "./features/calculator/packages/general/luxe.png";
import kitchenPackageEssential from "./features/calculator/packages/kitchen/kessential.png";
import kitchenPackagePremium from "./features/calculator/packages/kitchen/kpremium.png";
import kitchenPackageLuxury from "./features/calculator/packages/kitchen/kluxury.png";

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
        essential: packageEssential,
        premium: packagePremium,
        luxe: packageLuxe,
      },
      kitchen: {
        kessential: kitchenPackageEssential,
        kpremium: kitchenPackagePremium,
        kluxury: kitchenPackageLuxury,
      },
    },
  },
} as const;
