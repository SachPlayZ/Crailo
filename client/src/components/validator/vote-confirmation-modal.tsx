"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface VoteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voteType: "valid" | "misleading" | null;
  productName: string;
}

export function VoteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  voteType,
  productName,
}: VoteConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onConfirm();
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-green-200 dark:border-green-800 max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {voteType === "valid" ? (
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            )}
            <DialogTitle className="text-foreground">
              Confirm Your Vote
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            You are about to vote that "{productName}" is{" "}
            <span
              className={
                voteType === "valid"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              {voteType === "valid"
                ? "valid and matches the listing"
                : "misleading and doesn't match"}
            </span>
            . This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            <p className="font-medium">Important:</p>
            <p>
              Your vote will be recorded on-chain and will affect your validator
              reputation.
            </p>
          </div>
        </div>

        <DialogFooter className="space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-green-200 dark:border-green-800 text-foreground hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={cn(
              "font-medium transition-all duration-200",
              voteType === "valid"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25"
                : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/25"
            )}
          >
            {isSubmitting ? "Submitting..." : "Confirm Vote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
