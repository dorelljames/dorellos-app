// Work Unit card component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownDisplay } from "@/components/markdown-display";
import type { WorkUnit } from "@/lib/types/database";

interface WorkUnitCardProps {
  workUnit: WorkUnit;
  onClick?: () => void;
  className?: string;
}

const statusColors = {
  active: "bg-green-500",
  parked: "bg-yellow-500",
  completed: "bg-blue-500",
  archived: "bg-gray-500",
};

const statusLabels = {
  active: "Active",
  parked: "Parked",
  completed: "Completed",
  archived: "Archived",
};

export function WorkUnitCard({ workUnit, onClick, className = '' }: WorkUnitCardProps) {
  return (
    <Card
      className={`cursor-pointer hover:border-primary transition-colors ${className}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{workUnit.title}</CardTitle>
          <Badge
            variant="secondary"
            className={`${statusColors[workUnit.status]} text-white`}
          >
            {statusLabels[workUnit.status]}
          </Badge>
        </div>
        {workUnit.outcome && (
          <CardDescription className="mt-2">
            <MarkdownDisplay content={workUnit.outcome} />
          </CardDescription>
        )}
      </CardHeader>

      {workUnit.done_when && (
        <CardContent>
          <div className="text-sm">
            <p className="font-medium mb-1">Done when:</p>
            <MarkdownDisplay content={workUnit.done_when} />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
