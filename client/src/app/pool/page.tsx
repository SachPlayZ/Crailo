"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Coins,
    TrendingUp,
    Shield,
    Zap,
    ArrowRight,
    Wallet,
    Clock,
    Users,
    DollarSign,
    ChevronDown,
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Spline to avoid SSR issues
const Spline = dynamic(() => import("@splinetool/react-spline"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gradient-to-br from-green-900/20 to-emerald-900/20 animate-pulse flex items-center justify-center">
            <div className="text-green-400">Loading 3D Scene...</div>
        </div>
    ),
});

export default function StakingPage() {
    const [balance, setBalance] = useState(0);
    const [stakeAmount, setStakeAmount] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    // Animate balance counter
    useEffect(() => {
        const timer = setInterval(() => {
            setBalance((prev) => {
                const target = 12847.52;
                const increment = (target - prev) / 20;
                return prev + increment > target ? target : prev + increment;
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    const stakingStats = [
        {
            label: "Total Staked",
            value: "$2.4M",
            icon: DollarSign,
            color: "text-green-400",
        },
        {
            label: "APY",
            value: "12.5%",
            icon: TrendingUp,
            color: "text-emerald-400",
        },
        {
            label: "Stakers",
            value: "1,247",
            icon: Users,
            color: "text-green-400",
        },
        {
            label: "Lock Period",
            value: "30 Days",
            icon: Clock,
            color: "text-emerald-400",
        },
    ];

    const features = [
        {
            icon: Shield,
            title: "Secure Staking",
            description:
                "Your funds are protected by smart contracts audited by leading security firms",
        },
        {
            icon: Zap,
            title: "Auto-Compounding",
            description:
                "Rewards are automatically reinvested to maximize your returns",
        },
        {
            icon: Coins,
            title: "Flexible Rewards",
            description:
                "Choose between CRAILO tokens or ETH for your staking rewards",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Hero Section with Spline */}
            <section className="relative min-h-screen flex items-center justify-center">
                {/* Spline Background */}
                <div className="absolute inset-0 z-0">
                    <Spline scene="https://prod.spline.design/zdI8qA87eD5KsCxe/scene.splinecode" />
                </div>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60 z-10" />

                {/* Animated Background Elements */}
                <div className="absolute inset-0 z-5">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: "1s" }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-20 container mx-auto px-4 py-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            className="space-y-8"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="space-y-6">
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                                    <Coins className="w-4 h-4 mr-2" />
                                    Earn up to 12.5% APY
                                </Badge>

                                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                    <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                                        Stake
                                    </span>
                                    <br />
                                    <span className="text-white">& Earn</span>
                                </h1>

                                <p className="text-xl text-gray-300 max-w-2xl">
                                    Join the Crailo staking pool and earn
                                    passive income while securing the network.
                                    Your tokens work for you 24/7.
                                </p>
                            </div>

                            {/* Balance Display */}
                            <motion.div
                                className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-400 uppercase tracking-wider">
                                        Your Balance
                                    </p>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-4xl font-bold text-green-400">
                                            $
                                            {balance.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                        <span className="text-lg text-gray-400">
                                            CRAILO
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400">
                                            +$247.83 (24h)
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                                    onClick={() => setIsConnected(!isConnected)}
                                >
                                    {isConnected ? (
                                        <>
                                            <Wallet className="w-5 h-5 mr-2" />
                                            Connected
                                        </>
                                    ) : (
                                        <>
                                            Connect Wallet
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
                                >
                                    Learn More
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Staking Interface */}
                        <motion.div
                            className="flex justify-center"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <Card className="w-full max-w-md bg-black/80 border-green-500/30 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl text-center text-green-400">
                                        Stake CRAILO
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-300">
                                                Amount to Stake
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={stakeAmount}
                                                    onChange={(e) =>
                                                        setStakeAmount(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="bg-gray-900/50 border-green-500/30 text-white placeholder:text-gray-500 pr-20"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                                    CRAILO
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">
                                                Available:
                                            </span>
                                            <span className="text-green-400">
                                                12,847.52 CRAILO
                                            </span>
                                        </div>

                                        <div className="space-y-2 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">
                                                    Estimated APY:
                                                </span>
                                                <span className="text-green-400 font-semibold">
                                                    12.5%
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">
                                                    Lock Period:
                                                </span>
                                                <span className="text-white">
                                                    30 Days
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">
                                                    Est. Monthly Rewards:
                                                </span>
                                                <span className="text-green-400 font-semibold">
                                                    {stakeAmount
                                                        ? `${(
                                                              (Number.parseFloat(
                                                                  stakeAmount
                                                              ) *
                                                                  0.125) /
                                                              12
                                                          ).toFixed(2)} CRAILO`
                                                        : "0.00 CRAILO"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                        disabled={!isConnected || !stakeAmount}
                                    >
                                        {!isConnected
                                            ? "Connect Wallet First"
                                            : "Stake Now"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                        animate={{ y: [0, 10, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                    >
                        <ChevronDown className="w-6 h-6 text-green-400" />
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-b from-black to-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {stakingStats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="text-center space-y-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                            >
                                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-full flex items-center justify-center border border-green-500/30">
                                    <stat.icon
                                        className={`w-8 h-8 ${stat.color}`}
                                    />
                                </div>
                                <div>
                                    <div
                                        className={`text-3xl font-bold ${stat.color}`}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {stat.label}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center space-y-4 mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold">
                            Why Choose{" "}
                            <span className="text-green-400">
                                Crailo Staking
                            </span>
                            ?
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Built for security, designed for growth. Experience
                            the future of decentralized staking.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.2,
                                }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full bg-black/50 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                                    <CardContent className="p-8 space-y-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                                            <feature.icon className="w-6 h-6 text-green-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-t border-green-500/20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold">
                            Ready to Start{" "}
                            <span className="text-green-400">Earning</span>?
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Join thousands of users already earning passive
                            income with Crailo staking.
                        </p>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg"
                        >
                            Start Staking Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
