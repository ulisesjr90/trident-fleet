import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeAdminApp } from '@/lib/firebase-admin-config';

// Ensure admin app is initialized
initializeAdminApp();

export async function POST(request: Request) {
  try {
    const { uid, role } = await request.json();
    
    console.log('SET_ROLE_REQUEST', { 
      uid, 
      role, 
      timestamp: new Date().toISOString() 
    });

    if (!uid || !role) {
      return NextResponse.json(
        { error: 'Missing uid or role', success: false },
        { status: 400 }
      );
    }

    const adminAuth = getAuth();
    
    try {
      await adminAuth.setCustomUserClaims(uid, { role });
      
      console.log('CUSTOM_CLAIMS_SET', { 
        uid, 
        role, 
        timestamp: new Date().toISOString() 
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Role set successfully' 
      });
    } catch (claimError) {
      console.error('CUSTOM_CLAIMS_ERROR', { 
        uid, 
        role, 
        error: String(claimError),
        timestamp: new Date().toISOString() 
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to set user role', 
          details: String(claimError),
          success: false 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('UNEXPECTED_SET_ROLE_ERROR', { 
      error: String(error),
      timestamp: new Date().toISOString() 
    });

    return NextResponse.json(
      { 
        error: 'Unexpected server error', 
        details: String(error),
        success: false 
      },
      { status: 500 }
    );
  }
} 