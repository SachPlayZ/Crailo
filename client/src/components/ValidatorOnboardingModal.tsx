"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Wallet,
  XCircle,
  Loader2,
} from "lucide-react";
import Stepper, { Step } from "./Stepper/Stepper";
import { useStakeValidator } from "@/utils/validator";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

interface ValidatorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAlreadyValidator?: boolean;
}

export default function ValidatorOnboardingModal({
  isOpen,
  onClose,
  isAlreadyValidator = false,
}: ValidatorOnboardingModalProps) {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [stakeCompleted, setStakeCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { stakeAsValidator, isPending: isStakePending } = useStakeValidator();
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const handleGoToDashboard = () => {
    onClose();
    router.push("/validator/dashboard");
  };

  // Handle modal closing after successful stake
  useEffect(() => {
    if (stakeCompleted && !isStakePending) {
      const timer = setTimeout(() => {
        onClose();
        router.push("/validator/dashboard");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [stakeCompleted, isStakePending, onClose, router]);

  const handleStake = async () => {
    if (!isConnected || !address) {
      console.error("Wallet not connected.");
      return;
    }

    setIsLoading(true);
    try {
      await stakeAsValidator();
      setStakeCompleted(true);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  // Loading state component
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-w-md w-full p-8 border-none bg-black/90 rounded-3xl shadow-2xl transition-all duration-300"
          style={{
            boxShadow: "0 8px 64px 0 rgba(16,185,129,0.30)",
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Processing Validator Registration
              </h3>
              <p className="text-green-400 text-sm">
                Please wait while we secure your stake...
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-400 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Confirming transaction on blockchain</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="text-2xl font-bold text-center"></DialogTitle>
      <DialogContent
        className="max-w-2xl w-full p-0 border-none bg-black/90 rounded-3xl shadow-2xl transition-all duration-300"
        style={{
          minHeight: "40vh",
          maxHeight: "70vh",
          overflow: "hidden",
          boxShadow: "0 8px 64px 0 rgba(16,185,129,0.30)",
        }}
      >
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-900/40 scrollbar-track-transparent px-6 py-8">
          {isAlreadyValidator ? (
            // Content for existing validators
            <div className="space-y-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
                <h3 className="text-2xl font-semibold text-center text-white">
                  You're Already a Validator!
                </h3>
                <p className="text-muted-foreground text-center text-sm max-w-md">
                  You have successfully registered as a validator and can now
                  participate in dispute resolution.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">
                    What you can do now:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Review and vote on active disputes</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Earn CRAILO tokens for your participation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Build your validator reputation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Track your earnings and performance</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleGoToDashboard}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-green-500/25"
                >
                  Go to Validator Dashboard
                </Button>
              </div>
            </div>
          ) : (
            // Original stepper content for new validators
            <Stepper
              onFinalStepCompleted={handleStake}
              stepCircleContainerClassName="bg-transparent border-none"
              nextButtonProps={{
                className:
                  "bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all shadow-none mt-6",
                disabled:
                  !agreeToTerms || !isConnected || isStakePending || isLoading,
              }}
              backButtonProps={{
                className:
                  "text-green-400 hover:text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/10 transition-all shadow-none mt-6",
              }}
              contentClassName="bg-transparent"
              footerClassName="bg-transparent"
              nextButtonText={
                isStakePending || isLoading
                  ? "Processing..."
                  : stakeCompleted
                  ? "Registration Complete!"
                  : "Complete"
              }
              backButtonText="Back"
            >
              {/* Step 1: Disclaimer & Terms */}
              <Step>
                <div className="space-y-8">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-green-500 mb-2" />
                    <h3 className="text-xl font-semibold text-center">
                      Terms & Disclaimer
                    </h3>
                    <p className="text-muted-foreground text-center text-sm max-w-md">
                      By becoming a Crailo validator, you agree to act fairly,
                      review evidence honestly, and maintain confidentiality.
                      You understand that your stake may be at risk if you
                      violate the code of conduct.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 justify-center">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                      className="border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-relaxed select-none"
                    >
                      I agree to the Terms of Service and Validator Disclaimer.
                    </label>
                  </div>
                </div>
              </Step>
              {/* Step 2: Stake Payment */}
              <Step>
                <div className="space-y-8">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Wallet className="w-12 h-12 text-green-500 mb-2" />
                    <h3 className="text-xl font-semibold text-center">
                      Validator Stake
                    </h3>
                    <p className="text-muted-foreground text-center text-sm max-w-md">
                      Secure your validator position with a refundable stake of{" "}
                      <span className="font-bold text-green-400">
                        0.002 ETH
                      </span>
                      .
                    </p>
                  </div>

                  {/* Wallet Connection Warning */}
                  {!isConnected && (
                    <div className="flex items-center justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-400 text-sm">
                        Please connect your wallet to proceed with the stake
                      </span>
                    </div>
                  )}

                  {/* Stake Status */}
                  {stakeCompleted && (
                    <div className="text-center">
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-600"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Stake Confirmed
                      </Badge>
                    </div>
                  )}
                </div>
              </Step>
            </Stepper>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
