import React from "react";
import {
  Shield,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Package,
  CreditCard,
} from "lucide-react";

const PlatformOverview = () => {
  return (
    <div className="relative w-full max-w-lg ms-auto">
      {/* Main container */}
      <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-green-500/10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
            <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            How Crailo Works
          </h3>
          <p className="text-sm text-muted-foreground">
            Three simple steps to safe trading
          </p>
        </div>

        {/* Three platform sections */}
        <div className="space-y-6">
          {/* Section 1: List & Discover */}
          <div className="group relative">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  List & Discover
                </h4>
                <p className="text-sm text-muted-foreground">
                  Browse verified listings or create your own
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Section 2: Secure Escrow */}
          <div className="group relative">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  Secure Escrow
                </h4>
                <p className="text-sm text-muted-foreground">
                  Funds locked safely until delivery confirmed
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Section 3: Verified Delivery */}
          <div className="group relative">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  Verified Delivery
                </h4>
                <p className="text-sm text-muted-foreground">
                  Automatic release when item received
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-10 pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                99.9%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Success Rate
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                10K+
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Happy Users
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                $2M+
              </div>
              <div className="text-xs text-muted-foreground mt-1">Traded</div>
            </div>
          </div>
        </div>

        {/* Floating security badge */}
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg animate-float">
          100% Secure
        </div>
      </div>

      {/* Background glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-200/20 to-emerald-200/20 dark:from-green-800/20 dark:to-emerald-800/20 rounded-3xl blur-xl transform scale-110"></div>
    </div>
  );
};

export default PlatformOverview;
