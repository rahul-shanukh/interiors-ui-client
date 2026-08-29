import sharp from "sharp"; // Image processing library
import { glob } from "glob"; // Finds files matching a pattern
import fs from "fs/promises"; // Async file system API
import path from "path"; // File path utilities

//pnpm optimize-images

const INPUT_DIR = "src/assets/features/calculator/packages/general";
const OUTPUT_DIR = "src/assets/features/calculator/packages/general";

const MAX_WIDTH = 1920; // Don't create images wider than 1920px
const AVIF_QUALITY = 65;
const WEBP_QUALITY = 80;

async function optimizeImages() {
  // Ensure output folder exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Find all supported images
  const files = await glob(`${INPUT_DIR}/*.{jpg,jpeg,png,avif}`);

  // Handle empty folder
  if (files.length === 0) {
    console.warn("⚠ No images found.");
    return;
  }

  let success = 0;
  let failed = 0;

  // Process one image at a time
  for (const file of files) {
    try {
      const fileName = path.parse(file).name;

      const image = sharp(file).rotate(); // Auto-fix EXIF orientation

      // Generate AVIF
      await image
        .clone() // Clone so the same image can be reused
        .resize({
          width: MAX_WIDTH,
          withoutEnlargement: true, // Don't enlarge small images
        })
        .avif({ quality: AVIF_QUALITY })
        .toFile(`${OUTPUT_DIR}/${fileName}.avif`);

      // Generate WebP
      await image
        .clone()
        .resize({
          width: MAX_WIDTH,
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY })
        .toFile(`${OUTPUT_DIR}/${fileName}.webp`);

      console.log(`✓ ${fileName}`);
      success++;
    } catch (error) {
      console.error(`✗ Failed: ${file}`);
      console.error(error);
      failed++;
    }
  }

  console.log("\n--------- Summary ---------");
  console.log(`Processed : ${files.length}`);
  console.log(`Succeeded : ${success}`);
  console.log(`Failed    : ${failed}`);

  // Useful for CI/CD
  if (failed > 0) {
    process.exitCode = 1;
  }
}

optimizeImages().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
