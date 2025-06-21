# Crailo Authentication & KYC Setup Guide

## Prerequisites

1. Node.js 18+ installed
2. MongoDB instance (local or Atlas)
3. Google OAuth credentials

## Environment Variables

Create a `.env.local` file in the `client` directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# MongoDB
MONGODB_URI=mongodb://localhost:27017/crailo
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crailo?retryWrites=true&w=majority
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

## MongoDB Setup

### Local MongoDB

1. Install MongoDB locally
2. Start the MongoDB service
3. Create a database named `crailo`

### MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string and add it to `.env.local`

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

## Features Implemented

### Authentication

- Google OAuth integration with NextAuth.js
- Session management
- Protected routes with AuthGuard
- User profile management

### KYC System (Auto-Approval)

- Streamlined KYC form for Indian users
- **Required fields**: Full Name, Address, Phone Number, Aadhar Number, Date of Birth
- **On-chain focused**: No traditional banking information required
- **Auto-approval system** - KYC is approved immediately upon submission
- Form validation with Zod
- Success page with automatic redirect

### Route Protection

- `/listings` - Requires authentication and KYC approval
- `/validator/dashboard` - Requires authentication and KYC approval
- `/kyc` - KYC form for new users (auto-approval)
- `/auth/signin` - Google sign-in page

### User Experience

- Responsive design with Tailwind CSS
- Loading states and error handling
- User-friendly navigation
- Dark mode support
- Immediate access after KYC submission

## API Endpoints

- `POST /api/kyc` - Submit KYC application (auto-approves)
- `GET /api/kyc` - Get KYC status
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints
- `GET/PATCH /api/admin/kyc` - Admin KYC management (for future use)

## Database Schema

### User Model

```typescript
{
  email: string;
  name: string;
  image?: string;
  googleId?: string;
  isKycVerified: boolean;
  kycData?: {
    fullName: string;
    address: string;
    phoneNumber: string;
    aadharNumber: string;
    dateOfBirth: string;
    submittedAt: Date;
    verifiedAt: Date;
    status: 'approved';
  };
  role: 'user' | 'validator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

## Security Features

- JWT-based session management
- Input validation with Zod
- Secure password handling
- CORS protection
- Environment variable protection

## User Flow (Auto-Approval)

1. User visits the site → Sees public homepage
2. User clicks "Sign In" → Redirected to Google OAuth
3. After Google login → Redirected to KYC form (if first time)
4. User fills KYC form → **Automatically approved and redirected to homepage**
5. User can immediately access Listings and Validator Dashboard

## On-Chain Benefits

- **Simplified KYC**: Only essential identity verification required
- **No banking info**: Traditional banking details not needed for on-chain operations
- **Faster onboarding**: Streamlined form with fewer fields
- **Privacy focused**: Minimal personal data collection
- **Web3 ready**: Optimized for blockchain-based applications

## Next Steps

1. Set up email notifications for KYC completion
2. Implement admin panel for KYC management (if needed)
3. Add document upload functionality
4. Implement two-factor authentication
5. Add audit logging
6. Set up automated KYC verification (if manual review is needed later)
