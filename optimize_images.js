const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function convertToWebp(sourcePath, destPath, quality = 80) {
  if (fs.existsSync(sourcePath)) {
    console.log(`Compressing ${sourcePath}...`);
    const origSize = fs.statSync(sourcePath).size;
    
    try {
      const info = await sharp(sourcePath)
        .webp({ quality })
        .toFile(destPath);
      
      const newSize = info.size;
      console.log(`Done! Saved to ${destPath}`);
      console.log(`Original size: ${(origSize / (1024*1024)).toFixed(2)} MB | Optimized size: ${(newSize / (1024*1024)).toFixed(2)} MB (${(100 - (newSize/origSize)*100).toFixed(1)}% reduction)\n`);
    } catch (err) {
      console.error(`Error compressing ${sourcePath}:`, err);
    }
  } else {
    console.log(`Source not found: ${sourcePath}`);
  }
}

async function main() {
  // Contact page images
  await convertToWebp("public/images/contact/tree.png", "public/images/contact/tree.webp");
  await convertToWebp("public/images/contact/grass.png", "public/images/contact/grass.webp");
  
  // About page images
  await convertToWebp("public/images/about/about_top.png", "public/images/about/about_top.webp");

  // Home page images
  await convertToWebp("public/images/home/image1.png", "public/images/home/image1.webp");
  await convertToWebp("public/images/home/image2.png", "public/images/home/image2.webp");
  await convertToWebp("public/images/home/image5.png", "public/images/home/image5.webp");
  await convertToWebp("public/images/home/image6.png", "public/images/home/image6.webp");
  await convertToWebp("public/images/home/image7.png", "public/images/home/image7.webp");
  await convertToWebp("public/images/home/image8.png", "public/images/home/image8.webp");
  await convertToWebp("public/images/home/image9.png", "public/images/home/image9.webp");

  // Hero page cloud boundary
  await convertToWebp("public/clouds.png", "public/clouds.webp");
}

main();
