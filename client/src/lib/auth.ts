import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from './db';
import User from './models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await dbConnect();
        
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Create new user
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: profile?.sub,
            isKycVerified: false,
          });
        } else {
          // Update existing user's Google ID if not set
          if (!existingUser.googleId) {
            existingUser.googleId = profile?.sub;
            await existingUser.save();
          }
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        
        if (user) {
          session.user.id = user._id.toString();
          session.user.isKycVerified = user.isKycVerified;
          session.user.role = user.role;
          session.user.kycStatus = user.kycData?.status || 'not_submitted';
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isKycVerified = user.isKycVerified;
        token.role = user.role;
        token.kycStatus = user.kycStatus;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 