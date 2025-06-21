import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      isKycVerified: boolean
      role: string
      kycStatus: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    isKycVerified: boolean
    role: string
    kycStatus: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isKycVerified: boolean
    role: string
    kycStatus: string
  }
} 