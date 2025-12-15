"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { WorkspaceData, WorkspaceType } from "../types";
import { IconPicker } from "../IconPicker";
import { UrlInput } from "../UrlInput";
import { generateSlug } from "../utils";
import { WorkspaceIcon } from "../WorkspaceIcon";

interface Step1IdentityProps {
  data: WorkspaceData;
  updateData: (updates: Partial<WorkspaceData>) => void;
  slugError: string;
  nameError: string;
  setNameError: (error: string) => void;
  onSlugChange?: (slug: string) => void;
  isValidatingSlug?: boolean;
}

export function Step1Identity({
  data,
  updateData,
  slugError,
  nameError,
  setNameError,
  onSlugChange,
  isValidatingSlug
}: Step1IdentityProps) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    updateData({ name });
    setNameError("");
    if (!data.slug || data.slug === generateSlug(data.name)) {
      const newSlug = generateSlug(name);
      updateData({ slug: newSlug });
      onSlugChange?.(newSlug);
    }
  };

  const handleSlugChange = (slug: string) => {
    updateData({ slug });
    onSlugChange?.(slug);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Workspace Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center sm:flex-row gap-6">
              <div
                className="relative group cursor-pointer"
                onClick={() => setIconPickerOpen(true)}
              >
                <WorkspaceIcon
                  data={data}
                  size="xl"
                  className="border-2 border-dashed border-slate-300 group-hover:border-indigo-500 transition-colors"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-colors">
                  <Pencil className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="grid gap-2">
                  <Label htmlFor="name">Workspace Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Acme Corp"
                    className={cn(nameError && "border-red-500 focus-visible:ring-red-500")}
                  />
                  {nameError && <p className="text-sm text-red-500">{nameError}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type">Workspace Type</Label>
                  <Select
                    value={data.type}
                    onValueChange={(v) => updateData({ type: v as WorkspaceType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Company">Company</SelectItem>
                      <SelectItem value="Team">Team</SelectItem>
                      <SelectItem value="Project">Project</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Location">Location</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {data.type === "Other" && (
                    <Input
                      placeholder="Specify type..."
                      value={data.customType || ""}
                      onChange={(e) => updateData({ customType: e.target.value })}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </div>

            <UrlInput
              value={data.slug}
              onChange={handleSlugChange}
              error={slugError}
              isValidating={isValidatingSlug}
            />
          </div>
        </CardContent>
      </Card>

      {/* Icon Picker Dialog */}
      <IconPicker
        open={iconPickerOpen}
        onOpenChange={setIconPickerOpen}
        data={data}
        updateData={updateData}
      />
    </>
  );
}