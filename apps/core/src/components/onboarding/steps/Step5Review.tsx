import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkspaceData } from "../types";
import { AVAILABLE_TOOLS } from "../constants";
import { WorkspaceIcon } from "../WorkspaceIcon";

interface Step5ReviewProps {
  data: WorkspaceData;
}

export function Step5Review({ data }: Step5ReviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Create</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Workspace Identity</h4>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <WorkspaceIcon data={data} size="lg" />
                <div>
                  <div className="font-bold text-lg text-slate-900">{data.name}</div>
                  <div className="text-sm text-slate-500">{data.type}</div>
                  <div className="text-xs text-indigo-600 font-medium mt-1">
                    https://{data.slug}.ydtb.app
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Description</h4>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 whitespace-pre-wrap">
                {data.description || "No description provided."}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Team Members ({data.members.length})</h4>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                {data.members.length > 0 ? data.members.map(m => (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{m.name}</span>
                    <span className="text-slate-500 text-xs px-2 py-0.5 bg-slate-200 rounded-full">{m.role}</span>
                  </div>
                )) : (
                  <span className="text-sm text-slate-400">No members invited</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Enabled Tools ({data.tools.length})</h4>
              <div className="flex flex-wrap gap-2">
                {data.tools.map(toolId => {
                  const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
                  if (!tool) return null;
                  const Icon = tool.icon;
                  return (
                    <Badge key={toolId} variant="secondary" className="pl-1 pr-3 py-1 flex items-center gap-2">
                      <div className="bg-white p-1 rounded-full">
                        <Icon className="h-3 w-3 text-indigo-600" />
                      </div>
                      {tool.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}