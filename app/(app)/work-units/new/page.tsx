// New Work Unit Page
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkUnitForm } from "../work-unit-form";

export default async function NewWorkUnitPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Work Unit</h1>
        <p className="text-muted-foreground">
          Create a new problem space to work on
        </p>
      </div>

      <WorkUnitForm />
    </div>
  );
}
