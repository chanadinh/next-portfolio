const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function uploadLogoToR2() {
  try {
    console.log('🚀 Uploading logo to Cloudflare R2...\n');
    
    // Check environment variables
    const requiredVars = [
      'CLOUDFLARE_R2_ACCESS_KEY_ID',
      'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
      'CLOUDFLARE_R2_ENDPOINT',
      'CLOUDFLARE_R2_BUCKET_NAME',
      'CLOUDFLARE_R2_PUBLIC_DOMAIN'
    ];
    
    console.log('📋 Environment Variables:');
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
      } else {
        console.log(`❌ ${varName}: MISSING`);
      }
    });
    
    // Check if logo file exists
    const logoPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');
    if (!fs.existsSync(logoPath)) {
      throw new Error(`Logo file not found at: ${logoPath}`);
    }
    
    console.log(`📁 Logo file found: ${logoPath}`);
    
    // Read logo file
    const logoBuffer = fs.readFileSync(logoPath);
    console.log(`📊 Logo file size: ${(logoBuffer.length / 1024).toFixed(2)} KB`);
    
    // Create S3 client
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
    
    // Upload logo to R2
    const key = `assets/logo-${Date.now()}.png`;
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: logoBuffer,
      ContentType: 'image/png',
      ACL: 'public-read',
    });
    
    console.log(`📤 Uploading logo to R2 with key: ${key}`);
    await s3Client.send(command);
    
    // Generate public URL
    const publicUrl = `https://${process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/${key}`;
    
    console.log('\n✅ Logo successfully uploaded to R2!');
    console.log(`🔗 Public URL: ${publicUrl}`);
    console.log(`🔑 R2 Key: ${key}`);
    
    // Save the URL to a file for easy access
    const urlInfo = {
      logoUrl: publicUrl,
      r2Key: key,
      uploadedAt: new Date().toISOString(),
      originalFile: 'public/images/logo.png'
    };
    
    const urlFilePath = path.join(__dirname, '..', 'logo-r2-url.json');
    fs.writeFileSync(urlFilePath, JSON.stringify(urlInfo, null, 2));
    console.log(`💾 URL info saved to: ${urlFilePath}`);
    
    return publicUrl;
    
  } catch (error) {
    console.error('❌ Error uploading logo to R2:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your .env.local file exists');
    console.log('2. Verify your R2 credentials are correct');
    console.log('3. Ensure your R2 bucket is created');
    console.log('4. Check your API token has R2 permissions');
    console.log('5. Verify the logo file exists in public/images/');
    throw error;
  }
}

// Run the upload if this script is executed directly
if (require.main === module) {
  uploadLogoToR2()
    .then(() => {
      console.log('\n🎉 Logo upload completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Logo upload failed!');
      process.exit(1);
    });
}

module.exports = { uploadLogoToR2 };
