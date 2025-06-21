"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, XCircle } from "lucide-react";

function ValidatorAnimation() {
  return (
    <div className="relative w-full max-w-md mx-auto p-4">
      <svg viewBox="0 0 400 250" className="w-full h-auto">
        {/* Title */}
        <text
          x="200"
          y="30"
          textAnchor="middle"
          className="text-sm font-semibold fill-current"
        >
          Live Validator Voting
        </text>

        {/* Validators */}
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              {/* Validator circle */}
              <circle
                cx={60 + i * 70}
                cy="120"
                r="18"
                className="fill-green-600"
              >
                <animate
                  attributeName="fill"
                  values="#16A34A;#10B981;#16A34A"
                  dur="4s"
                  repeatCount="indefinite"
                  begin={`${i * 0.8}s`}
                />
              </circle>

              {/* Validator icon */}
              <circle cx={60 + i * 70} cy="115" r="3" className="fill-white" />
              <circle cx={60 + i * 70} cy="125" r="2" className="fill-white" />

              {/* Raised hand */}
              <rect
                x={55 + i * 70}
                y="100"
                width="2"
                height="12"
                rx="1"
                className="fill-white"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values={`0 ${56 + i * 70} 106;-20 ${56 + i * 70} 106;0 ${
                    56 + i * 70
                  } 106`}
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.6}s`}
                />
              </rect>
            </g>
          ))}
        </g>

        {/* Voting results */}
        <g className="text-xs">
          {["YES", "YES", "NO", "YES", "YES"].map((vote, i) => (
            <text
              key={i}
              x={60 + i * 70}
              y="170"
              textAnchor="middle"
              className={`font-medium ${
                vote === "YES" ? "fill-green-600" : "fill-red-600"
              }`}
            >
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur="4s"
                repeatCount="indefinite"
                begin={`${i * 0.8}s`}
              />
              {vote}
            </text>
          ))}
        </g>

        {/* Token rewards */}
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <circle
                cx={60 + i * 70}
                cy="80"
                r="4"
                className="fill-yellow-500"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0;0,-25;0,-50"
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.6}s`}
                />
                <animate
                  attributeName="opacity"
                  values="1;1;0"
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.6}s`}
                />
              </circle>
              <text
                x={60 + i * 70}
                y="85"
                textAnchor="middle"
                className="text-xs fill-yellow-600 font-bold"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0;0,-25;0,-50"
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.6}s`}
                />
                <animate
                  attributeName="opacity"
                  values="1;1;0"
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.6}s`}
                />
                +50
              </text>
            </g>
          ))}
        </g>

        {/* Progress bar */}
        <rect
          x="50"
          y="200"
          width="300"
          height="8"
          rx="4"
          className="fill-zinc-200 dark:fill-zinc-700"
        />
        <rect
          x="50"
          y="200"
          width="210"
          height="8"
          rx="4"
          className="fill-green-500"
        >
          <animate
            attributeName="width"
            values="0;210;210"
            dur="5s"
            repeatCount="indefinite"
          />
        </rect>
        <text
          x="200"
          y="225"
          textAnchor="middle"
          className="text-xs fill-current"
        >
          Consensus: 70% YES
        </text>
      </svg>
    </div>
  );
}

interface ValidatorSectionProps {
  validatorsInView: boolean;
}

export default function ValidatorSection({
  validatorsInView,
}: ValidatorSectionProps) {
  const validatorBenefits = [
    {
      title: "Token Rewards",
      description: "Earn CRAILO tokens for participating in dispute resolution",
      delay: 0,
    },
    {
      title: "Protocol Profits",
      description:
        "Get a share of platform fees based on your validation activity",
      delay: 200,
    },
    {
      title: "Reputation System",
      description:
        "Build your validator reputation for higher rewards and influence",
      delay: 400,
    },
  ];

  return (
    <section id="validators" className="w-full py-12 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div
            className={`flex flex-col justify-center space-y-6 transition-all duration-1000 ${
              validatorsInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                🏛️ Decentralized Justice
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Validator System
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Our community-driven dispute resolution ensures fair outcomes
                for everyone. Validators vote on disputes with simple Yes/No
                decisions.
              </p>
            </div>
            <div className="space-y-6">
              {validatorBenefits.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-4 transition-all duration-500 ${
                    validatorsInView
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-5"
                  }`}
                  style={{
                    transitionDelay: validatorsInView
                      ? `${item.delay + 300}ms`
                      : "0ms",
                  }}
                >
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-fit bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200 relative overflow-hidden group">
              <span className="relative z-10">Become a Validator</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Button>
          </div>
          <div
            className={`flex items-center justify-center transition-all duration-1000 delay-300 ${
              validatorsInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <Card className="w-full max-w-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Live Validator Voting</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ValidatorAnimation />
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Case #1247</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "iPhone 13 not as described - screen has scratches"
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-medium">Validator Votes</div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 hover:scale-105 transition-transform"
                    >
                      <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                      Buyer (7)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 hover:scale-105 transition-transform"
                    >
                      <XCircle className="h-4 w-4 mr-1 text-red-600" />
                      Seller (3)
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Reward: 50 CRAILO tokens + 0.1% protocol fee
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
