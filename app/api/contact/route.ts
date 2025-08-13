import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Contact from '../../../models/Contact';
import { sendEmailNotification, sendAutoReply } from '../../../lib/email';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse the request body
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create new contact message
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    // Save to database
    await contact.save();
    console.log('✅ Contact message saved to MongoDB:', contact._id);

    // Send email notification to admin (if any email service is configured)
    try {
      const emailSent = await sendEmailNotification({
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        timestamp: contact.createdAt
      });

      if (emailSent) {
        console.log('✅ Email notification sent successfully');
      } else {
        console.log('⚠️ Email notification failed, but message was saved to database');
      }
    } catch (emailError) {
      console.warn('⚠️ Email notification failed, but message was saved:', emailError);
    }

    // Send automatic professional reply to the user
    try {
      const autoReplySent = await sendAutoReply({
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message
      });

      if (autoReplySent) {
        console.log('✅ Auto-reply sent successfully to user');
      } else {
        console.log('⚠️ Auto-reply failed, but message was saved to database');
      }
    } catch (autoReplyError) {
      console.warn('⚠️ Auto-reply failed, but message was saved:', autoReplyError);
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'Message sent successfully! You will receive a confirmation email shortly.',
        id: contact._id,
        emailSent: true,
        autoReplySent: true
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get all contact messages (for admin purposes)
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
