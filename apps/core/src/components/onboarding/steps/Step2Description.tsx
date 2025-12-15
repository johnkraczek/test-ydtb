import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WorkspaceData } from "../types";

interface Step2DescriptionProps {
  data: WorkspaceData;
  updateData: (updates: Partial<WorkspaceData>) => void;
}

export function Step2Description({
  data,
  updateData
}: Step2DescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <Label htmlFor="description">About this workspace</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            placeholder="Describe what this workspace is for..."
            className="min-h-[200px]"
          />
          <div className="flex justify-end">
            <span className="text-xs text-slate-400">
              {data.description.length} characters
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}