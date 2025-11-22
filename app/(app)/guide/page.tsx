// User Guide Page
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function GuidePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">How to Use Daily Execution OS</h1>
        <p className="text-lg text-muted-foreground">
          A quick guide to help you make the most of your productivity system
        </p>
      </div>

      {/* Core Concepts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Core Concepts</h2>

        <Card>
          <CardHeader>
            <CardTitle>1. Work Units</CardTitle>
            <CardDescription>
              One coherent problem-space you're working on
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              A <strong>Work Unit</strong> is a single problem or project that might span days or weeks.
              It's not a one-day task—it's a meaningful chunk of work with a clear outcome.
            </p>
            <div className="bg-muted p-4 rounded-md mt-3">
              <p className="font-medium mb-2">Each Work Unit has:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Title</strong>: What you're working on</li>
                <li><strong>Outcome</strong>: What success looks like (supports markdown)</li>
                <li><strong>Done When</strong>: Clear completion criteria (supports markdown)</li>
                <li><strong>Checklist</strong>: Break it down into smaller steps</li>
                <li><strong>Status</strong>: Active, Parked, Completed, or Archived</li>
              </ul>
            </div>
            <div className="pt-2">
              <Link href="/work-units">
                <Button variant="outline" size="sm">Manage Work Units →</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Daily Three ("3 Nails")</CardTitle>
            <CardDescription>
              Your 3 commitments for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              Each day, commit to <strong>just 3 things</strong> you want to accomplish.
              These are your "nails"—the things you're driving into today.
            </p>
            <div className="bg-muted p-4 rounded-md mt-3">
              <p className="font-medium mb-2">Best Practices:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Make them <strong>specific and actionable</strong></li>
                <li>Choose things you can <strong>complete today</strong></li>
                <li>Mix of work from your Work Unit and other tasks</li>
                <li>Don't stress if you don't finish all 3—progress counts!</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md mt-3 text-sm">
              <p className="font-medium text-green-900 dark:text-green-100 mb-1">✅ Good Examples:</p>
              <ul className="list-disc list-inside text-green-800 dark:text-green-200">
                <li>"Write introduction section for docs"</li>
                <li>"Fix auth bug in login flow"</li>
                <li>"Call Sarah about Q1 budget"</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-950 p-3 rounded-md mt-2 text-sm">
              <p className="font-medium text-red-900 dark:text-red-100 mb-1">❌ Avoid:</p>
              <ul className="list-disc list-inside text-red-800 dark:text-red-200">
                <li>"Work on project" (too vague)</li>
                <li>"Finish entire refactor" (too big)</li>
                <li>"Think about strategy" (not actionable)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Daily Checkpoints</CardTitle>
            <CardDescription>
              End-of-day reflection for closure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              At the end of your day, take a few minutes to reflect. This gives you{" "}
              <strong>psychological closure</strong> even when big tasks aren't finished.
            </p>
            <div className="bg-muted p-4 rounded-md mt-3">
              <p className="font-medium mb-2">The checkpoint asks:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>What did you complete?</strong> Even small progress counts</li>
                <li><strong>Where did you stop?</strong> What's the next step?</li>
                <li><strong>Any blockers?</strong> What's getting in the way?</li>
                <li><strong>How are you feeling?</strong> Optional mood tracking</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              💡 <strong>Pro tip</strong>: Checkpoints help you resume work easily tomorrow.
              Write clear "next steps" so future-you knows exactly where to pick up.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Builder Streaks</CardTitle>
            <CardDescription>
              Track showing up, not perfection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              Two simple metrics that celebrate <strong>consistency over perfection</strong>:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium mb-1">🔥 Presence Streak</p>
                <p className="text-sm text-muted-foreground">
                  Days <strong>this month</strong> you engaged with a Work Unit
                </p>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium mb-1">✅ Checkpoint Streak</p>
                <p className="text-sm text-muted-foreground">
                  Days <strong>this month</strong> you submitted a checkpoint
                </p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md mt-3 text-sm">
              <p className="text-blue-900 dark:text-blue-100">
                <strong>Important:</strong> These are <strong>monthly counts</strong>, not consecutive streaks.
                Missing a day doesn't "break" anything—you just pick up where you left off!
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Daily Flow */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Daily Flow</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">☀️ Morning</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1">
                <li>Open the <strong>Today</strong> screen</li>
                <li>Review or change your Work Unit</li>
                <li>Set your 3 Nails for the day</li>
                <li>Get to work!</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ During the Day</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1">
                <li>Use Today screen as your command center</li>
                <li>Check off Nails as you complete them</li>
                <li>Update Work Unit checklist</li>
                <li>Stay focused on your 3 priorities</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🌙 Evening</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1">
                <li>Click <strong>"Close Day"</strong></li>
                <li>Reflect on what you completed</li>
                <li>Note where you stopped</li>
                <li>Capture any blockers</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* First-Time Setup */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Getting Started (First Time)</h2>

        <Card>
          <CardContent className="pt-6">
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-medium">Create your first Work Unit</p>
                  <p className="text-sm text-muted-foreground">
                    Go to <Link href="/work-units" className="underline">Work Units</Link> → "New Work Unit".
                    Add a title, outcome, and done-when criteria. Add checklist items to break it down.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-medium">Set it as Today's Work Unit</p>
                  <p className="text-sm text-muted-foreground">
                    From the Work Units list, click the menu (•••) and select "Set as Today's Unit".
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-medium">Add your Daily 3 Nails</p>
                  <p className="text-sm text-muted-foreground">
                    On the <Link href="/today" className="underline">Today screen</Link>,
                    add 1-3 specific commitments for the day.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-medium">Close your day with a checkpoint</p>
                  <p className="text-sm text-muted-foreground">
                    When you're done, click "Close Day" and fill out the checkpoint form.
                    This updates your checkpoint streak!
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* Philosophy */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">The Philosophy</h2>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm">
              This app is intentionally minimal. It's built around specific behavioral principles:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-background/80 p-3 rounded-md">
                <p className="font-medium text-sm">🎯 Closure over Completion</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Feel good about your day even if big tasks aren't done
                </p>
              </div>
              <div className="bg-background/80 p-3 rounded-md">
                <p className="font-medium text-sm">👟 Presence over Perfection</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Showing up counts; missing a day doesn't reset progress
                </p>
              </div>
              <div className="bg-background/80 p-3 rounded-md">
                <p className="font-medium text-sm">🎪 Focus over Volume</p>
                <p className="text-xs text-muted-foreground mt-1">
                  3 Nails, not 30 tasks
                </p>
              </div>
              <div className="bg-background/80 p-3 rounded-md">
                <p className="font-medium text-sm">📝 Context over Memory</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Checkpoints capture where you stopped so you can resume easily
                </p>
              </div>
            </div>
            <p className="text-sm font-medium pt-2 text-center">
              It's not trying to be everything. It's trying to be enough.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Common Questions</h2>

        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What if I finish all 3 nails early?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Great! You can work on your Work Unit checklist, get ahead on planning tomorrow,
              or take a well-deserved break. The 3-nail limit is intentional—focus beats volume.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What if I don't finish all 3 nails?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              That's completely okay! The checkpoint asks "What did you complete?" and "Where did you stop?"
              You get closure either way. Progress, not perfection.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Can I have multiple active Work Units?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Yes! You can have multiple Work Units in "Active" status. But you can only have
              <strong> one selected for Today</strong>. This forces focus. If you need to context-switch,
              just change today's Work Unit from the Work Units page.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What's the difference between Parked and Archived?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <strong>Parked</strong>: Work Unit you're not actively working on but plan to return to.<br />
              <strong>Archived</strong>: Work Unit you're done with or no longer pursuing.<br />
              <strong>Completed</strong>: Work Unit successfully finished!
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Do I have to fill out a checkpoint every day?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              No, but it's highly recommended! Checkpoints give you closure and make it easier to resume work.
              Plus, they count toward your Checkpoint Streak, which tracks your consistency.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Tips</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">💡 Use Markdown</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Work Unit "Outcome" and "Done When" fields support markdown.
              Use **bold**, lists, and links to make them clear and scannable.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">🎯 Be Specific</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Vague Work Units lead to drift. "Refactor auth" → "Extract auth logic into AuthService
              with OAuth support and session management."
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">📋 Use Checklists</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Break down your Work Unit into smaller checklist items. These help you see progress
              and give you concrete tasks to pull into your Daily 3 Nails.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">🌙 Checkpoint Daily</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Even if you didn't finish much, capture where you stopped. Future-you will thank you
              when you can resume instantly instead of spending 20 minutes remembering context.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <div className="flex justify-center pt-6 pb-12">
        <Link href="/today">
          <Button size="lg">Go to Today Screen →</Button>
        </Link>
      </div>
    </div>
  );
}
