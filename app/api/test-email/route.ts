import { requireAdmin } from '../../../lib/admin-auth';
import { NextRequest, NextResponse } from 'next/server';
import { testEmailServices, getEmailServiceConfig } from '../../../lib/email';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    console.log('🧪 Testing email services...');
    
    // Get service configuration
    const config = getEmailServiceConfig();
    
    // Test all configured services
    const results = await testEmailServices();
    
    const response = {
      message: 'Email service test completed',
      timestamp: new Date().toISOString(),
      configuration: {
        resend: {
          enabled: config.resend.enabled,
          hasApiKey: !!config.resend.apiKey,
        },
        sendgrid: {
          enabled: config.sendgrid.enabled,
          hasApiKey: !!config.sendgrid.apiKey,
        },
        mailgun: {
          enabled: config.mailgun.enabled,
          hasApiKey: !!config.mailgun.apiKey,
          hasDomain: !!config.mailgun.domain,
        },
      },
      testResults: results,
      summary: {
        totalServices: Object.values(config).filter(service => service.enabled).length,
        successfulTests: Object.values(results).filter(result => result === true).length,
        overallSuccess: results.overall,
      },
    };

    console.log('📊 Email service test results:', response);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Email service test error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to test email services',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    // Parse the request body
    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { error: 'testEmail field is required' },
        { status: 400 }
      );
    }

    // Test with custom email
    const { testEmailServices } = await import('../../../lib/email');
    
    const testData = {
      name: 'Test User',
      email: testEmail,
      subject: 'Test Email from Portfolio',
      message: 'This is a test email to verify your email service configuration.',
      timestamp: new Date(),
    };

    console.log('🧪 Testing email services with custom email:', testEmail);
    
    // Test all configured services
    const results = await testEmailServices();
    
    const response = {
      message: 'Custom email test completed',
      testEmail,
      timestamp: new Date().toISOString(),
      results,
    };

    console.log('📊 Custom email test results:', response);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Custom email test error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to test custom email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
