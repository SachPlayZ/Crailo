"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CTASectionProps {
  ctaInView: boolean;
}

export default function CTASection({ ctaInView }: CTASectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-600 to-emerald-600 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`flex flex-col items-center justify-center space-y-4 text-center transition-all duration-1000 ${
            ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Ready to Trade Safely?
            </h2>
            <p className="max-w-[600px] text-green-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join the Crailo beta and experience the future of secure
              peer-to-peer trading.
            </p>
          </div>
          <div
            className={`w-full max-w-sm space-y-2 transition-all duration-1000 delay-300 ${
              ctaInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-lg flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 transition-all"
              />
              <Button
                type="submit"
                variant="secondary"
                className="hover:scale-105 transition-all duration-200 relative overflow-hidden group"
              >
                <span className="relative z-10">Join Beta</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white to-green-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </Button>
            </form>
            <p className="text-xs text-green-200">
              Get early access and exclusive rewards. No spam, ever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
