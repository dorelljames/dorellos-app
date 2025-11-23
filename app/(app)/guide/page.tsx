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
        <h1 className="text-4xl font-bold mb-2">Daily Execution OS Guide</h1>
        <p className="text-lg text-muted-foreground">
          A minimal, focused productivity system for building consistently
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
            <CardTitle>2. Daily Intent</CardTitle>
            <CardDescription>
              Set your focus for the day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              Each morning, write a <strong>free-form intention</strong> for your day.
              This helps you clarify what you want to accomplish without rigid structure.
            </p>
            <div className="bg-muted p-4 rounded-md mt-3">
              <p className="font-medium mb-2">How to use it:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Click the Daily Intent section to edit</li>
                <li>Write naturally about what you want to focus on</li>
                <li>Auto-saves as you type</li>
                <li>Click outside to hide and view as text</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md mt-3 text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Example:</p>
              <p className="text-blue-800 dark:text-blue-200 italic">
                "Today I want to push the Payments PR forward until I finish the migrations,
                review Evan's comments, and prepare for final testing."
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Weekly Momentum & Streaks</CardTitle>
            <CardDescription>
              Track your progress without guilt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              See your week at a glance with a simple bar chart showing which days you had activity.
              Monthly streaks track consistency without pressure.
            </p>
            <div className="bg-muted p-4 rounded-md mt-3">
              <p className="font-medium mb-2">What you'll see:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Weekly Momentum</strong>: Bar chart of this week's activity</li>
                <li><strong>Presence</strong>: Days this month with an active Work Unit</li>
                <li><strong>Checkpoint</strong>: Days this month you closed with reflection</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md mt-3 text-sm">
              <p className="text-blue-900 dark:text-blue-100">
                <strong>No guilt design:</strong> Empty days show as subtle gray. No red, no "missed days" language.
                Just observation of momentum—not judgment.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Daily Checkpoints</CardTitle>
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
                <li>Set your Daily Intent</li>
                <li>Review or switch your Work Unit</li>
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
                <li>Work on your checklist items</li>
                <li>Add new items as you go</li>
                <li>Check off completed items</li>
                <li>Switch Work Units if needed (use Multi-view)</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🌙 Evening</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1">
                <li>Click <strong>"Close Day"</strong> (top right)</li>
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
                  <p className="font-medium">Write your Daily Intent</p>
                  <p className="text-sm text-muted-foreground">
                    On the <Link href="/today" className="underline">Today screen</Link>,
                    click the Daily Intent section and write what you want to focus on today.
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
                  One Work Unit at a time, not scattered across 30 tasks
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
              <CardTitle className="text-base">How do I add checklist items?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Click the empty line at the bottom of your checklist (it says "Click to add item...").
              Type your item and press Enter. To edit, click on the item. To delete, hover and click the × button
              (hold Shift to skip confirmation).
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What's the difference between Daily Intent and checklist?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Daily Intent is your free-form focus for the day—what you want to accomplish overall.
              Checklist items are the specific, actionable steps for your current Work Unit. Think of intent
              as the "why" and checklist as the "how".
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Can I work on multiple Work Units at once?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Yes! You can have multiple Work Units in "Active" status. On the Today screen, click "Multi-view"
              to see 2-3 Work Units side-by-side with their checklists. This lets you work on multiple projects
              without losing focus. Click "Single view" to return to focusing on one unit.
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
              <CardTitle className="text-base">📋 Break It Down</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Break down your Work Unit into smaller checklist items. These help you see progress
              and keep you moving forward. Click to edit, Shift+click × to delete quickly.
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
