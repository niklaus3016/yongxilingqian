import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ROOT = '/home/devbox/project';
const SOURCE = path.join(ROOT, 'yxlq512.png');

const ANDROID_RES_DIR = path.join(ROOT, 'android/app/src/main/res');

// Android icon sizes (mipmap densities)
const ANDROID_ICON_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

// Web icon sizes
const WEB_ICON_SIZES = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'pwa-192x192.png': 192,
  'pwa-512x512.png': 512,
};

async function resizeAndSave(input, size, outputPath) {
  await sharp(input)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(outputPath);
  console.log(`  ✓ Generated: ${path.basename(outputPath)} (${size}x${size})`);
}

async function main() {
  console.log('🔄 开始替换应用图标...\n');

  // Verify source exists
  if (!fs.existsSync(SOURCE)) {
    console.error(`❌ 源文件不存在: ${SOURCE}`);
    process.exit(1);
  }

  // 1. Generate Android icons
  console.log('📱 生成 Android 图标...');
  for (const [folder, size] of Object.entries(ANDROID_ICON_SIZES)) {
    const dir = path.join(ANDROID_RES_DIR, folder);
    if (!fs.existsSync(dir)) {
      console.log(`  ⚠️  目录不存在，跳过: ${folder}`);
      continue;
    }
    // ic_launcher.png
    await resizeAndSave(SOURCE, size, path.join(dir, 'ic_launcher.png'));
    // ic_launcher_foreground.png
    await resizeAndSave(SOURCE, size, path.join(dir, 'ic_launcher_foreground.png'));
    // ic_launcher_round.png
    await resizeAndSave(SOURCE, size, path.join(dir, 'ic_launcher_round.png'));
  }

  // 2. Generate Web icons
  console.log('\n🌐 生成 Web 图标...');
  const publicDir = path.join(ROOT, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  for (const [filename, size] of Object.entries(WEB_ICON_SIZES)) {
    await resizeAndSave(SOURCE, size, path.join(publicDir, filename));
  }

  // Also copy 512x512 as the source icon in public
  console.log('\n✨ 完成！所有图标已更新。');
}

main().catch(console.error);
