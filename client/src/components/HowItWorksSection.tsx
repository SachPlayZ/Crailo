"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, Coins, Users, Award } from "lucide-react";

interface HowItWorksSectionProps {
  howItWorksInView: boolean;
}

export default function HowItWorksSection({
  howItWorksInView,
}: HowItWorksSectionProps) {
  const steps = [
    {
      icon: TrendingUp,
      title: "1. List & Stake",
      description:
        "Seller lists their product and stakes 10% of the value to show commitment and prevent scams.",
      color: "green",
      delay: 0,
    },
    {
      icon: Coins,
      title: "2. Secure Payment",
      description:
        "Buyer pays upfront into a smart contract escrow. Funds are locked until transaction completes.",
      color: "emerald",
      delay: 200,
    },
    {
      icon: Users,
      title: "3. Validator Review",
      description:
        "If disputes arise, community validators review evidence and vote to resolve conflicts fairly.",
      color: "green",
      delay: 400,
    },
    {
      icon: Award,
      title: "4. Happy Ending",
      description:
        "Funds and stakes are released when everyone's satisfied. Validators earn rewards for participation.",
      color: "emerald",
      delay: 600,
    },
  ];

  const colorClasses = {
    green: "bg-green-100 dark:bg-green-900 text-green-600 border-green-600",
    emerald:
      "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 border-emerald-600",
  };

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col items-center justify-center space-y-6 text-center transition-all duration-1000 ${
            howItWorksInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              How Crailo Works
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Four simple steps to secure, trustless transactions
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <Card
                key={index}
                className={`relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-opacity-50 ${
                  howItWorksInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: howItWorksInView ? `${step.delay}ms` : "0ms",
                }}
              >
                <CardHeader className="pb-4 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                      colorClasses[step.color as keyof typeof colorClasses]
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg mb-2">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
                <div
                  className={`absolute top-0 right-0 w-2 h-full transform translate-x-2 group-hover:translate-x-0 transition-transform ${
                    step.color === "green" ? "bg-green-600" : "bg-emerald-600"
                  }`}
                ></div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
