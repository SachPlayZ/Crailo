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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkKycStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/kyc");
          if (response.ok) {
            const data = await response.json();
            setKycStatus(data.kycStatus);
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
      if (kycStatus === "not_submitted") {
        router.push("/kyc");
        return;
      }

      if (kycStatus === "rejected") {
        router.push("/kyc");
        return;
      }

      if (kycStatus !== "approved" && !session.user?.isKycVerified) {
        router.push("/kyc");
        return;
      }
    }
  }, [kycStatus, loading, session, router, requireKyc]);

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

  if (requireKyc && kycStatus !== "approved" && !session?.user?.isKycVerified) {
    return null;
  }

  return <>{children}</>;
}
