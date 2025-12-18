"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@ydtb/ui/base/button";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession, authClient } from "@/lib/auth-client";

// Import server actions
import { inviteUserToWorkspace } from "@/server/actions/workspace";

// Import client-side workspace context
import { useWorkspace } from "@/context/workspace/workspace-context";

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
  const { data: session } = useSession();
  const { createWorkspace: createWorkspaceInContext } = useWorkspace();
  const [isPending, startTransition] = useTransition();
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
  const [slugError, setSlugError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isValidatingSlug, setIsValidatingSlug] = useState(false);

  const handleNext = async () => {
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
      startTransition(async () => {
        try {
          // Use the context's createWorkspace function which handles all the side effects
          const workspace = await createWorkspaceInContext({
            name: formData.name,
            slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description: formData.description,
            metadata: {
              type: formData.type,
              customType: formData.customType,
              tools: formData.tools,
              iconType: formData.iconType,
              icon: formData.iconType === "lucide" ? formData.icon : undefined,
              iconColor: formData.iconColor,
              backgroundColor: formData.backgroundColor,
            },
          });

          // Send invitations to team members after a short delay to ensure workspace is fully created
          let invitedCount = 0;
          let skippedCount = 0;

          if (formData.members && formData.members.length > 0) {
            // Wait a moment for the workspace to be fully set up
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!workspace || !workspace.id) {
              toast.error("Workspace ID not available for invitations");
            } else {
              // Get current user's email to avoid self-invitation
              const currentUserEmail = session?.user?.email;

              for (const member of formData.members) {
                // Skip if trying to invite the current user
                if (member.email === currentUserEmail) {
                  skippedCount++;
                  continue;
                }

                try {
                  await inviteUserToWorkspace({
                    workspaceId: workspace.id,
                    email: member.email,
                    role: member.role as "owner" | "admin" | "member",
                  });
                  invitedCount++;
                } catch (inviteError) {
                  // Log error but continue with other invitations
                  console.error(`Failed to invite ${member.email}:`, inviteError);
                  const errorMsg = inviteError instanceof Error ? inviteError.message : 'Unknown error';

                  // Don't show error for "already a member" messages
                  if (!errorMsg.includes("already a member")) {
                    toast.error(`Failed to invite ${member.email}: ${errorMsg}`, {
                      description: `Workspace ID: ${workspace.id}`,
                    });
                  }
                }
              }
            }
          }

          toast.success(`Workspace "${formData.name}" created successfully!`, {
            description: formData.members.length > 0
              ? `Workspace ready. ${invitedCount} invitation${invitedCount !== 1 ? 's' : ''} sent${skippedCount > 0 ? ` (${skippedCount} skipped)` : ''}.`
              : "Your workspace is ready to use",
          });

          if (onComplete) {
            onComplete();
          } else {
            router.push("/");
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to create workspace. Please try again.");
        }
      });
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

  // Real-time slug validation using Better Auth client
  const validateSlugAsync = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugError("");
      return;
    }

    setIsValidatingSlug(true);
    try {
      const { data } = await authClient.organization.checkSlug({
        slug: slug,
      });

      // data is available boolean
      setSlugError(data ? "" : "URL slug is already taken");
    } catch (error) {
      setSlugError("Failed to validate slug");
    } finally {
      setIsValidatingSlug(false);
    }
  };

  // Debounced slug validation
  const debouncedValidateSlug = React.useCallback(
    debounce(validateSlugAsync, 500),
    []
  );

  // For Step3Team
  const handleMembersChange = (members: any[]) => {
    updateData({ members });
  };

  // For Step4Tools
  const handleToolsChange = (tools: string[]) => {
    updateData({ tools });
  };

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
                onSlugChange={(slug) => {
                  updateData({ slug });
                  debouncedValidateSlug(slug);
                }}
                isValidatingSlug={isValidatingSlug}
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
            disabled={currentStep === 1 || isPending}
            className={cn(currentStep === 1 && "invisible")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
            disabled={isPending || !!slugError || (currentStep === 1 && !formData.name)}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                {currentStep === 5 ? "Create Workspace" : "Continue"}
                {currentStep !== 5 && <ChevronRight className="ml-2 h-4 w-4" />}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}