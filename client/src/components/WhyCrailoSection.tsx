"use client";

import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Users } from "lucide-react";

interface WhyCrailoSectionProps {
  whyCrailoInView: boolean;
}

export default function WhyCrailoSection({
  whyCrailoInView,
}: WhyCrailoSectionProps) {
  const benefits = [
    {
      icon: Shield,
      title: "Escrow for Every Deal",
      description:
        "Smart contracts hold funds securely until both parties are satisfied. No more payment worries or delivery fears.",
      color: "green",
      delay: 0,
    },
    {
      icon: Zap,
      title: "Stakes to Prevent Scams",
      description:
        "Sellers put skin in the game with a 10% stake. Scammers lose their deposit, honest sellers get rewarded.",
      color: "emerald",
      delay: 200,
    },
    {
      icon: Users,
      title: "Validator Community Rewards",
      description:
        "Join our validator network, resolve disputes fairly, and earn tokens plus a share of protocol profits.",
      color: "green",
      delay: 400,
    },
  ];

  const colorClasses = {
    green: "bg-green-100 dark:bg-green-900 text-green-600",
    emerald: "bg-emerald-100 dark:bg-emerald-900 text-emerald-600",
  };

  return (
    <section
      id="why-crailo"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col items-center justify-center space-y-6 text-center transition-all duration-1000 ${
            whyCrailoInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Why Choose Crailo?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Built for trust, designed for everyone
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={index}
                className={`flex flex-col items-center space-y-6 text-center group cursor-pointer transition-all duration-500 hover:scale-105 ${
                  whyCrailoInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: whyCrailoInView
                    ? `${benefit.delay}ms`
                    : "0ms",
                }}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 ${
                    colorClasses[benefit.color as keyof typeof colorClasses]
                  }`}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold group-hover:text-green-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
