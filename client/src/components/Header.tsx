"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
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
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [isKycVerified, setIsKycVerified] = useState(false);
  const pathname = usePathname();

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
      <div className="max-w-7xl mx-auto grid grid-cols-12 h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Logo - Column 1 */}
        <div className="col-start-1 col-span-2">
          <Link href="/" className="flex items-center group">
            <div className="h-16 w-24 transition-transform group-hover:scale-110 relative">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-xl transition-all duration-300"></div>
              <Image
                src="/logo.png"
                alt="Crailo"
                width={64}
                height={64}
                className="h-full w-full object-contain relative z-10 drop-shadow-lg"
              />
            </div>
          </Link>
        </div>

        {/* Centered Navigation - Columns 3-10 */}
        <nav className="col-start-3 col-span-8 hidden md:flex items-center justify-center space-x-8">
          {!session ? (
            <>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className={cn(
                  "text-sm font-medium hover:text-green-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20",
                  pathname === "/" &&
                    "text-green-600 bg-green-50 dark:bg-green-900/20"
                )}
              >
                How It Works
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full",
                    pathname === "/" && "w-full"
                  )}
                ></span>
              </button>
              <button
                onClick={() => scrollToSection("why-crailo")}
                className={cn(
                  "text-sm font-medium hover:text-green-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20",
                  pathname === "/" &&
                    "text-green-600 bg-green-50 dark:bg-green-900/20"
                )}
              >
                Why Crailo
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full",
                    pathname === "/" && "w-full"
                  )}
                ></span>
              </button>
              <button
                onClick={() => scrollToSection("validators")}
                className={cn(
                  "text-sm font-medium hover:text-green-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20",
                  pathname === "/" &&
                    "text-green-600 bg-green-50 dark:bg-green-900/20"
                )}
              >
                Validators
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full",
                    pathname === "/" && "w-full"
                  )}
                ></span>
              </button>
              <button
                onClick={() => scrollToSection("community")}
                className={cn(
                  "text-sm font-medium hover:text-green-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20",
                  pathname === "/" &&
                    "text-green-600 bg-green-50 dark:bg-green-900/20"
                )}
              >
                Community
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full",
                    pathname === "/" && "w-full"
                  )}
                ></span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/listings"
                className={cn(
                  "text-sm font-medium hover:text-green-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20",
                  pathname === "/listings" &&
                    "text-green-600 bg-green-50 dark:bg-green-900/20"
                )}
              >
                Listings
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full",
                    pathname === "/listings" && "w-full"
                  )}
                ></span>
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm font-medium hover:text-green-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20",
                  pathname === "/dashboard" &&
                    "text-green-600 bg-green-50 dark:bg-green-900/20"
                )}
              >
                Dashboard
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full",
                    pathname === "/dashboard" && "w-full"
                  )}
                ></span>
              </Link>
              <Link
                href="/validator/dashboard"
                className={cn(
                  "text-sm font-medium hover:text-green-600 transition-all duration-300 relative group px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20",
                  pathname.startsWith("/validator") &&
                    "text-green-600 bg-green-50 dark:bg-green-900/20"
                )}
              >
                Validator
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full",
                    pathname.startsWith("/validator") && "w-full"
                  )}
                ></span>
              </Link>
            </>
          )}
        </nav>

        {/* Right side controls - Columns 11-12 */}
        <div className="col-start-11 col-span-2 flex items-center justify-end space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-9 w-9 hover:scale-110 transition-transform hover:bg-green-50 dark:hover:bg-green-900/20"
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
                  className="relative h-9 w-9 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
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
                className="hidden sm:inline-flex hover:scale-105 transition-transform hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700"
              >
                Sign In
              </Button>
            </Link>
          )}

          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </div>
    </header>
  );
}
