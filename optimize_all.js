const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "public");

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") return;

  const dir = path.dirname(filePath);
  const name = path.basename(filePath, ext);
  const webpPath = path.join(dir, `${name}.webp`);

  // Always regenerate webp if original is modified or doesn't exist
  console.log(`Processing: ${filePath}`);
  const stats = fs.statSync(filePath);
  const sizeMb = stats.size / (1024 * 1024);

  try {
    let pipeline = sharp(filePath);
    const metadata = await pipeline.metadata();

    // If image is unnecessarily large (wider than 2000px), downscale it
    if (metadata.width > 2000) {
      console.log(`  Resizing width from ${metadata.width}px to 2000px (Aspect Ratio preserved)`);
      pipeline = pipeline.resize({ width: 2000, withoutEnlargement: true });
    }

    // Convert to webp with standard quality
    const info = await pipeline.webp({ quality: 80 }).toFile(webpPath);
    const newSizeMb = info.size / (1024 * 1024);

    console.log(`  Optimized: ${webpPath}`);
    console.log(`  Size: ${sizeMb.toFixed(2)} MB -> ${newSizeMb.toFixed(2)} MB (${(100 - (info.size / stats.size) * 100).toFixed(1)}% saved)\n`);
  } catch (err) {
    console.error(`  Error processing ${filePath}:`, err.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

console.log("Starting full image optimization pass...\n");
walkDir(PUBLIC_DIR);
console.log("Image optimization pass finished!");
