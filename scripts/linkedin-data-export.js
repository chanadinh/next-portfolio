#!/usr/bin/env node

/**
 * LinkedIn Data Export Script
 * 
 * IMPORTANT: This script provides guidance for exporting LinkedIn data
 * LinkedIn has strict terms of service and anti-scraping measures
 * 
 * Legal and Ethical Approaches:
 * 1. Use LinkedIn's official data export feature
 * 2. Use LinkedIn's official API (requires approval)
 * 3. Manual export through LinkedIn settings
 */

const fs = require('fs');
const path = require('path');

console.log(`
🔗 LinkedIn Data Export Guide
==============================

⚠️  IMPORTANT: LinkedIn has strict terms of service
📋 This script provides guidance for legal data export
🚫 Web scraping may violate LinkedIn's terms of service
`);

// Method 1: Official LinkedIn Data Export
function officialDataExport() {
  console.log(`
📥 Method 1: Official LinkedIn Data Export
==========================================

1. Go to LinkedIn.com and sign in
2. Click on your profile picture → Settings & Privacy
3. Click "Data privacy" in the left sidebar
4. Click "Get a copy of your data"
5. Select "Posts" and any other data you want
6. Click "Request archive"
7. LinkedIn will email you when your data is ready
8. Download and extract the ZIP file

This method is:
✅ Legal and compliant
✅ Complete data export
✅ No risk of account suspension
✅ Official LinkedIn feature
`);
}

// Method 2: LinkedIn API (Professional Use)
function linkedinAPI() {
  console.log(`
🔌 Method 2: LinkedIn Official API
==================================

1. Go to https://developer.linkedin.com/
2. Create a developer account
3. Submit application for API access
4. Wait for approval (can take weeks/months)
5. Use approved API endpoints to fetch data

Requirements:
✅ LinkedIn Developer Account
✅ API Application Approval
✅ Compliance with API terms
✅ Rate limiting compliance

This method is:
✅ Official and supported
✅ Professional use approved
✅ Complete data access
✅ Long-term solution
`);
}

// Method 3: Manual Export (Limited)
function manualExport() {
  console.log(`
✋ Method 3: Manual Export (Limited)
====================================

1. Go to your LinkedIn profile
2. Scroll through your posts manually
3. Copy and paste content to a document
4. Save as text or markdown file

Limitations:
❌ Time-consuming
❌ Limited to visible posts
❌ No metadata (likes, comments, etc.)
❌ Manual process

This method is:
✅ Legal and safe
✅ No technical requirements
✅ Immediate access
✅ Good for small amounts of data
`);
}

// Method 4: Browser Extension (Use with Caution)
function browserExtension() {
  console.log(`
🌐 Method 4: Browser Extension (Use with Caution)
=================================================

⚠️  WARNING: Use at your own risk
🚫 May violate LinkedIn's terms of service
🚫 Could result in account suspension

If you choose this approach:
1. Research the extension thoroughly
2. Use a test account first
3. Be aware of risks
4. Consider legal implications

Popular extensions:
- LinkedIn Scraper
- Data Miner
- Web Scraper

⚠️  RISKS:
- Account suspension
- IP blocking
- Legal issues
- Terms of service violation
`);
}

// Method 5: Professional Services
function professionalServices() {
  console.log(`
💼 Method 5: Professional Services
==================================

For business/commercial use:
1. Contact LinkedIn Business Solutions
2. Use LinkedIn Sales Navigator
3. Hire a professional data analyst
4. Use approved LinkedIn partners

This approach is:
✅ Business-approved
✅ Compliant with terms
✅ Professional support
✅ Long-term solution
`);
}

// Generate export script template
function generateExportScript() {
  const scriptContent = `#!/usr/bin/env node

/**
 * LinkedIn Data Export Script Template
 * 
 * This is a template for creating your own export script
 * Modify according to your needs and compliance requirements
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  outputDir: './linkedin-export',
  maxPosts: 100,
  delay: 2000, // 2 seconds between requests
  userAgent: 'Mozilla/5.0 (compatible; LinkedInExport/1.0)'
};

// Create output directory
function createOutputDir() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
}

// Export posts data structure
function exportPosts() {
  console.log('📝 Exporting LinkedIn Posts...');
  
  // This is where you would implement the actual export logic
  // Consider using LinkedIn's official methods instead of scraping
  
  const sampleData = {
    profile: 'https://www.linkedin.com/in/chan-dinh/',
    exportDate: new Date().toISOString(),
    method: 'Official LinkedIn Data Export (Recommended)',
    posts: []
  };
  
  // Save to file
  const filename = \`linkedin-export-\${new Date().toISOString().split('T')[0]}.json\`;
  const filepath = path.join(CONFIG.outputDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(sampleData, null, 2));
  console.log(\`✅ Export saved to: \${filepath}\`);
}

// Main execution
function main() {
  console.log('🚀 LinkedIn Data Export Script');
  console.log('================================');
  
  createOutputDir();
  exportPosts();
  
  console.log('\\n📋 Next Steps:');
  console.log('1. Use LinkedIn\'s official data export feature');
  console.log('2. Wait for email notification');
  console.log('3. Download and extract your data');
  console.log('4. Process the exported data as needed');
}

if (require.main === module) {
  main();
}

module.exports = { exportPosts, createOutputDir };
`;

  const scriptPath = path.join(process.cwd(), 'linkedin-export-template.js');
  fs.writeFileSync(scriptPath, scriptContent);
  console.log(`\n📁 Export script template created: ${scriptPath}`);
}

// Main menu
function showMainMenu() {
  console.log(`
🎯 Choose an Export Method:
============================

1. Official LinkedIn Data Export (Recommended)
2. LinkedIn Official API
3. Manual Export (Limited)
4. Browser Extension (Use with Caution)
5. Professional Services
6. Generate Export Script Template
7. Exit

Enter your choice (1-7): `);
}

// Interactive menu
function runInteractiveMenu() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  };

  const runMenu = async () => {
    showMainMenu();
    const choice = await askQuestion('');

    switch (choice.trim()) {
      case '1':
        officialDataExport();
        break;
      case '2':
        linkedinAPI();
        break;
      case '3':
        manualExport();
        break;
      case '4':
        browserExtension();
        break;
      case '5':
        professionalServices();
        break;
      case '6':
        generateExportScript();
        break;
      case '7':
        console.log('👋 Goodbye!');
        rl.close();
        return;
      default:
        console.log('❌ Invalid choice. Please try again.');
    }

    console.log('\n' + '='.repeat(50) + '\n');
    await runMenu();
  };

  runMenu();
}

// Check if running interactively
if (process.stdin.isTTY) {
  runInteractiveMenu();
} else {
  // Non-interactive mode - show all methods
  officialDataExport();
  linkedinAPI();
  manualExport();
  browserExtension();
  professionalServices();
  generateExportScript();
  
  console.log(`
📋 Summary of Legal Export Methods:
===================================

✅ RECOMMENDED: Official LinkedIn Data Export
✅ PROFESSIONAL: LinkedIn Official API
✅ SAFE: Manual Export
⚠️  RISKY: Browser Extensions
✅ BUSINESS: Professional Services

🔗 Your Profile: https://www.linkedin.com/in/chan-dinh/
📧 Use LinkedIn's official export feature for best results
`);
}

