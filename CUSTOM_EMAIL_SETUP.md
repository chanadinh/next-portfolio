# 📧 Custom Email Domain Setup Guide

This guide will help you set up your portfolio to send emails from your custom domain email address.

## 🎯 **What This Enables:**

- **Professional Contact Form**: Receive contact form submissions at `contact@yourdomain.com`
- **Branded Emails**: Send emails from `noreply@yourdomain.com` or similar
- **Instant Notifications**: Get notified immediately when someone contacts you
- **Professional Appearance**: Clients see your custom domain, not generic email services

## 🚀 **Quick Setup Options:**

### **Option 1: Resend (Recommended - Free Tier)**
- **Free**: 3,000 emails/month
- **Easy Setup**: Simple API integration
- **Custom Domain**: Full support for custom domains
- **Reliable**: Enterprise-grade infrastructure

### **Option 2: SendGrid**
- **Free**: 100 emails/day
- **Popular**: Widely used service
- **Good Documentation**: Extensive guides available

### **Option 3: Mailgun**
- **Free**: 5,000 emails/month for 3 months
- **Developer Friendly**: Good API design
- **Custom Domain**: Full support

## 🔧 **Setup Instructions:**

### **Step 1: Choose Your Email Service**

#### **Resend (Recommended)**
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address
4. Get your API key from the dashboard

#### **SendGrid**
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for a free account
3. Verify your email address
4. Create an API key in Settings > API Keys

#### **Mailgun**
1. Go to [mailgun.com](https://mailgun.com)
2. Sign up for a free account
3. Verify your email address
4. Get your API key from the dashboard

### **Step 2: Configure Environment Variables**

Add these to your `.env.local` file:

```bash
# Email Service Configuration
EMAIL_SERVICE=resend  # or 'sendgrid' or 'mailgun'

# Your Custom Domain Email Addresses
CONTACT_EMAIL=contact@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com

# Email Service API Keys (choose one based on your service)
RESEND_API_KEY=your_resend_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=yourdomain.com
```

### **Step 3: Custom Domain Email Setup**

#### **For Resend:**
1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend to your domain provider
5. Wait for DNS verification (usually 5-10 minutes)

#### **For SendGrid:**
1. In SendGrid dashboard, go to "Settings" > "Sender Authentication"
2. Click "Authenticate Your Domain"
3. Follow the DNS setup instructions
4. Wait for verification

#### **For Mailgun:**
1. In Mailgun dashboard, go to "Sending" > "Domains"
2. Click "Add New Domain"
3. Follow the DNS setup instructions
4. Wait for verification

### **Step 4: Test Your Setup**

1. Start your development server: `npm run dev`
2. Go to your contact form
3. Submit a test message
4. Check your custom domain email for the notification
5. Check the console for success/error messages

## 📧 **Email Templates:**

The system automatically creates professional email templates:

```
Subject: New Contact Form Submission - Portfolio: [User's Subject]

New Contact Form Submission

Name: [User's Name]
Email: [User's Email]
Subject: [User's Subject]
Message: [User's Message]
Timestamp: [Submission Time]

---
Sent from your portfolio contact form
```

## 🔒 **Security Features:**

- **Input Validation**: All form inputs are validated
- **Rate Limiting**: Built-in protection against spam
- **Error Handling**: Graceful fallback if email fails
- **Logging**: Detailed logs for debugging

## 🎨 **Customization Options:**

### **Change Email Content:**
Edit the `EMAIL_CONFIG` in `app/api/contact/route.ts`:

```typescript
const EMAIL_CONFIG = {
  to: 'your-email@yourdomain.com',
  from: 'noreply@yourdomain.com',
  subject: 'New Message from Portfolio',
};
```

### **Custom Email Templates:**
Modify the email body in the `sendEmailNotification` function:

```typescript
const emailBody = `
Custom Email Template

Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}
Message: ${contactData.message}

Your custom content here...
`;
```

## 🚨 **Troubleshooting:**

### **Common Issues:**

#### **"Email service not configured"**
- Check that `EMAIL_SERVICE` is set in `.env.local`
- Verify your API key is correct
- Ensure the service is properly configured

#### **"DNS verification failed"**
- Wait 10-15 minutes for DNS propagation
- Double-check DNS records match exactly
- Contact your domain provider if issues persist

#### **"API key invalid"**
- Regenerate your API key
- Check for extra spaces or characters
- Verify the key has proper permissions

#### **"Rate limit exceeded"**
- Check your email service limits
- Consider upgrading your plan
- Implement rate limiting in your app

### **Debug Commands:**
```bash
# Check environment variables
echo $CONTACT_EMAIL
echo $RESEND_API_KEY

# Test API endpoint
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
```

## 📱 **Production Deployment:**

### **Vercel:**
1. Add environment variables in Vercel dashboard
2. Deploy your application
3. Test contact form in production

### **Other Platforms:**
1. Add environment variables to your hosting platform
2. Ensure email service allows your domain
3. Test thoroughly before going live

## 💰 **Cost Considerations:**

### **Resend:**
- **Free**: 3,000 emails/month
- **Paid**: $20/month for 50,000 emails
- **Custom Domain**: Free

### **SendGrid:**
- **Free**: 100 emails/day
- **Paid**: $14/month for 50,000 emails
- **Custom Domain**: Free

### **Mailgun:**
- **Free**: 5,000 emails/month for 3 months
- **Paid**: $35/month for 50,000 emails
- **Custom Domain**: Free

## 🔄 **Future Enhancements:**

- **Email Templates**: HTML email templates with your branding
- **Auto-Reply**: Automatic responses to contact form submissions
- **Email Analytics**: Track email delivery and engagement
- **Spam Protection**: Advanced spam filtering
- **Email Scheduling**: Send emails at specific times

## 📞 **Support:**

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review console logs** for error messages
3. **Verify environment variables** are set correctly
4. **Test with a simple email** first
5. **Check your email service dashboard** for status

## ✅ **Success Checklist:**

- [ ] Email service account created
- [ ] API key obtained and configured
- [ ] Custom domain verified
- [ ] Environment variables set
- [ ] Contact form tested successfully
- [ ] Email received at custom domain
- [ ] Production deployment tested

---

**Congratulations!** 🎉 You now have a professional contact form that sends emails to your custom domain email address, making your portfolio look more professional and ensuring you never miss important messages from potential clients or collaborators.
