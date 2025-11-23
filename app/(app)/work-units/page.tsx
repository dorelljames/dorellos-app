// Work Units List Page - Fully client-side
import { AuthWrapper } from "@/components/auth-wrapper";
import { WorkUnitsClient } from "./work-units-client";

export default function WorkUnitsPage() {
  return (
    <AuthWrapper>
      <WorkUnitsClient />
    </AuthWrapper>
  );
}
