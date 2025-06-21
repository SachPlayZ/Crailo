"use client";

import { useSearchParams } from "next/navigation";
import ValidatorDashboard from "@/components/validator/dashboard";
import DisputesPanel from "@/components/validator/disputes-panel";
import AuthGuard from "@/components/AuthGuard";

export default function Page() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  return (
    <AuthGuard requireKyc={true}>
      <>
        {tab === "dashboard" && <ValidatorDashboard />}
        {tab === "disputes" && <DisputesPanel />}
      </>
    </AuthGuard>
  );
}
