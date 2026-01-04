const sharp = require('sharp');
const path = require('path');

async function generateOGImage() {
  const logoPath = path.join(__dirname, '../public/For_Logo.PNG');
  const outputPath = path.join(__dirname, '../public/og-default.jpg');

  try {
    // Read the logo to get its dimensions
    const logoMetadata = await sharp(logoPath).metadata();

    // OG image dimensions
    const ogWidth = 1200;
    const ogHeight = 630;

    // Navy color from your brand (matching the theme)
    const navyColor = '#1c1e4d';

    // Calculate logo dimensions (make it 70% of the width, centered)
    const maxLogoWidth = Math.floor(ogWidth * 0.7);
    const logoScale = maxLogoWidth / logoMetadata.width;
    const scaledLogoHeight = Math.floor(logoMetadata.height * logoScale);

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
    .jpeg({ quality: 90 })
    .toFile(outputPath);

    console.log(`✅ OG image generated successfully at ${outputPath}`);
    console.log(`   Dimensions: ${ogWidth}x${ogHeight}px`);
    console.log(`   Format: JPEG`);

  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  }
}

generateOGImage();
