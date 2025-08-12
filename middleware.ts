import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function middleware(request: NextRequest) {
  // Temporarily disable middleware for debugging
  console.log('Middleware called for:', request.nextUrl.pathname);
  
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Admin route detected, allowing access for debugging');
    // Temporarily allow all admin access
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
