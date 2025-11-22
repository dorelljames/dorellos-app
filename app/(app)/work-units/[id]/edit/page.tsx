// Edit Work Unit Page
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWorkUnit } from "@/lib/db/work-units";
import { WorkUnitForm } from "../../work-unit-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkUnitPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const workUnit = await getWorkUnit(id);

  if (!workUnit) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Work Unit</h1>
        <p className="text-muted-foreground">Update your work unit details</p>
      </div>

      <WorkUnitForm workUnit={workUnit} />
    </div>
  );
}
