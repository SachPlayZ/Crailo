"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface VoteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    voteType: "valid" | "misleading" | null
    productName: string
}

export function VoteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    voteType,
    productName,
}: VoteConfirmationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleConfirm = async () => {
        setIsSubmitting(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        onConfirm()
        setIsSubmitting(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                <DialogHeader>
                    <div className="flex items-center space-x-3">
                        {voteType === "valid" ? (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                        ) : (
                            <XCircle className="h-6 w-6 text-red-400" />
                        )}
                        <DialogTitle className="text-white">Confirm Your Vote</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-400">
                        You are about to vote that "{productName}" is{" "}
                        <span className={voteType === "valid" ? "text-green-400" : "text-red-400"}>
                            {voteType === "valid" ? "valid and matches the listing" : "misleading and doesn't match"}
                        </span>
                        . This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-200">
                        <p className="font-medium">Important:</p>
                        <p>Your vote will be recorded on-chain and will affect your validator reputation.</p>
                    </div>
                </div>

                <DialogFooter className="space-x-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className={cn(
                            "font-medium transition-all duration-200",
                            voteType === "valid"
                                ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg hover:shadow-green-500/25"
                                : "bg-red-600 hover:bg-red-700 text-white hover:shadow-lg hover:shadow-red-500/25",
                        )}
                    >
                        {isSubmitting ? "Submitting..." : "Confirm Vote"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
