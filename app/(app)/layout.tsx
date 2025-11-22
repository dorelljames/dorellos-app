// App layout for authenticated pages (Today, Work Units, Checkpoint)
import { Suspense } from "react";
import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-b-foreground/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 text-sm">
          <div className="flex gap-6 items-center font-medium">
            <Link href="/today" className="text-lg font-bold">
              Daily Execution OS
            </Link>
            <div className="flex gap-4">
              <Link
                href="/today"
                className="hover:text-foreground/80 transition-colors"
              >
                Today
              </Link>
              <Link
                href="/work-units"
                className="hover:text-foreground/80 transition-colors"
              >
                Work Units
              </Link>
              <Link
                href="/guide"
                className="hover:text-foreground/80 transition-colors"
              >
                Guide
              </Link>
            </div>
          </div>
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
          )}
        </div>
      </nav>

      <div className="flex-1">
        {children}
      </div>
    </main>
  );
}
