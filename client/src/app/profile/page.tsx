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
  CheckCircle,
  Shield,
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
    type = "text"
  ) => {
    const isEditing = editingField === field;
    const currentValue = isEditing
      ? editValues[field as keyof KYCData] || value
      : value;

    return (
      <div className="space-y-3 group">
        <Label
          htmlFor={field}
          className="text-sm font-semibold text-emerald-300"
        >
          {label}
        </Label>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              {type === "textarea" ? (
                <Textarea
                  id={field}
                  value={currentValue}
                  onChange={(e) =>
                    setEditValues({ ...editValues, [field]: e.target.value })
                  }
                  className="flex-1 bg-black/40 backdrop-blur-xl text-white border border-emerald-500/30 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200 rounded-lg"
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
                  className="flex-1 bg-black/40 backdrop-blur-xl text-white border border-emerald-500/30 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200 rounded-lg"
                />
              )}
              <Button
                size="sm"
                onClick={() => saveField(field)}
                disabled={isSaving}
                className="h-9 w-9 p-0 bg-emerald-600 hover:bg-emerald-500 text-white border-0 rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                onClick={cancelEditing}
                disabled={isSaving}
                className="h-9 w-9 p-0 bg-slate-600 hover:bg-slate-500 text-white border-0 rounded-lg shadow-lg transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1 p-4 bg-black/30 backdrop-blur-xl text-white rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-200">
                {type === "textarea" ? (
                  <div className="whitespace-pre-wrap">{value}</div>
                ) : (
                  <span>{value}</span>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => startEditing(field, value)}
                className="h-9 w-9 p-0 bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white border-0 rounded-lg shadow-lg transition-all duration-200"
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-black relative">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <Card className="max-w-4xl mx-auto bg-black/20 backdrop-blur-2xl border border-emerald-500/20 shadow-2xl">
            <CardHeader className="text-center py-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30">
                <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-black relative">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <Card className="max-w-4xl mx-auto bg-black/20 backdrop-blur-2xl border border-emerald-500/20 shadow-2xl">
            <CardHeader className="text-center py-8">
              <CardTitle className="text-2xl font-bold text-white mb-2">
                KYC Not Found
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                You need to complete your KYC verification first.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button
                onClick={() => router.push("/kyc")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 px-8 py-3 text-base font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
              >
                Complete KYC
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-black relative">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Card className="max-w-5xl mx-auto bg-black/20 backdrop-blur-2xl border border-emerald-500/20 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
          <CardHeader className="relative p-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-2 ring-emerald-500/50 shadow-lg">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback className="bg-emerald-900/50 text-emerald-300 text-xl">
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 shadow-lg">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  {session?.user?.name}
                </CardTitle>
                <CardDescription className="flex items-center space-x-3 text-slate-300 text-base mb-4">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  <span>{session?.user?.email}</span>
                </CardDescription>
                <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-xl px-4 py-2 rounded-lg border border-emerald-500/30">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">
                    KYC Verified
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {error && (
              <div className="p-4 bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-lg flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-300 font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-lg flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <div className="border-t border-emerald-500/20 pt-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-400" />
                KYC Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/30 backdrop-blur-xl p-6 rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-200">
                  <div className="text-slate-400 text-sm font-medium mb-2">
                    Status
                  </div>
                  <div className="text-emerald-400 text-lg font-semibold capitalize">
                    {kycData.status}
                  </div>
                </div>
                <div className="bg-black/30 backdrop-blur-xl p-6 rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-200">
                  <div className="text-slate-400 text-sm font-medium mb-2">
                    Submitted
                  </div>
                  <div className="text-white text-lg font-semibold">
                    {new Date(kycData.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-black/30 backdrop-blur-xl p-6 rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-200">
                  <div className="text-slate-400 text-sm font-medium mb-2">
                    Verified
                  </div>
                  <div className="text-white text-lg font-semibold">
                    {new Date(kycData.verifiedAt).toLocaleDateString()}
                  </div>
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
