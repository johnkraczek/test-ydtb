import { Input } from "@ydtb/ui/base/input";
import { Label } from "@ydtb/ui/base/label";
import { cn } from "@ydtb/core/lib/utils";
import { Loader2 } from "lucide-react";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  domain?: string;
  isValidating?: boolean;
}

export function UrlInput({
  value,
  onChange,
  error,
  placeholder = "your-workspace",
  domain = "ydtb.app",
  isValidating = false
}: UrlInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="slug">Workspace URL</Label>
      <div className="flex items-center">
        <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-md px-3 py-2 text-sm text-slate-500 h-10 flex items-center">
          https://
        </span>
        <div className="relative flex-1">
          <Input
            id="slug"
            value={value}
            onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            className={cn(
              "rounded-none h-10 border-x-0 focus-visible:ring-0 focus:border-indigo-500 z-10",
              error && "border-red-500 text-red-600",
              isValidating && "pr-10"
            )}
            placeholder={placeholder}
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          )}
        </div>
        <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-md px-3 py-2 text-sm text-slate-500 h-10 flex items-center">
          .{domain}
        </span>
      </div>
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <p className="text-xs text-slate-500">
          Preview: https://{value || placeholder}.{domain}
        </p>
      )}
    </div>
  );
}