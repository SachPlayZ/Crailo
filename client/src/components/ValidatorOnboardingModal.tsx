"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Shield,
    Users,
    Coins,
    CheckCircle,
    AlertCircle,
    Wallet,
} from "lucide-react";
import Stepper, { Step } from "./Stepper/Stepper";

interface ValidatorOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ValidatorOnboardingModal({
    isOpen,
    onClose,
}: ValidatorOnboardingModalProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        experience: "",
        agreeToTerms: false,
        agreeToCode: false,
        walletConnected: false,
    });

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleComplete = () => {
        // Here you would typically handle the actual validator registration
        console.log("Validator registration completed:", formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-6xl w-[98vw] p-0 border-none bg-black/90 rounded-3xl shadow-2xl transition-all duration-300"
                style={{
                    minHeight: "62vh",
                    maxHeight: "94vh",
                    overflow: "hidden",
                    boxShadow: "0 8px 64px 0 rgba(16,185,129,0.30)",
                }}
            >
                <div className="max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-900/40 scrollbar-track-transparent px-6 py-8">
                    {/* Remove sticky header bar entirely */}
                    {/* Stepper with indicators and content */}
                    <Stepper
                        onFinalStepCompleted={handleComplete}
                        stepCircleContainerClassName="bg-transparent border-none"
                        nextButtonProps={{
                            className:
                                "bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all shadow-none mt-6",
                        }}
                        backButtonProps={{
                            className:
                                "text-green-400 hover:text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/10 transition-all shadow-none mt-6",
                        }}
                        contentClassName="bg-transparent"
                        footerClassName="bg-transparent"
                    >
                        {/* Step 1: Role & Responsibilities */}
                        <Step>
                            <div className="space-y-6">
                                <div className="text-center space-y-4">
                                    <div className="mx-auto w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full flex items-center justify-center">
                                        <Shield className="w-7 h-7 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        Validator Role & Responsibilities
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        As a Crailo validator, you'll help
                                        maintain trust and security in our
                                        marketplace.
                                    </p>
                                </div>
                                <div className="grid gap-4">
                                    <Card className="border-green-500/10 bg-gray-900/20 shadow-none">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Users className="w-5 h-5 text-green-600" />
                                                Your Responsibilities
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        Dispute Resolution
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Vote on transaction
                                                        disputes with fairness
                                                        and accuracy.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        Evidence Review
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Carefully examine all
                                                        provided evidence before
                                                        voting.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        Timely Participation
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Respond to validation
                                                        requests within 48
                                                        hours.
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <div className="bg-green-900/10 border border-green-500/10 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Coins className="w-5 h-5 text-green-600" />
                                            <span className="font-medium text-green-800 dark:text-green-200 text-sm">
                                                Rewards
                                            </span>
                                        </div>
                                        <p className="text-xs text-green-700 dark:text-green-300">
                                            Earn 50-200 CRAILO tokens per
                                            dispute + 0.1% of platform fees
                                            based on your accuracy and
                                            participation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Step>
                        {/* Step 2: Personal Information */}
                        <Step>
                            <div className="space-y-6">
                                <div className="text-center space-y-4">
                                    <div className="mx-auto w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full flex items-center justify-center">
                                        <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        Personal Information
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        Help us verify your identity and
                                        experience.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="fullName"
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "fullName",
                                                    e.target.value
                                                )
                                            }
                                            className="border-green-200 focus:border-green-500 focus:ring-green-500 bg-black/70"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email Address *
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={formData.email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            className="border-green-200 focus:border-green-500 focus:ring-green-500 bg-black/70"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experience">
                                            Relevant Experience
                                        </Label>
                                        <textarea
                                            id="experience"
                                            placeholder="Describe any relevant experience in dispute resolution, e-commerce, or blockchain (optional)"
                                            value={formData.experience}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full min-h-[100px] px-3 py-2 border border-green-200 rounded-md focus:border-green-500 focus:ring-green-500 focus:ring-1 resize-none bg-black/70"
                                        />
                                    </div>
                                    <div className="bg-blue-900/10 border border-blue-500/10 rounded-lg p-4">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-blue-800 dark:text-blue-200 text-sm">
                                                    Identity Verification
                                                </p>
                                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                    Your information will be
                                                    used for KYC verification.
                                                    We take privacy seriously
                                                    and encrypt all personal
                                                    data.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Step>
                        {/* Step 3: Terms & Conditions */}
                        <Step>
                            <div className="space-y-6">
                                <div className="text-center space-y-4">
                                    <div className="mx-auto w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        Terms & Code of Conduct
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        Please review and accept our validator
                                        terms.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <Card className="border-green-500/10 bg-gray-900/20 shadow-none">
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Validator Code of Conduct
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-sm">
                                            <div className="space-y-2">
                                                <p className="font-medium">
                                                    1. Impartiality
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Make decisions based solely
                                                    on evidence provided,
                                                    without bias or personal
                                                    interest.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-medium">
                                                    2. Confidentiality
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Keep all dispute information
                                                    confidential and never share
                                                    details outside the
                                                    platform.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-medium">
                                                    3. Accuracy
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Thoroughly review all
                                                    evidence before making
                                                    validation decisions.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-medium">
                                                    4. Availability
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Maintain reasonable response
                                                    times and participate
                                                    actively in the validation
                                                    process.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <Checkbox
                                                id="terms"
                                                checked={formData.agreeToTerms}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange(
                                                        "agreeToTerms",
                                                        checked as boolean
                                                    )
                                                }
                                                className="border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                            />
                                            <Label
                                                htmlFor="terms"
                                                className="text-sm leading-relaxed"
                                            >
                                                I agree to the{" "}
                                                <span className="text-green-600 underline cursor-pointer">
                                                    Validator Terms of Service
                                                </span>{" "}
                                                and understand my
                                                responsibilities as a Crailo
                                                validator.
                                            </Label>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Checkbox
                                                id="code"
                                                checked={formData.agreeToCode}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange(
                                                        "agreeToCode",
                                                        checked as boolean
                                                    )
                                                }
                                                className="border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                            />
                                            <Label
                                                htmlFor="code"
                                                className="text-sm leading-relaxed"
                                            >
                                                I agree to follow the Validator
                                                Code of Conduct and maintain the
                                                highest standards of integrity.
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Step>
                        {/* Step 4: Stake Payment */}
                        <Step>
                            <div className="space-y-6">
                                <div className="text-center space-y-4">
                                    <div className="mx-auto w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-full flex items-center justify-center">
                                        <Wallet className="w-7 h-7 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        Validator Stake
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        Secure your validator position with a
                                        refundable stake.
                                    </p>
                                </div>
                                <Card className="border-green-500/10 bg-green-900/10 shadow-none">
                                    <CardContent className="p-6">
                                        <div className="text-center space-y-4">
                                            <div className="space-y-2">
                                                <div className="text-3xl font-bold text-green-600">
                                                    0.02 ETH
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Required Validator Stake
                                                </p>
                                            </div>
                                            <div className="space-y-3 text-xs">
                                                <div className="flex justify-between">
                                                    <span>Stake Amount:</span>
                                                    <span className="font-medium">
                                                        0.02 ETH
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Gas Fee (est.):</span>
                                                    <span className="font-medium">
                                                        ~$5-15
                                                    </span>
                                                </div>
                                                <div className="border-t border-green-200 dark:border-green-800 pt-2 flex justify-between font-semibold">
                                                    <span>Total:</span>
                                                    <span>0.02 ETH + Gas</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="space-y-4">
                                    <div className="bg-blue-900/10 border border-blue-500/10 rounded-lg p-4">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-blue-800 dark:text-blue-200 text-sm">
                                                    About Your Stake
                                                </p>
                                                <ul className="text-xs text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                                                    <li>
                                                        • Your stake is held in
                                                        a smart contract
                                                    </li>
                                                    <li>
                                                        • Fully refundable when
                                                        you stop being a
                                                        validator
                                                    </li>
                                                    <li>
                                                        • Protects against
                                                        malicious behavior
                                                    </li>
                                                    <li>
                                                        • Earns additional
                                                        staking rewards
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Button
                                            onClick={() =>
                                                handleInputChange(
                                                    "walletConnected",
                                                    true
                                                )
                                            }
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-none"
                                            disabled={formData.walletConnected}
                                        >
                                            {formData.walletConnected ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Wallet Connected
                                                </>
                                            ) : (
                                                <>
                                                    <Wallet className="w-4 h-4 mr-2" />
                                                    Connect Wallet & Pay Stake
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    {formData.walletConnected && (
                                        <div className="text-center">
                                            <Badge
                                                variant="outline"
                                                className="border-green-500 text-green-600"
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Payment Confirmed
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Step>
                    </Stepper>
                </div>
            </DialogContent>
        </Dialog>
    );
}
