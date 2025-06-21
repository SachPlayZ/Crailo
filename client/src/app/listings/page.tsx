import ShowListingsPage from "@/components/ShowListingsPage";
import AuthGuard from "@/components/AuthGuard";

export default function ListingsPage() {
  return (
    <AuthGuard requireKyc={true}>
      <ShowListingsPage />
    </AuthGuard>
  );
}
