import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect authenticated users to the Today page
  if (user) {
    redirect("/today");
  }

  // Landing page for unauthenticated users
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Daily Execution OS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A personal productivity system focused on showing up daily and making progress.
            No overwhelm. No toxic productivity. Just consistent execution.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 my-12">
          <Card>
            <CardHeader>
              <CardTitle>Work Units</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Break large, messy tasks into coherent problem spaces with clear outcomes
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Intent & Horizons</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Set your daily focus and long-term direction. Stay aligned with what matters.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Momentum</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your progress at a glance. Missing a day doesn't break your streak.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/sign-up">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
