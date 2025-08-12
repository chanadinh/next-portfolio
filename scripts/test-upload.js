const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function testR2Upload() {
  try {
    console.log('🚀 Testing R2 file upload...\n');
    
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
    
    // Create a test file
    const testContent = 'This is a test file for R2 upload';
    const testFileName = `test-${Date.now()}.txt`;
    const testFilePath = path.join(__dirname, testFileName);
    
    fs.writeFileSync(testFilePath, testContent);
    console.log(`📝 Created test file: ${testFileName}`);
    
    // Upload to R2
    const key = `test/${testFileName}`;
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: testContent,
      ContentType: 'text/plain',
      ACL: 'public-read',
    });
    
    console.log('📤 Uploading to R2...');
    await s3Client.send(uploadCommand);
    console.log('✅ Upload successful!');
    
    // Generate public URL
    const publicUrl = `https://${process.env.CLOUDFLARE_R2_BUCKET_NAME}.${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
    console.log(`🔗 Public URL: ${publicUrl}`);
    
    // Test download
    console.log('\n📥 Testing download...');
    const downloadCommand = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    });
    
    const downloadResponse = await s3Client.send(downloadCommand);
    const downloadedContent = await downloadResponse.Body.transformToString();
    
    if (downloadedContent === testContent) {
      console.log('✅ Download successful - content matches!');
    } else {
      console.log('❌ Download failed - content mismatch');
    }
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log(`🧹 Cleaned up test file: ${testFileName}`);
    
    console.log('\n🎉 R2 upload test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing R2 upload:', error.message);
  }
}

testR2Upload();
