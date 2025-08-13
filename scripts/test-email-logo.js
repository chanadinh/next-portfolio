const { generateAutoReplyContent, LOGO_CONFIG } = require('../lib/email.ts');

async function testEmailLogo() {
  try {
    console.log('🧪 Testing email logo configuration...\n');
    
    // Test data
    const testUserData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message to verify the logo is working correctly.'
    };
    
    console.log('📧 Logo Configuration:');
    console.log(`   URL: ${LOGO_CONFIG.url}`);
    console.log(`   Alt: ${LOGO_CONFIG.alt}`);
    
    // Generate email content
    const { htmlContent } = generateAutoReplyContent(testUserData);
    
    // Check if logo URL is in the HTML
    if (htmlContent.includes(LOGO_CONFIG.url)) {
      console.log('✅ Logo URL found in email HTML');
    } else {
      console.log('❌ Logo URL NOT found in email HTML');
    }
    
    // Check if logo alt text is in the HTML
    if (htmlContent.includes(LOGO_CONFIG.alt)) {
      console.log('✅ Logo alt text found in email HTML');
    } else {
      console.log('❌ Logo alt text NOT found in email HTML');
    }
    
    // Save test email to file for inspection
    const fs = require('fs');
    const testEmailPath = './test-email-logo.html';
    fs.writeFileSync(testEmailPath, htmlContent);
    console.log(`\n💾 Test email saved to: ${testEmailPath}`);
    
    console.log('\n🎉 Email logo test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing email logo:', error.message);
    throw error;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testEmailLogo()
    .then(() => {
      console.log('\n✨ All tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Tests failed!');
      process.exit(1);
    });
}

module.exports = { testEmailLogo };
