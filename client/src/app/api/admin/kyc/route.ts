import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all KYC applications
    const kycApplications = await User.find({
      'kycData.status': { $in: ['pending', 'approved', 'rejected'] }
    }).select('email name kycData createdAt');

    return NextResponse.json({ applications: kycApplications });

  } catch (error) {
    console.error('Admin KYC fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    await dbConnect();
    const adminUser = await User.findOne({ email: session.user.email });
    
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, status, reason } = body;

    if (!userId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update KYC status
    user.kycData.status = status;
    user.kycData.verifiedAt = new Date();
    user.isKycVerified = status === 'approved';

    await user.save();

    return NextResponse.json({ 
      message: `KYC ${status} successfully`,
      user: {
        email: user.email,
        name: user.name,
        kycStatus: user.kycData.status,
        isKycVerified: user.isKycVerified
      }
    });

  } catch (error) {
    console.error('Admin KYC update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 