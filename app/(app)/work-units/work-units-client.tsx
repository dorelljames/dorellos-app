"use client";

import Link from "next/link";
import { useWorkUnits } from "@/lib/hooks/use-work-units";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkUnitCard } from "@/components/work-unit-card";
import { WorkUnitActions } from "./work-unit-actions";

export function WorkUnitsClient() {
  const { data: workUnits = [], isLoading } = useWorkUnits();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-48 bg-muted rounded" />
            <div className="h-48 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  const activeUnits = workUnits.filter((wu) => wu.status === "active");
  const parkedUnits = workUnits.filter((wu) => wu.status === "parked");
  const completedUnits = workUnits.filter((wu) => wu.status === "completed");

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Units</h1>
          <p className="text-muted-foreground">
            Manage your problem spaces
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/today">
            <Button variant="outline">Back to Today</Button>
          </Link>
          <Link href="/work-units/new">
            <Button>New Work Unit</Button>
          </Link>
        </div>
      </div>

      {/* Active Work Units */}
      {activeUnits.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Active</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeUnits.map((workUnit) => (
              <div key={workUnit.id} className="relative">
                <Link href={`/work-units/${workUnit.id}`}>
                  <WorkUnitCard workUnit={workUnit} />
                </Link>
                <div className="absolute top-4 right-4">
                  <WorkUnitActions workUnit={workUnit} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Parked Work Units */}
      {parkedUnits.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Parked</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {parkedUnits.map((workUnit) => (
              <div key={workUnit.id} className="relative opacity-75">
                <Link href={`/work-units/${workUnit.id}`}>
                  <WorkUnitCard workUnit={workUnit} />
                </Link>
                <div className="absolute top-4 right-4">
                  <WorkUnitActions workUnit={workUnit} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed Work Units */}
      {completedUnits.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Completed</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {completedUnits.map((workUnit) => (
              <div key={workUnit.id} className="relative opacity-60">
                <Link href={`/work-units/${workUnit.id}`}>
                  <WorkUnitCard workUnit={workUnit} />
                </Link>
                <div className="absolute top-4 right-4">
                  <WorkUnitActions workUnit={workUnit} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {workUnits.length === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Work Units Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create your first Work Unit to get started with the Daily
              Execution OS.
            </p>
            <Link href="/work-units/new">
              <Button>Create Work Unit</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
