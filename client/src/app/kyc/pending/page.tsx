"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KYCPendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              KYC Under Review
            </CardTitle>
            <CardDescription>
              Your KYC application has been submitted and is currently under
              review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                What happens next?
              </h4>
              <ul className="text-blue-800 text-sm space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Our team will review your submitted information</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Verification typically takes 24-48 hours</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>
                    You'll receive an email notification once approved
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                While you wait:
              </h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Explore our platform features and documentation</li>
                <li>• Read our terms of service and privacy policy</li>
                <li>• Check out our FAQ section</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="flex-1"
              >
                Go to Homepage
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Check Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
