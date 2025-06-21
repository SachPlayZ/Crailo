import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Zap } from "lucide-react";
import PlatformOverview from "./PlatformOverview";
import Link from "next/link";

interface HeroSectionProps {
  heroInView: boolean;
}

const HeroSection = ({ heroInView }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-50 via-background to-emerald-50 dark:from-green-950 dark:via-background dark:to-emerald-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 dark:bg-green-800/30 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-800/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-10">
            {/* Brand badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800 animate-scale-in">
              <Zap className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Blockchain-Powered Security
              </span>
            </div>

            {/* Main headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-slide-up">
                <span
                  className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 bg-clip-text text-transparent animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  Crailo
                </span>
                <span
                  className="block text-foreground mt-4 animate-slide-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  Safe Trading, Guaranteed
                </span>
              </h1>

              <p
                className="text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                Buy and sell with confidence. Escrow protection keeps you safe.
              </p>
            </div>

            {/* Feature highlights */}
            <div
              className="grid sm:grid-cols-3 gap-6 animate-slide-up"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-card border border-border/50 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Secure Escrow</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Money stays safe
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-lg bg-card border border-border/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Verified Users</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Trusted community
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-lg bg-card border border-border/50 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                  <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Smart Contracts</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-protection
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in"
              style={{ animationDelay: "1s" }}
            >
              <Link href="/listings">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 text-white border-0"
                >
                  Start Trading
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/50 transition-all duration-300"
              >
                List Item
              </Button>
            </div>
          </div>

          {/* Right side - Platform Overview */}
          <div className="flex justify-center animate-slide-in-right">
            <PlatformOverview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
