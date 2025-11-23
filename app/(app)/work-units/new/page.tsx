// New Work Unit Page - Fully client-side
import { AuthWrapper } from "@/components/auth-wrapper";
import { WorkUnitForm } from "../work-unit-form";

export default function NewWorkUnitPage() {
  return (
    <AuthWrapper>
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">New Work Unit</h1>
          <p className="text-muted-foreground">
            Create a new problem space to work on
          </p>
        </div>

        <WorkUnitForm />
      </div>
    </AuthWrapper>
  );
}
