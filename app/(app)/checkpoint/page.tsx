// Checkpoint (End-of-Day) Page - Fully client-side
import { AuthWrapper } from "@/components/auth-wrapper";
import { CheckpointClient } from "./checkpoint-client";

export default function CheckpointPage() {
  return (
    <AuthWrapper>
      <CheckpointClient />
    </AuthWrapper>
  );
}
