"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Moon,
  Sun,
  Shield,
  Users,
  Coins,
  ArrowRight,
  CheckCircle,
  XCircle,
  Star,
  Github,
  MessageCircle,
  FileText,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";

// Custom hook for intersection observer
function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-50px",
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isInView] as const;
}

// Scroll progress hook
function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return progress;
}

// Typewriter effect hook
function useTypewriter(text: string, speed = 50) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
}

// Animated SVG Components
function EscrowAnimation() {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      <svg viewBox="0 0 320 320" className="w-full h-full">
        {/* Background circle */}
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-blue-200 dark:text-blue-800 opacity-30"
        />

        {/* Animated escrow flow */}
        <g>
          {/* Buyer */}
          <circle cx="80" cy="160" r="20" className="fill-green-500">
            <animate
              attributeName="r"
              values="18;22;18"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            x="80"
            y="200"
            textAnchor="middle"
            className="text-xs fill-current font-medium"
          >
            Buyer
          </text>

          {/* Escrow */}
          <rect
            x="140"
            y="140"
            width="40"
            height="40"
            rx="8"
            className="fill-blue-600"
          >
            <animate
              attributeName="fill"
              values="#3B82F6;#1D4ED8;#3B82F6"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
          <Shield className="w-6 h-6 text-white" x="148" y="148" />
          <text
            x="160"
            y="210"
            textAnchor="middle"
            className="text-xs fill-current font-medium"
          >
            Escrow
          </text>

          {/* Seller */}
          <circle cx="240" cy="160" r="20" className="fill-purple-500">
            <animate
              attributeName="r"
              values="18;22;18"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
          <text
            x="240"
            y="200"
            textAnchor="middle"
            className="text-xs fill-current font-medium"
          >
            Seller
          </text>
        </g>

        {/* Animated arrows */}
        <g
          className="stroke-current text-blue-600"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
          </defs>
          <path d="M105 160 L135 160">
            <animate
              attributeName="stroke-dasharray"
              values="0,30;30,0"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dashoffset"
              values="30;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M185 160 L215 160">
            <animate
              attributeName="stroke-dasharray"
              values="0,30;30,0"
              dur="2s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="stroke-dashoffset"
              values="30;0"
              dur="2s"
              repeatCount="indefinite"
              begin="1s"
            />
          </path>
        </g>

        {/* Floating coins */}
        <g className="fill-yellow-500">
          <circle cx="160" cy="110" r="4">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;0,-15;0,0"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="150" cy="120" r="3">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;0,-12;0,0"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
          <circle cx="170" cy="120" r="3">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;0,-12;0,0"
              dur="3s"
              repeatCount="indefinite"
              begin="2s"
            />
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="3s"
              repeatCount="indefinite"
              begin="2s"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
}

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
                className="fill-blue-600"
              >
                <animate
                  attributeName="fill"
                  values="#3B82F6;#10B981;#3B82F6"
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
          className="fill-gray-200 dark:fill-gray-700"
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

export default function CrailoLanding() {
  const [darkMode, setDarkMode] = useState(false);
  const scrollProgress = useScrollProgress();

  // Intersection observer refs
  const [heroRef, heroInView] = useInView();
  const [howItWorksRef, howItWorksInView] = useInView();
  const [whyCrailoRef, whyCrailoInView] = useInView();
  const [validatorsRef, validatorsInView] = useInView();
  const [scenariosRef, scenariosInView] = useInView();
  const [testimonialsRef, testimonialsInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  const { displayText: heroText, isComplete } = useTypewriter(
    "Crailo – The Safer Way to Buy & Sell Second-Hand Goods",
    80
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-1 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 group">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold">Crailo</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#how-it-works"
              className="text-sm font-medium hover:text-blue-600 transition-colors relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
            <a
              href="#why-crailo"
              className="text-sm font-medium hover:text-blue-600 transition-colors relative group"
            >
              Why Crailo
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
            <a
              href="#validators"
              className="text-sm font-medium hover:text-blue-600 transition-colors relative group"
            >
              Validators
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
            <a
              href="#community"
              className="text-sm font-medium hover:text-blue-600 transition-colors relative group"
            >
              Community
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
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
            <Button
              variant="outline"
              className="hidden sm:inline-flex hover:scale-105 transition-transform"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden"
      >
        {/* Parallax background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 animate-float"
            style={{
              transform: `translateY(${scrollProgress * 0.5}px)`,
              animationDelay: "0s",
            }}
          />
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 animate-float"
            style={{
              transform: `translateY(${scrollProgress * 0.3}px)`,
              animationDelay: "1s",
            }}
          />
          <div
            className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-200 dark:bg-green-900 rounded-full opacity-20 animate-float"
            style={{
              transform: `translateY(${scrollProgress * 0.4}px)`,
              animationDelay: "2s",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div
              className={`flex flex-col justify-center space-y-4 transition-all duration-1000 ${
                heroInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit animate-bounce">
                  🚀 Now in Beta
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none min-h-[1.2em]">
                  {heroText}
                  {!isComplete && <span className="animate-pulse">|</span>}
                </h1>
                <p
                  className={`max-w-[600px] text-muted-foreground md:text-xl transition-all duration-1000 delay-500 ${
                    heroInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-5"
                  }`}
                >
                  Escrow-protected. Validator-verified. Scam-free. Experience
                  the future of peer-to-peer marketplace with blockchain
                  security.
                </p>
              </div>
              <div
                className={`flex flex-col gap-2 min-[400px]:flex-row transition-all duration-1000 delay-700 ${
                  heroInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200 relative overflow-hidden group"
                >
                  <span className="relative z-10">Explore Listings</span>
                  <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-all duration-200 hover:shadow-lg"
                >
                  List Your Product
                </Button>
              </div>
            </div>
            <div
              className={`flex items-center justify-center transition-all duration-1000 delay-300 ${
                heroInView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 absolute -top-4 -left-4 animate-pulse"></div>
                <div className="w-72 h-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex items-center justify-center relative hover:shadow-3xl transition-shadow duration-300">
                  <EscrowAnimation />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col items-center justify-center space-y-4 text-center transition-all duration-1000 ${
              howItWorksInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                How Crailo Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Four simple steps to secure, trustless transactions
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4 lg:gap-8">
            {[
              {
                icon: TrendingUp,
                title: "1. List & Stake",
                description:
                  "Seller lists their product and stakes 10% of the value to show commitment and prevent scams.",
                color: "blue",
                delay: 0,
              },
              {
                icon: Coins,
                title: "2. Secure Payment",
                description:
                  "Buyer pays upfront into a smart contract escrow. Funds are locked until transaction completes.",
                color: "green",
                delay: 200,
              },
              {
                icon: Users,
                title: "3. Validator Review",
                description:
                  "If disputes arise, community validators review evidence and vote to resolve conflicts fairly.",
                color: "purple",
                delay: 400,
              },
              {
                icon: Award,
                title: "4. Happy Ending",
                description:
                  "Funds and stakes are released when everyone's satisfied. Validators earn rewards for participation.",
                color: "yellow",
                delay: 600,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              const colorClasses = {
                blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 border-blue-600",
                green:
                  "bg-green-100 dark:bg-green-900 text-green-600 border-green-600",
                purple:
                  "bg-purple-100 dark:bg-purple-900 text-purple-600 border-purple-600",
                yellow:
                  "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 border-yellow-600",
              };

              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-opacity-50 ${
                    howItWorksInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: howItWorksInView
                      ? `${step.delay}ms`
                      : "0ms",
                  }}
                >
                  <CardHeader className="pb-4 relative z-10">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                        colorClasses[step.color as keyof typeof colorClasses]
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                  <div
                    className={`absolute top-0 right-0 w-2 h-full transform translate-x-2 group-hover:translate-x-0 transition-transform ${
                      step.color === "blue"
                        ? "bg-blue-600"
                        : step.color === "green"
                        ? "bg-green-600"
                        : step.color === "purple"
                        ? "bg-purple-600"
                        : "bg-yellow-600"
                    }`}
                  ></div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Crailo */}
      <section
        id="why-crailo"
        ref={whyCrailoRef}
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col items-center justify-center space-y-4 text-center transition-all duration-1000 ${
              whyCrailoInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Why Choose Crailo?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Built for trust, designed for everyone
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            {[
              {
                icon: Shield,
                title: "Escrow for Every Deal",
                description:
                  "Smart contracts hold funds securely until both parties are satisfied. No more payment worries or delivery fears.",
                color: "blue",
                delay: 0,
              },
              {
                icon: Zap,
                title: "Stakes to Prevent Scams",
                description:
                  "Sellers put skin in the game with a 10% stake. Scammers lose their deposit, honest sellers get rewarded.",
                color: "green",
                delay: 200,
              },
              {
                icon: Users,
                title: "Validator Community Rewards",
                description:
                  "Join our validator network, resolve disputes fairly, and earn tokens plus a share of protocol profits.",
                color: "purple",
                delay: 400,
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              const colorClasses = {
                blue: "bg-blue-100 dark:bg-blue-900 text-blue-600",
                green: "bg-green-100 dark:bg-green-900 text-green-600",
                purple: "bg-purple-100 dark:bg-purple-900 text-purple-600",
              };

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center space-y-4 text-center group cursor-pointer transition-all duration-500 hover:scale-105 ${
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
                    <Icon className="h-8 w-8 group-hover:animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Validator System */}
      <section
        id="validators"
        ref={validatorsRef}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div
              className={`flex flex-col justify-center space-y-4 transition-all duration-1000 ${
                validatorsInView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit animate-pulse">
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
              <div className="space-y-4">
                {[
                  {
                    title: "Token Rewards",
                    description:
                      "Earn CRAILO tokens for participating in dispute resolution",
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
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 transition-all duration-500 ${
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
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-fit bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200 relative overflow-hidden group">
                <span className="relative z-10">Become a Validator</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
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
                <CardContent className="space-y-4">
                  <ValidatorAnimation />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Case #1247</span>
                      <Badge variant="outline" className="animate-pulse">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "iPhone 13 not as described - screen has scratches"
                    </p>
                  </div>
                  <div className="space-y-2">
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
                  <div className="text-xs text-muted-foreground animate-pulse">
                    Reward: 50 CRAILO tokens + 0.1% protocol fee
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Case Scenarios */}
      <section
        ref={scenariosRef}
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col items-center justify-center space-y-4 text-center transition-all duration-1000 ${
              scenariosInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                How Different Scenarios Play Out
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Transparency in action - see exactly what happens in each
                situation
              </p>
            </div>
          </div>
          <div
            className={`mx-auto max-w-3xl py-12 transition-all duration-1000 delay-300 ${
              scenariosInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem
                value="buyer-backs-out"
                className="border rounded-lg px-6 hover:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="font-semibold">Buyer Backs Out</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      When a buyer changes their mind after payment but before
                      delivery:
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                      <ul className="space-y-2 text-sm">
                        <li>• Buyer loses 25% of payment as penalty</li>
                        <li>• Seller keeps their 10% stake + penalty</li>
                        <li>• Remaining 75% returned to buyer</li>
                        <li>• Validators earn small fee for processing</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="seller-scams"
                className="border rounded-lg px-6 hover:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-semibold">Seller Scams</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      When a seller doesn't deliver or sends wrong/damaged
                      items:
                    </p>
                    <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                      <ul className="space-y-2 text-sm">
                        <li>• Seller loses 100% of their stake</li>
                        <li>• Buyer gets full refund + seller's stake</li>
                        <li>• Seller gets blacklisted from platform</li>
                        <li>• Validators earn rewards for correct judgment</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="successful-deal"
                className="border rounded-lg px-6 hover:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-semibold">Successful Deal</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      When everything goes smoothly and both parties are happy:
                    </p>
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <ul className="space-y-2 text-sm">
                        <li>• Seller gets full payment + stake back</li>
                        <li>• Buyer receives item as described</li>
                        <li>• Both parties can leave reviews</li>
                        <li>• Platform takes small success fee (2%)</li>
                        <li>• Everyone builds reputation for future deals</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="community"
        ref={testimonialsRef}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col items-center justify-center space-y-4 text-center transition-all duration-1000 ${
              testimonialsInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Trusted by Our Community
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Real stories from real users who've experienced safer trading
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-8">
            {[
              {
                name: "Alex Chen",
                initial: "A",
                color: "blue",
                text: "Sold my MacBook through Crailo and felt completely secure. The escrow system gave both me and the buyer confidence. No more sketchy meetups!",
                delay: 0,
              },
              {
                name: "Sarah Johnson",
                initial: "S",
                color: "green",
                text: "As a validator, I've earned over 500 CRAILO tokens helping resolve disputes. It's rewarding to help build a fairer marketplace.",
                delay: 200,
              },
              {
                name: "Mike Rodriguez",
                initial: "M",
                color: "purple",
                text: "Bought a gaming setup worth $2000. The seller's stake gave me confidence, and the validators resolved a minor issue quickly. Love this platform!",
                delay: 400,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className={`hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer ${
                  testimonialsInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: testimonialsInView
                    ? `${testimonial.delay}ms`
                    : "0ms",
                }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br from-${testimonial.color}-400 to-${testimonial.color}-600 rounded-full flex items-center justify-center text-white font-semibold hover:scale-110 transition-transform`}
                    >
                      {testimonial.initial}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {testimonial.name}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400 animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section
        ref={ctaRef}
        className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden"
      >
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
              ctaInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to Trade Safely?
              </h2>
              <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Button>
              </form>
              <p className="text-xs text-blue-200">
                Get early access and exclusive rewards. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 sm:px-6 lg:px-8 border-t">
        <div className="flex items-center space-x-2 group">
          <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xs">C</span>
          </div>
          <span className="text-sm font-medium">Crailo</span>
        </div>
        <p className="text-xs text-muted-foreground sm:ml-auto">
          © 2024 Crailo. Building the future of safe trading.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <a
            href="#"
            className="flex items-center space-x-1 text-xs hover:underline underline-offset-4 hover:scale-105 transition-transform"
          >
            <FileText className="h-3 w-3" />
            <span>Docs</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-1 text-xs hover:underline underline-offset-4 hover:scale-105 transition-transform"
          >
            <Github className="h-3 w-3" />
            <span>GitHub</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-1 text-xs hover:underline underline-offset-4 hover:scale-105 transition-transform"
          >
            <MessageCircle className="h-3 w-3" />
            <span>Discord</span>
          </a>
        </nav>
      </footer>
    </div>
  );
}
