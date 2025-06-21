"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Edit2,
  Check,
  X,
  User,
  Mail,
  Shield,
  CheckCircle,
} from "lucide-react";
import { AlertCircle } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

interface KYCData {
  fullName: string;
  address: string;
  phoneNumber: string;
  aadharNumber: string;
  dateOfBirth: string;
  submittedAt: string;
  verifiedAt: string;
  status: string;
}

function ProfilePageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<KYCData>>({});

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session) {
      fetchKycData();
    }
  }, [session, status, router]);

  const fetchKycData = async () => {
    try {
      const response = await fetch("/api/kyc");
      if (response.ok) {
        const data = await response.json();
        if (data.kycData) {
          setKycData(data.kycData);
        }
      }
    } catch (error) {
      console.error("Error fetching KYC data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (field: string, value: string) => {
    setEditingField(field);
    setEditValues({ [field]: value });
    setError(null);
    setSuccess(null);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValues({});
    setError(null);
  };

  const saveField = async (field: string) => {
    if (!editValues[field as keyof KYCData]) {
      setError("Field cannot be empty");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/kyc", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field,
          value: editValues[field as keyof KYCData],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update KYC data");
      }

      // Update local state
      if (kycData) {
        setKycData({
          ...kycData,
          [field]: editValues[field as keyof KYCData],
        });
      }

      setSuccess(
        `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} updated successfully`
      );
      setEditingField(null);
      setEditValues({});

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const renderEditableField = (
    field: string,
    label: string,
    value: string,
    type: string = "text"
  ) => {
    const isEditing = editingField === field;
    const currentValue = isEditing
      ? editValues[field as keyof KYCData] || value
      : value;

    return (
      <div className="space-y-2">
        <Label htmlFor={field} className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              {type === "textarea" ? (
                <Textarea
                  id={field}
                  value={currentValue}
                  onChange={(e) =>
                    setEditValues({ ...editValues, [field]: e.target.value })
                  }
                  className="flex-1 bg-black text-white border-gray-600 placeholder:text-gray-400"
                  rows={3}
                />
              ) : (
                <Input
                  id={field}
                  type={type}
                  value={currentValue}
                  onChange={(e) =>
                    setEditValues({ ...editValues, [field]: e.target.value })
                  }
                  className="flex-1 bg-black text-white border-gray-600 placeholder:text-gray-400"
                />
              )}
              <Button
                size="sm"
                onClick={() => saveField(field)}
                disabled={isSaving}
                className="h-8 w-8 p-0"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={cancelEditing}
                disabled={isSaving}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1 p-3 bg-black text-white rounded-md border border-gray-600">
                {type === "textarea" ? (
                  <div className="whitespace-pre-wrap">{value}</div>
                ) : (
                  <span>{value}</span>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => startEditing(field, value)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Loading Profile...
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!kycData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                KYC Not Found
              </CardTitle>
              <CardDescription>
                You need to complete your KYC verification first.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => router.push("/kyc")}>Complete KYC</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt={session?.user?.name || ""}
                />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {session?.user?.name}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{session?.user?.email}</span>
                </CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    KYC Verified
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderEditableField("fullName", "Full Name", kycData.fullName)}
              {renderEditableField(
                "dateOfBirth",
                "Date of Birth",
                kycData.dateOfBirth,
                "date"
              )}
            </div>

            {renderEditableField(
              "address",
              "Complete Address",
              kycData.address,
              "textarea"
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderEditableField(
                "phoneNumber",
                "Phone Number",
                kycData.phoneNumber
              )}
              {renderEditableField(
                "aadharNumber",
                "Aadhar Number",
                kycData.aadharNumber
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">KYC Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className="ml-2 text-green-600 font-medium capitalize">
                    {kycData.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Submitted:</span>
                  <span className="ml-2">
                    {new Date(kycData.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Verified:</span>
                  <span className="ml-2">
                    {new Date(kycData.verifiedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard requireKyc={true}>
      <ProfilePageContent />
    </AuthGuard>
  );
}
