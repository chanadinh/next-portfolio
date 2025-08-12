'use client'

import React from 'react';

export default function DebugPage() {
  const checkToken = () => {
    const token = localStorage.getItem('adminToken');
    console.log('Current token:', token);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Token expires:', new Date(payload.exp * 1000));
        console.log('Current time:', new Date());
        console.log('Is expired:', Date.now() >= payload.exp * 1000);
      } catch (e) {
        console.log('Token parsing error:', e);
      }
    }
  };

  const clearToken = () => {
    localStorage.removeItem('adminToken');
    console.log('Token cleared');
  };

  const testRedirect = () => {
    console.log('Testing redirect to /admin');
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
        
        <div className="space-y-4">
          <button
            onClick={checkToken}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded"
          >
            Check Token
          </button>
          
          <button
            onClick={clearToken}
            className="w-full bg-red-500 text-white py-2 px-4 rounded"
          >
            Clear Token
          </button>
          
          <button
            onClick={testRedirect}
            className="w-full bg-green-500 text-white py-2 px-4 rounded"
          >
            Test Redirect to /admin
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">
            Check browser console for debug information
          </p>
        </div>
      </div>
    </div>
  );
}
