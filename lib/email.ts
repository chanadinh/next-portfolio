import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';

// Email configuration
export const EMAIL_CONFIG = {
  to: process.env.CONTACT_EMAIL || 'contact@yourdomain.com',
  from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
  subject: 'New Contact Form Submission - Portfolio',
};

// Logo configuration
export const LOGO_CONFIG = {
  url: 'https://pub-82d1a72b4d7f43a5b4a34f4664d53892.r2.dev/assets/logo-1755061334783.png',
  alt: 'Chan Dinh Logo',
};

// Function to update logo URL (useful for future updates)
export function updateLogoUrl(newUrl: string, newAlt?: string) {
  LOGO_CONFIG.url = newUrl;
  if (newAlt) {
    LOGO_CONFIG.alt = newAlt;
  }
  console.log(`✅ Logo URL updated to: ${newUrl}`);
}

// Contact form data interface
export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
}

// Auto-reply data interface
export interface AutoReplyData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Email service types
export type EmailService = 'resend' | 'sendgrid' | 'mailgun';

// Email service configuration
export interface EmailServiceConfig {
  resend: {
    apiKey: string | undefined;
    enabled: boolean;
  };
  sendgrid: {
    apiKey: string | undefined;
    enabled: boolean;
  };
  mailgun: {
    apiKey: string | undefined;
    domain: string | undefined;
    enabled: boolean;
  };
}

// Get email service configuration
export function getEmailServiceConfig(): EmailServiceConfig {
  return {
    resend: {
      apiKey: process.env.RESEND_API_KEY,
      enabled: !!process.env.RESEND_API_KEY,
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      enabled: !!process.env.SENDGRID_API_KEY,
    },
    mailgun: {
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      enabled: !!(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN),
    },
  };
}

// Generate email content
export function generateEmailContent(contactData: ContactData) {
  const textContent = `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}
Message: ${contactData.message}
Timestamp: ${contactData.timestamp.toLocaleString()}

---
Sent from your portfolio contact form
  `.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1e40af; }
        .value { margin-left: 10px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Form Submission</h1>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Name:</span>
                <span class="value">${contactData.name}</span>
            </div>
            <div class="field">
                <span class="label">Email:</span>
                <span class="value">${contactData.email}</span>
            </div>
            <div class="field">
                <span class="label">Subject:</span>
                <span class="value">${contactData.subject}</span>
            </div>
            <div class="field">
                <span class="label">Message:</span>
                <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${contactData.message}</div>
            </div>
            <div class="field">
                <span class="label">Timestamp:</span>
                <span class="value">${contactData.timestamp.toLocaleString()}</span>
            </div>
        </div>
        <div class="footer">
            Sent from your portfolio contact form
        </div>
    </div>
</body>
</html>
  `.trim();

  return { textContent, htmlContent };
}

// Generate auto-reply email content
export function generateAutoReplyContent(userData: AutoReplyData) {
  const textContent = `
Dear ${userData.name},

Thank you for reaching out to me through my portfolio website!

I have received your message regarding "${userData.subject}" and I appreciate you taking the time to contact me.

I will review your message and get back to you as soon as possible, typically within 24-48 hours.

In the meantime, if you have any urgent questions, feel free to reach out through my other channels:
- LinkedIn: https://linkedin.com/in/chandinh
- GitHub: https://github.com/chanadinh
- Email: contact@chandinh.org

Best regards,
Chan Dinh
AI/ML Developer & Software Engineer

---
This is an automated confirmation message. Please do not reply to this email.
  `.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Thank You - Message Received</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #1f2937; 
            margin: 0; 
            padding: 0; 
            background-color: #f9fafb;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
            position: relative;
        }
        .logo-container {
            margin-bottom: 20px;
        }
        .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: white;
            padding: 15px;
            display: inline-block;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header h1 { 
            margin: 0 0 10px 0; 
            font-size: 28px; 
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header p { 
            margin: 0; 
            font-size: 16px; 
            opacity: 0.9;
        }
        .content { 
            padding: 40px 30px; 
            background: white;
        }
        .greeting { 
            font-size: 20px; 
            margin-bottom: 25px; 
            color: #1f2937;
            font-weight: 600;
        }
        .message { 
            background: #f8fafc; 
            padding: 25px; 
            border-radius: 12px; 
            margin: 25px 0; 
            border-left: 5px solid #667eea;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .message strong {
            color: #667eea;
            font-size: 16px;
        }
        .message em {
            font-style: italic;
            color: #4b5563;
        }
        .contact-info { 
            background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%); 
            padding: 25px; 
            border-radius: 12px; 
            margin: 25px 0; 
            border: 1px solid #e0f2fe;
        }
        .contact-info strong {
            color: #0c4a6e;
            font-size: 16px;
        }
        .contact-info a {
            color: #0369a1;
            text-decoration: none;
            font-weight: 500;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
        .social-links { 
            margin: 30px 0; 
            text-align: center;
        }
        .social-links a { 
            display: inline-block; 
            margin: 0 8px; 
            padding: 12px 24px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .social-links a:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .signature {
            margin: 30px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            text-align: center;
        }
        .signature strong {
            color: #667eea;
            font-size: 18px;
        }
        .footer { 
            margin-top: 30px; 
            padding: 20px 30px; 
            background: #f1f5f9; 
            font-size: 12px; 
            color: #64748b; 
            text-align: center; 
            border-top: 1px solid #e2e8f0;
        }
        .response-time {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            color: #92400e;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="${LOGO_CONFIG.url}" alt="${LOGO_CONFIG.alt}" class="logo">
            </div>
            <h1>✨ Message Received!</h1>
            <p>Thank you for reaching out to me</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Dear <strong>${userData.name}</strong>,
            </div>
            
            <p>Thank you for reaching out to me through my portfolio website! I'm excited to hear from you.</p>
            
            <div class="message">
                <strong>Your Message:</strong><br>
                <em>"${userData.subject}"</em>
            </div>
            
            <p>I have received your message and I truly appreciate you taking the time to contact me. Your interest means a lot!</p>
            
            <div class="response-time">
                ⏰ I will review your message and get back to you as soon as possible, typically within <strong>24-48 hours</strong>.
            </div>
            
            <div class="contact-info">
                <strong>🔗 Other Ways to Connect:</strong><br><br>
                • <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/chandinh">linkedin.com/in/chandinh</a><br>
                • <strong>GitHub:</strong> <a href="https://github.com/chanadinh">github.com/chanadinh</a><br>
                • <strong>Email:</strong> <a href="mailto:contact@chandinh.org">contact@chandinh.org</a>
            </div>
            
            <div class="social-links">
                <a href="https://linkedin.com/in/chandinh">Connect on LinkedIn</a>
                <a href="https://github.com/chanadinh">View GitHub</a>
            </div>
            
            <div class="signature">
                <p>Best regards,<br>
                <strong>Chan Dinh</strong><br>
                AI/ML Developer & Software Engineer</p>
            </div>
        </div>
        
        <div class="footer">
            This is an automated confirmation message. Please do not reply to this email.<br>
            Sent from your portfolio contact form at <strong>contact@chandinh.org</strong>
        </div>
    </div>
</body>
</html>
  `.trim();

  return { textContent, htmlContent };
}

// Send email using Resend
export async function sendWithResend(contactData: ContactData): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resend = new Resend(resendApiKey);
    const { textContent, htmlContent } = generateEmailContent(contactData);

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.to,
      subject: `${EMAIL_CONFIG.subject}: ${contactData.subject}`,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    console.log('✅ Email notification sent via Resend:', data?.id);
    return true;
  } catch (error) {
    console.error('❌ Resend email failed:', error);
    return false;
  }
}

// Send email using SendGrid
export async function sendWithSendGrid(contactData: ContactData): Promise<boolean> {
  try {
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      throw new Error('SENDGRID_API_KEY not configured');
    }

    sgMail.setApiKey(sendgridApiKey);
    const { textContent, htmlContent } = generateEmailContent(contactData);

    const msg = {
      to: EMAIL_CONFIG.to,
      from: EMAIL_CONFIG.from,
      subject: `${EMAIL_CONFIG.subject}: ${contactData.subject}`,
      text: textContent,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log('✅ Email notification sent via SendGrid');
    return true;
  } catch (error) {
    console.error('❌ SendGrid email failed:', error);
    return false;
  }
}

// Send email using Mailgun
export async function sendWithMailgun(contactData: ContactData): Promise<boolean> {
  try {
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    
    if (!mailgunApiKey || !mailgunDomain) {
      throw new Error('MAILGUN_API_KEY or MAILGUN_DOMAIN not configured');
    }

    const { textContent, htmlContent } = generateEmailContent(contactData);

    const formData = new FormData();
    formData.append('from', EMAIL_CONFIG.from);
    formData.append('to', EMAIL_CONFIG.to);
    formData.append('subject', `${EMAIL_CONFIG.subject}: ${contactData.subject}`);
    formData.append('text', textContent);
    formData.append('html', htmlContent);

    const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString('base64')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Mailgun API error: ${error.message || response.statusText}`);
    }

    console.log('✅ Email notification sent via Mailgun');
    return true;
  } catch (error) {
    console.error('❌ Mailgun email failed:', error);
    return false;
  }
}

// Send auto-reply to user
export async function sendAutoReply(userData: AutoReplyData): Promise<boolean> {
  const config = getEmailServiceConfig();
  
  // Check if any email service is configured
  if (!config.resend.enabled && !config.sendgrid.enabled && !config.mailgun.enabled) {
    console.log('ℹ️ No email service configured, skipping auto-reply');
    return false;
  }

  console.log('📧 Sending auto-reply to user...');
  
  // Try services in order of preference
  const services: Array<{ name: EmailService; fn: () => Promise<boolean> }> = [
    { name: 'resend', fn: () => sendAutoReplyWithResend(userData) },
    { name: 'sendgrid', fn: () => sendAutoReplyWithSendGrid(userData) },
    { name: 'mailgun', fn: () => sendAutoReplyWithMailgun(userData) },
  ];

  // Try each enabled service
  for (const service of services) {
    if (config[service.name].enabled) {
      console.log(`🔄 Trying ${service.name} for auto-reply...`);
      const success = await service.fn();
      if (success) {
        return true;
      }
      console.log(`⚠️ ${service.name} auto-reply failed, trying next service...`);
    }
  }

  console.error('❌ All auto-reply services failed');
  return false;
}

// Send auto-reply using Resend
async function sendAutoReplyWithResend(userData: AutoReplyData): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resend = new Resend(resendApiKey);
    const { textContent, htmlContent } = generateAutoReplyContent(userData);

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: userData.email,
      subject: `Thank you for your message - ${userData.subject}`,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    console.log('✅ Auto-reply sent via Resend:', data?.id);
    return true;
  } catch (error) {
    console.error('❌ Resend auto-reply failed:', error);
    return false;
  }
}

// Send auto-reply using SendGrid
async function sendAutoReplyWithSendGrid(userData: AutoReplyData): Promise<boolean> {
  try {
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      throw new Error('SENDGRID_API_KEY not configured');
    }

    sgMail.setApiKey(sendgridApiKey);
    const { textContent, htmlContent } = generateAutoReplyContent(userData);

    const msg = {
      to: userData.email,
      from: EMAIL_CONFIG.from,
      subject: `Thank you for your message - ${userData.subject}`,
      text: textContent,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log('✅ Auto-reply sent via SendGrid');
    return true;
  } catch (error) {
    console.error('❌ SendGrid auto-reply failed:', error);
    return false;
  }
}

// Send auto-reply using Mailgun
async function sendAutoReplyWithMailgun(userData: AutoReplyData): Promise<boolean> {
  try {
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    
    if (!mailgunApiKey || !mailgunDomain) {
      throw new Error('MAILGUN_API_KEY or MAILGUN_DOMAIN not configured');
    }

    const { textContent, htmlContent } = generateAutoReplyContent(userData);

    const formData = new FormData();
    formData.append('from', EMAIL_CONFIG.from);
    formData.append('to', userData.email);
    formData.append('subject', `Thank you for your message - ${userData.subject}`);
    formData.append('text', textContent);
    formData.append('html', htmlContent);

    const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString('base64')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Mailgun API error: ${error.message || response.statusText}`);
    }

    console.log('✅ Auto-reply sent via Mailgun');
    return true;
  } catch (error) {
    console.error('❌ Mailgun auto-reply failed:', error);
    return false;
  }
}

// Main email sending function with fallbacks
export async function sendEmailNotification(contactData: ContactData): Promise<boolean> {
  const config = getEmailServiceConfig();
  
  // Check if any email service is configured
  if (!config.resend.enabled && !config.sendgrid.enabled && !config.mailgun.enabled) {
    console.log('ℹ️ No email service configured, skipping email notification');
    return false;
  }

  console.log('📧 Attempting to send email notification...');
  console.log('📋 Available services:', {
    resend: config.resend.enabled ? '✅' : '❌',
    sendgrid: config.sendgrid.enabled ? '✅' : '❌',
    mailgun: config.mailgun.enabled ? '✅' : '❌',
  });

  // Try services in order of preference
  const services: Array<{ name: EmailService; fn: () => Promise<boolean> }> = [
    { name: 'resend', fn: () => sendWithResend(contactData) },
    { name: 'sendgrid', fn: () => sendWithSendGrid(contactData) },
    { name: 'mailgun', fn: () => sendWithMailgun(contactData) },
  ];

  // Try each enabled service
  for (const service of services) {
    if (config[service.name].enabled) {
      console.log(`🔄 Trying ${service.name}...`);
      const success = await service.fn();
      if (success) {
        return true;
      }
      console.log(`⚠️ ${service.name} failed, trying next service...`);
    }
  }

  console.error('❌ All email services failed');
  return false;
}

// Test email service configuration
export async function testEmailServices(): Promise<{
  resend: boolean;
  sendgrid: boolean;
  mailgun: boolean;
  overall: boolean;
}> {
  const config = getEmailServiceConfig();
  const testData: ContactData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Email',
    message: 'This is a test email to verify your email service configuration.',
    timestamp: new Date(),
  };

  const results = {
    resend: false,
    sendgrid: false,
    mailgun: false,
    overall: false,
  };

  if (config.resend.enabled) {
    results.resend = await sendWithResend(testData);
  }

  if (config.sendgrid.enabled) {
    results.sendgrid = await sendWithSendGrid(testData);
  }

  if (config.mailgun.enabled) {
    results.mailgun = await sendWithMailgun(testData);
  }

  results.overall = results.resend || results.sendgrid || results.mailgun;

  return results;
}
