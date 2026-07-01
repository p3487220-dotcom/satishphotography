const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');

const imageMapping = {
  'baby.webp': path.join(ASSETS_DIR, 'Baby', '0Y2A2863.jpg'),
  'engagement.webp': path.join(ASSETS_DIR, 'Engagemente', 'ChatGPT Image Jun 30, 2026, 03_43_39 AM.png'),
  'haldi.webp': path.join(ASSETS_DIR, 'Haldi', 'MSR_1335.jpg'),
  'half_saree.webp': path.join(ASSETS_DIR, 'Half Sare', 'SR_L2927.jpg'),
  'indoor.webp': path.join(ASSETS_DIR, 'Indoor', 'frent page.01.jpg'),
  'outdoor.webp': path.join(ASSETS_DIR, 'Outdoor', '10.jpg'),
  'reception.webp': path.join(ASSETS_DIR, 'Reception', 'ChatGPT Image Jun 30, 2026, 05_00_31 AM.png'),
  'satish_pic.webp': path.join(ASSETS_DIR, 'Satish pic', 'file_000000004e3471fb9ddccd6bb32785f4.png'),
  'wedding.webp': path.join(ASSETS_DIR, 'Wedding', 'ChatGPT Image Jun 30, 2026, 04_56_24 AM.png')
};

async function optimizeImages() {
  console.log('Starting image optimization...');
  for (const [targetName, sourcePath] of Object.entries(imageMapping)) {
    const targetPath = path.join(ASSETS_DIR, targetName);
    
    if (!fs.existsSync(sourcePath)) {
      console.error(`Source file not found: ${sourcePath}`);
      continue;
    }
    
    console.log(`Optimizing ${path.basename(sourcePath)} -> ${targetName}...`);
    try {
      const metadata = await sharp(sourcePath).metadata();
      const resizeOptions = {};
      if (metadata.width > 1920 || metadata.height > 1920) {
        if (metadata.width > metadata.height) {
          resizeOptions.width = 1920;
        } else {
          resizeOptions.height = 1920;
        }
      }
      
      await sharp(sourcePath)
        .resize(resizeOptions)
        .webp({ quality: 80 })
        .toFile(targetPath);
        
      const statsOrig = fs.statSync(sourcePath);
      const statsOpt = fs.statSync(targetPath);
      const origMb = (statsOrig.size / (1024 * 1024)).toFixed(2);
      const optKb = (statsOpt.size / 1024).toFixed(2);
      console.log(`Success! Saved ${targetName} (${origMb} MB -> ${optKb} KB)`);
    } catch (err) {
      console.error(`Failed to optimize ${sourcePath}:`, err);
    }
  }
  console.log('Image optimization finished!');
}

optimizeImages();
