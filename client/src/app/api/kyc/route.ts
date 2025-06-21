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

const updateSchema = z.object({
  field: z.enum(['fullName', 'address', 'phoneNumber', 'aadharNumber', 'dateOfBirth']),
  value: z.string().min(1, 'Value cannot be empty'),
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

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { field, value } = updateSchema.parse(body);

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.kycData) {
      return NextResponse.json({ error: 'KYC data not found' }, { status: 404 });
    }

    // Validate the specific field being updated
    let validationError = null;
    
    switch (field) {
      case 'fullName':
        if (value.length < 1) validationError = 'Full name is required';
        break;
      case 'address':
        if (value.length < 10) validationError = 'Address must be at least 10 characters';
        break;
      case 'phoneNumber':
        if (!/^[6-9]\d{9}$/.test(value)) validationError = 'Invalid Indian phone number';
        break;
      case 'aadharNumber':
        if (!/^\d{12}$/.test(value)) validationError = 'Aadhar number must be 12 digits';
        break;
      case 'dateOfBirth':
        if (!value) validationError = 'Date of birth is required';
        break;
    }

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Update the specific field
    user.kycData[field] = value;
    user.kycData.verifiedAt = new Date(); // Update verification timestamp

    await user.save();

    return NextResponse.json({ 
      message: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} updated successfully`,
      updatedField: field,
      value: value
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    
    console.error('KYC update error:', error);
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