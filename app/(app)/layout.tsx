// App layout for authenticated pages (Today, Work Units, Checkpoint)
import { Suspense } from "react";
import { SettingsGear } from "@/components/settings-gear";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Subtle settings gear icon - top right */}
      <div className="absolute top-6 right-6 z-50">
        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : (
          <Suspense fallback={<div className="h-10 w-10" />}>
            <SettingsGear />
          </Suspense>
        )}
      </div>

      <div className="flex-1">
        {children}
      </div>
    </main>
  );
}
