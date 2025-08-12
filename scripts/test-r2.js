const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

async function testR2Connection() {
  try {
    console.log('🔍 Testing Cloudflare R2 connection...\n');
    
    // Check environment variables
    const requiredVars = [
      'CLOUDFLARE_R2_ACCESS_KEY_ID',
      'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
      'CLOUDFLARE_R2_ENDPOINT',
      'CLOUDFLARE_R2_BUCKET_NAME',
      'CLOUDFLARE_R2_ACCOUNT_ID'
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
    
    // Test S3 client connection
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });
    
    console.log('\n🔗 Testing S3 client connection...');
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    
    console.log('✅ Successfully connected to R2!');
    console.log(`📦 Found ${response.Buckets?.length || 0} buckets`);
    
    if (response.Buckets) {
      response.Buckets.forEach(bucket => {
        console.log(`   - ${bucket.Name} (created: ${bucket.CreationDate})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing R2 connection:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your .env.local file exists');
    console.log('2. Verify your R2 credentials are correct');
    console.log('3. Ensure your R2 bucket is created');
    console.log('4. Check your API token has R2 permissions');
  }
}

testR2Connection();
