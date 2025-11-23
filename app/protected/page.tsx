import { redirect } from "next/navigation";

// Legacy route from Next.js Supabase starter
// Redirect to the Today page instead
export default function ProtectedPage() {
  redirect("/today");
}
