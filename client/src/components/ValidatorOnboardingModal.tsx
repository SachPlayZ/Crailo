"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Wallet, XCircle } from "lucide-react";
import Stepper, { Step } from "./Stepper/Stepper";
import { useStakeValidator } from "@/utils/validator";
import { useAccount } from "wagmi";

interface ValidatorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ValidatorOnboardingModal({
  isOpen,
  onClose,
}: ValidatorOnboardingModalProps) {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [stakeCompleted, setStakeCompleted] = useState(false);
  const { stakeAsValidator } = useStakeValidator();
  const { address, isConnected } = useAccount();

  const handleStake = async () => {
    if (!isConnected || !address) {
      console.error("Wallet not connected.");
      return;
    }

    setIsStaking(true);
    try {
      await stakeAsValidator();
      setStakeCompleted(true);
      // Close modal after successful stake
      setTimeout(() => {
        onClose();
        // Reset state for next time
        setStakeCompleted(false);
        setIsStaking(false);
        setAgreeToTerms(false);
      }, 2000);
    } catch (e) {
      console.error(e);
      setIsStaking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Stepper
            onFinalStepCompleted={handleStake}
            stepCircleContainerClassName="bg-transparent border-none"
            nextButtonProps={{
              className:
                "bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all shadow-none mt-6",
              disabled: !agreeToTerms || !isConnected || isStaking,
            }}
            backButtonProps={{
              className:
                "text-green-400 hover:text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/10 transition-all shadow-none mt-6",
            }}
            contentClassName="bg-transparent"
            footerClassName="bg-transparent"
            nextButtonText={isStaking ? "Processing..." : "Complete"}
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
                    review evidence honestly, and maintain confidentiality. You
                    understand that your stake may be at risk if you violate the
                    code of conduct.
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
                    <span className="font-bold text-green-400">0.002 ETH</span>.
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
