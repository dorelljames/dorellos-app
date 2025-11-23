// Work Unit Detail Page - Fully client-side
import { AuthWrapper } from "@/components/auth-wrapper";
import { DetailClient } from "./detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkUnitDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AuthWrapper>
      <DetailClient id={id} />
    </AuthWrapper>
  );
}
