"use client";

import { useRouter } from "next/navigation";
import { useWorkUnit } from "@/lib/hooks/use-work-units";
import { WorkUnitForm } from "../../work-unit-form";

interface EditClientProps {
  id: string;
}

export function EditClient({ id }: EditClientProps) {
  const router = useRouter();
  const { data: workUnit, isLoading } = useWorkUnit(id);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!workUnit) {
    router.push("/work-units");
    return null;
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
