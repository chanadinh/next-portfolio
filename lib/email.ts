import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';

// Email configuration
export const EMAIL_CONFIG = {
  to: process.env.CONTACT_EMAIL || 'contact@yourdomain.com',
  from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
  subject: 'New Contact Form Submission - Portfolio',
};

// Contact form data interface
export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
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
