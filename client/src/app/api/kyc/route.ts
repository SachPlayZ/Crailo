import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { z } from 'zod';

const kycSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar number must be 12 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = kycSchema.parse(body);

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if KYC is already submitted and approved
    if (user.kycData && user.kycData.status === 'approved') {
      return NextResponse.json({ error: 'KYC already approved' }, { status: 400 });
    }

    // Auto-approve KYC - Update user with KYC data and mark as approved
    user.kycData = {
      ...validatedData,
      submittedAt: new Date(),
      verifiedAt: new Date(), // Auto-approve immediately
      status: 'approved' as const,
    };
    user.isKycVerified = true; // Mark user as KYC verified

    await user.save();

    return NextResponse.json({ 
      message: 'KYC approved successfully',
      status: 'approved',
      isKycVerified: true
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    
    console.error('KYC submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      isKycVerified: user.isKycVerified,
      kycData: user.kycData,
      kycStatus: user.kycData?.status || 'not_submitted'
    });

  } catch (error) {
    console.error('KYC fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 