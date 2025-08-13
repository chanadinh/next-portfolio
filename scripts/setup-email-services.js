#!/usr/bin/env node

/**
 * Email Services Setup Script
 * This script helps you configure all three email services for your portfolio
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🚀 Email Services Setup for Portfolio');
console.log('=====================================\n');

async function main() {
  try {
    console.log('📧 This script will help you set up all three email services:');
    console.log('   • Resend (Recommended - 3,000 emails/month free)');
    console.log('   • SendGrid (100 emails/day free)');
    console.log('   • Mailgun (5,000 emails/month free for 3 months)\n');

    // Check if .env.local exists
    const envPath = path.join(process.cwd(), '.env.local');
    const envExists = fs.existsSync(envPath);
    
    if (!envExists) {
      console.log('⚠️  .env.local file not found. Creating one...\n');
      fs.writeFileSync(envPath, '');
    }

    let envContent = envExists ? fs.readFileSync(envPath, 'utf8') : '';
    
    // Email configuration section
    const emailConfigSection = `
# Email Service Configuration
# Choose one or more services to configure

# Your Custom Domain Email Addresses
CONTACT_EMAIL=contact@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com

# Resend Email Service (Recommended)
# Sign up at: https://resend.com
# Free tier: 3,000 emails/month
RESEND_API_KEY=your_resend_api_key_here

# SendGrid Email Service
# Sign up at: https://sendgrid.com
# Free tier: 100 emails/day
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Mailgun Email Service
# Sign up at: https://mailgun.com
# Free tier: 5,000 emails/month for 3 months
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=yourdomain.com
`;

    // Check if email config already exists
    if (!envContent.includes('CONTACT_EMAIL=')) {
      envContent += emailConfigSection;
      console.log('✅ Added email configuration to .env.local\n');
    } else {
      console.log('ℹ️  Email configuration already exists in .env.local\n');
    }

    // Ask for custom domain
    const customDomain = await question('🌐 Enter your custom domain (e.g., yourdomain.com): ');
    
    if (customDomain) {
      // Update domain in env content
      envContent = envContent.replace(/yourdomain\.com/g, customDomain);
      console.log(`✅ Updated domain references to: ${customDomain}\n`);
    }

    // Ask for contact email
    const contactEmail = await question(`📧 Enter your contact email (e.g., contact@${customDomain || 'yourdomain.com'}): `);
    
    if (contactEmail) {
      envContent = envContent.replace(/contact@yourdomain\.com/g, contactEmail);
      console.log(`✅ Updated contact email to: ${contactEmail}\n`);
    }

    // Ask for from email
    const fromEmail = await question(`📤 Enter your from email (e.g., noreply@${customDomain || 'yourdomain.com'}): `);
    
    if (fromEmail) {
      envContent = envContent.replace(/noreply@yourdomain\.com/g, fromEmail);
      console.log(`✅ Updated from email to: ${fromEmail}\n`);
    }

    // Save updated .env.local
    fs.writeFileSync(envPath, envContent);
    console.log('💾 Updated .env.local file\n');

    // Service setup instructions
    console.log('🔧 Next Steps for Each Service:\n');

    console.log('1️⃣  RESEND (Recommended):');
    console.log('   • Go to https://resend.com');
    console.log('   • Sign up for free account');
    console.log('   • Get API key from dashboard');
    console.log('   • Add domain in dashboard');
    console.log('   • Update RESEND_API_KEY in .env.local\n');

    console.log('2️⃣  SENDGRID:');
    console.log('   • Go to https://sendgrid.com');
    console.log('   • Sign up for free account');
    console.log('   • Create API key in Settings > API Keys');
    console.log('   • Update SENDGRID_API_KEY in .env.local\n');

    console.log('3️⃣  MAILGUN:');
    console.log('   • Go to https://mailgun.com');
    console.log('   • Sign up for free account');
    console.log('   • Get API key from dashboard');
    console.log('   • Add domain in dashboard');
    console.log('   • Update MAILGUN_API_KEY and MAILGUN_DOMAIN in .env.local\n');

    // Testing instructions
    console.log('🧪 Testing Your Setup:');
    console.log('   • Start your dev server: npm run dev');
    console.log('   • Test contact form on your portfolio');
    console.log('   • Check console for email service status');
    console.log('   • Use /api/test-email endpoint to test services\n');

    // Environment variables summary
    console.log('📋 Required Environment Variables:');
    console.log('   CONTACT_EMAIL - Where you receive contact form submissions');
    console.log('   FROM_EMAIL - Email address that sends notifications');
    console.log('   RESEND_API_KEY - Your Resend API key (if using Resend)');
    console.log('   SENDGRID_API_KEY - Your SendGrid API key (if using SendGrid)');
    console.log('   MAILGUN_API_KEY - Your Mailgun API key (if using Mailgun)');
    console.log('   MAILGUN_DOMAIN - Your domain for Mailgun\n');

    console.log('✅ Setup complete! Follow the steps above to configure your chosen email services.');
    console.log('💡 Tip: You can configure multiple services for redundancy - the system will try each one in order.');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    rl.close();
  }
}

main();
