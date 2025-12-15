"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Import all onboarding components
import {
  ProgressIndicator,
  Step0Welcome,
  Step1Identity,
  Step2Description,
  Step5Review,
  TeamMemberForm,
  ToolsGrid,
  WorkspaceData
} from "./index";

interface OnboardingWizardProps {
  onComplete?: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WorkspaceData>({
    name: "",
    type: "Company",
    slug: "",
    description: "",
    members: [],
    tools: [],
    iconType: "lucide",
    icon: "Building2",
    iconColor: "indigo",
    backgroundColor: "indigo",
  });
  const [slugError] = useState("");
  const [nameError, setNameError] = useState("");

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name) {
        setNameError("Please enter a workspace name");
        return;
      }
      if (slugError) return;
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Create workspace
      console.log("Creating workspace:", formData);
      if (onComplete) {
        onComplete();
      } else {
        router.push("/");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (updates: Partial<WorkspaceData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // For Step3Team
  const handleMembersChange = (members: any[]) => {
    updateData({ members });
  };

  // For Step4Tools
  const handleToolsChange = (tools: string[]) => {
    updateData({ tools });
  };

  // const CurrentStepComponent = STEPS[currentStep].component;

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-subtle-gradient flex flex-col items-center justify-center p-4">
        <Step0Welcome
          onStartNew={() => setCurrentStep(1)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-subtle-gradient flex flex-col">
      {/* Top Navigation / Progress */}
      <ProgressIndicator currentStep={currentStep} />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <Step1Identity
                data={formData}
                updateData={updateData}
                slugError={slugError}
                nameError={nameError}
                setNameError={setNameError}
              />
            )}
            {currentStep === 2 && (
              <Step2Description
                data={formData}
                updateData={updateData}
              />
            )}
            {currentStep === 3 && (
              <TeamMemberForm
                members={formData.members}
                onMembersChange={handleMembersChange}
              />
            )}
            {currentStep === 4 && (
              <ToolsGrid
                selectedTools={formData.tools}
                onToolsChange={handleToolsChange}
              />
            )}
            {currentStep === 5 && (
              <Step5Review
                data={formData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(currentStep === 1 && "invisible")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
            disabled={!!slugError || (currentStep === 1 && !formData.name)}
          >
            {currentStep === 5 ? "Create Workspace" : "Continue"}
            {currentStep !== 5 && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}