// Edit Work Unit Page - Fully client-side
import { AuthWrapper } from "@/components/auth-wrapper";
import { EditClient } from "./edit-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkUnitPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AuthWrapper>
      <EditClient id={id} />
    </AuthWrapper>
  );
}
