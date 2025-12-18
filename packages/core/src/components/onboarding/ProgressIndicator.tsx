"use client";

import { Check, Building2 } from "lucide-react";
import { cn } from "@ydtb/core/lib/utils";
import { STEPS } from "./constants";

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-slate-900 hidden sm:inline-block">New Workspace</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  isActive ? "border-indigo-600 bg-indigo-50 text-indigo-600" :
                    isCompleted ? "border-indigo-600 bg-indigo-600 text-white" :
                      "border-slate-200 text-slate-400"
                )}>
                  {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs font-medium">{step.id}</span>}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={cn(
                    "w-4 sm:w-8 h-0.5 mx-1 sm:mx-2",
                    isCompleted ? "bg-indigo-600" : "bg-slate-200"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}