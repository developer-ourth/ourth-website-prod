const fs = require('fs');
const path = require('path');

const ids = [
  "DFVMQWByMSi",
  "DEy87_eSGns",
  "DEwgaYDy1q1",
  "DEuGPMSyQzf",
  "DEnq7dKywzD",
  "DEiJ4rXS0xV",
];

const outputDir = path.join(__dirname, 'public', 'images', 'instagram');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function download(id) {
  const url = `https://www.instagram.com/p/${id}/media/?size=m`;
  const dest = path.join(outputDir, `${id}.jpg`);
  
  console.log(`Fetching ${id} from ${url}...`);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log(`Saved to ${dest}`);
  } catch (err) {
    console.error(`Failed to download ${id}:`, err.message);
  }
}

async function run() {
  for (const id of ids) {
    await download(id);
    // Add small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

run();
