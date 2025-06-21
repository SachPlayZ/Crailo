"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireKyc?: boolean;
}

export default function AuthGuard({
  children,
  requireKyc = true,
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkKycStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/kyc");
          if (response.ok) {
            const data = await response.json();
            setKycStatus(data.kycStatus);
            setIsKycVerified(data.isKycVerified);
          }
        } catch (error) {
          console.error("Error checking KYC status:", error);
        }
      }
      setLoading(false);
    };

    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session && requireKyc) {
      checkKycStatus();
    } else {
      setLoading(false);
    }
  }, [session, status, router, requireKyc]);

  useEffect(() => {
    if (!loading && session && requireKyc) {
      if (isKycVerified || kycStatus === "approved") {
        if (window.location.pathname === "/kyc") {
          router.push("/");
          return;
        }
      }

      if (kycStatus === "not_submitted" || kycStatus === "rejected") {
        if (window.location.pathname !== "/kyc") {
          router.push("/kyc");
          return;
        }
      }

      if (kycStatus === "pending") {
        if (window.location.pathname !== "/kyc/pending") {
          router.push("/kyc/pending");
          return;
        }
      }
    }
  }, [kycStatus, isKycVerified, loading, session, router, requireKyc]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (requireKyc && !isKycVerified && kycStatus !== "approved") {
    return null;
  }

  return <>{children}</>;
}
