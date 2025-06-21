"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  User,
  LogOut,
  Shield,
  CheckCircle,
  Clock,
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [isKycVerified, setIsKycVerified] = useState(false);

  // Fetch KYC status when session changes
  useEffect(() => {
    const fetchKycStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/kyc");
          if (response.ok) {
            const data = await response.json();
            setKycStatus(data.kycStatus);
            setIsKycVerified(data.isKycVerified);
          }
        } catch (error) {
          console.error("Error fetching KYC status:", error);
        }
      }
    };

    if (session) {
      fetchKycStatus();
    }
  }, [session]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const getKycStatusIcon = () => {
    if (isKycVerified || kycStatus === "approved") {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (kycStatus === "pending") {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    }
    return <Shield className="h-4 w-4 text-gray-600" />;
  };

  const getKycStatusText = () => {
    if (isKycVerified || kycStatus === "approved") {
      return "KYC Verified";
    }
    if (kycStatus === "pending") {
      return "KYC Pending";
    }
    if (kycStatus === "rejected") {
      return "KYC Rejected";
    }
    return "KYC Required";
  };

  const getKycStatusColor = () => {
    if (isKycVerified || kycStatus === "approved") {
      return "text-green-600";
    }
    if (kycStatus === "pending") {
      return "text-yellow-600";
    }
    if (kycStatus === "rejected") {
      return "text-red-600";
    }
    return "text-gray-600";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 group">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold">Crailo</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {!session ? (
            <>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium hover:text-green-600 transition-colors relative group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("why-crailo")}
                className="text-sm font-medium hover:text-green-600 transition-colors relative group"
              >
                Why Crailo
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("validators")}
                className="text-sm font-medium hover:text-green-600 transition-colors relative group"
              >
                Validators
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("community")}
                className="text-sm font-medium hover:text-green-600 transition-colors relative group"
              >
                Community
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/listings"
                className="text-sm font-medium hover:text-green-600 transition-colors relative group"
              >
                Listings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/validator/dashboard"
                className="text-sm font-medium hover:text-green-600 transition-colors relative group"
              >
                Validator Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-9 w-9 hover:scale-110 transition-transform"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {status === "loading" ? (
            <div className="h-9 w-9 animate-pulse bg-gray-200 rounded-full" />
          ) : session ? (
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={session.user?.image || ""}
                      alt={session.user?.name || ""}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getKycStatusIcon()}
                      <span
                        className={`text-xs font-medium ${getKycStatusColor()}`}
                      >
                        {getKycStatusText()}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isKycVerified && kycStatus !== "approved" && (
                  <DropdownMenuItem asChild>
                    <Link href="/kyc" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Complete KYC</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {isKycVerified && (
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="hidden sm:inline-flex hover:scale-105 transition-transform"
              >
                Sign In
              </Button>
            </Link>
          )}

          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
