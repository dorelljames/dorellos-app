// Today Screen - Fully client-side with TanStack Query
import { AuthWrapper } from "@/components/auth-wrapper";
import { TodayClient } from "./today-client";

export default function TodayPage() {
  return (
    <AuthWrapper>
      <TodayClient />
    </AuthWrapper>
  );
}
