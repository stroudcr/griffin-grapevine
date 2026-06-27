/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const path = require('path');

async function generateOGImage() {
  const logoPath = path.join(__dirname, '../public/horizontal.jpg');
  const outputPath = path.join(__dirname, '../public/griffin-og-image.png');

  try {
    // OG image dimensions
    const ogWidth = 1200;
    const ogHeight = 630;

    // Navy color from the publication brand.
    const navyColor = '#1c1e4d';

    // Calculate logo dimensions (make it 70% of the width, centered)
    const maxLogoWidth = Math.floor(ogWidth * 0.7);

    // Create the OG image
    await sharp({
      create: {
        width: ogWidth,
        height: ogHeight,
        channels: 4,
        background: navyColor
      }
    })
    .composite([
      {
        input: await sharp(logoPath)
          .resize({
            width: maxLogoWidth,
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .toBuffer(),
        gravity: 'center'
      }
    ])
    .png({ quality: 90 })
    .toFile(outputPath);

    console.log(`OG image generated successfully at ${outputPath}`);
    console.log(`   Dimensions: ${ogWidth}x${ogHeight}px`);
    console.log("   Format: PNG");

  } catch (error) {
    console.error('Error generating OG image:', error);
    process.exit(1);
  }
}

generateOGImage();
