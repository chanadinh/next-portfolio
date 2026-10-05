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
  url: 'https://chandinh.dev/favicon-128x128.png?v=cd1',
  alt: 'Chan Dinh / CD monogram',
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

// User-supplied content remains text inside the branded email templates.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));
}

function emailFrame(label: string, title: string, content: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#101214;color:#101214;font-family:Arial,Helvetica,sans-serif;line-height:1.7">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#101214"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:collapse">
<tr><td style="padding:24px 28px;background:#101214;border-bottom:3px solid #ff6248"><a href="https://chandinh.dev" style="color:#eeeae2;text-decoration:none"><img src="${escapeHtml(LOGO_CONFIG.url)}" alt="${escapeHtml(LOGO_CONFIG.alt)}" width="48" height="48" style="display:block;border:0"></a><p style="font-family:monospace;font-size:11px;letter-spacing:1px;color:#a3a6a9;margin:20px 0 0">${escapeHtml(label)}</p></td></tr>
<tr><td style="padding:32px 28px;background:#eeeae2"><h1 style="font-size:30px;line-height:1.25;letter-spacing:-1px;font-weight:600;margin:0 0 24px">${escapeHtml(title)}</h1>${content}</td></tr>
<tr><td style="padding:24px 28px;color:#a3a6a9;font-family:monospace;font-size:11px"><a href="https://chandinh.dev" style="color:#eeeae2;text-decoration:underline">chandinh.dev</a><br>AI / SOFTWARE / CYBERSECURITY</td></tr>
</table></td></tr></table></body></html>`;
}

export function generateEmailContent(contactData: ContactData) {
  const { name, email, subject, message, timestamp } = contactData;
  const textContent = `New portfolio message

Name: ${name}
Email: ${email}
Subject: ${subject}

${message}

Received: ${timestamp.toISOString()}`;
  const htmlContent = emailFrame('PORTFOLIO STUDIO / NEW MESSAGE', 'A new conversation.', `
    <p style="font-size:14px;margin:0 0 8px"><strong>From</strong><br>${escapeHtml(name)} / ${escapeHtml(email)}</p>
    <p style="font-size:14px;margin:0 0 24px"><strong>Subject</strong><br>${escapeHtml(subject)}</p>
    <div style="border-top:1px solid #c9c5be;border-bottom:1px solid #c9c5be;padding:24px 0;font-size:16px;overflow-wrap:anywhere">${escapeHtml(message).replace(/\r?\n/g, '<br>')}</div>
    <p style="font-family:monospace;font-size:11px;color:#626663;margin-top:24px">Received ${escapeHtml(timestamp.toISOString())}</p>`);
  return { textContent, htmlContent };
}

export function generateAutoReplyContent(userData: AutoReplyData) {
  const textContent = `Hi ${userData.name},

Thanks for reaching out about "${userData.subject}". Your message is in my inbox. I’ll read it and get back to you as soon as I can.

Chan Dinh
AI, software & cybersecurity
https://chandinh.dev
LinkedIn: https://chandinh.dev/linkedin
GitHub: https://github.com/chanadinh
Email: chandinh.jobs@gmail.com

This is an automated confirmation. To follow up, email chandinh.jobs@gmail.com.`;
  const htmlContent = emailFrame('THE NEXT CHAPTER / MESSAGE RECEIVED', 'Good to hear from you.', `
    <p style="margin:0 0 18px">Hi ${escapeHtml(userData.name)},</p>
    <p style="margin:0 0 24px">Thanks for reaching out about <strong>${escapeHtml(userData.subject)}</strong>. Your message is in my inbox. I’ll read it and get back to you as soon as I can.</p>
    <p style="margin:0 0 28px">Chan Dinh<br><span style="color:#626663;font-size:13px">AI, software &amp; cybersecurity</span></p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#ff6248" style="padding:12px 20px"><a href="https://chandinh.dev" style="color:#101214;font-size:13px;font-weight:600;text-decoration:none">Back to the story ↗</a></td></tr></table>
    <p style="font-size:12px;margin:24px 0"><a href="https://chandinh.dev/linkedin" style="color:#101214">LinkedIn ↗</a> &nbsp; / &nbsp; <a href="https://github.com/chanadinh" style="color:#101214">GitHub ↗</a></p>
    <p style="border-top:1px solid #c9c5be;padding-top:20px;color:#626663;font-size:11px;margin:0">This is an automated confirmation. To follow up, email <a href="mailto:chandinh.jobs@gmail.com" style="color:#101214">chandinh.jobs@gmail.com</a>.</p>`);
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
