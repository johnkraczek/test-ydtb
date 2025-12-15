import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  domain?: string;
}

export function UrlInput({
  value,
  onChange,
  error,
  placeholder = "your-workspace",
  domain = "ydtb.app"
}: UrlInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="slug">Workspace URL</Label>
      <div className="flex items-center">
        <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-md px-3 py-2 text-sm text-slate-500 h-10 flex items-center">
          https://
        </span>
        <Input
          id="slug"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          className={cn("rounded-none h-10 border-x-0 focus-visible:ring-0 focus:border-indigo-500 z-10", error && "border-red-500 text-red-600")}
          placeholder={placeholder}
        />
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