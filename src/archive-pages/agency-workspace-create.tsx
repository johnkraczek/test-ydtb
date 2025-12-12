import { useState } from "react";
import DashboardLayout from "~/components/dashboard/Layout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ArrowLeft, Check, ChevronRight, LayoutTemplate, Building, User, CreditCard } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "~/lib/utils";
import { useToast } from "~/hooks/use-toast";

const STEPS = [
  { id: 1, title: "General Info", description: "Business details", icon: Building },
  { id: 2, title: "Account Owner", description: "User setup", icon: User },
  { id: 3, title: "Template", description: "Initial settings", icon: LayoutTemplate },
  { id: 4, title: "Review", description: "Confirm details", icon: Check },
];

const TEMPLATES = [
  { id: "blank", name: "Blank Workspace", description: "Start from scratch with default settings" },
  { id: "med-spa", name: "Medical Spa Starter", description: "Complete setup for Med Spas" },
  { id: "real-estate", name: "Real Estate Lead Gen", description: "Optimized for real estate agents" },
  { id: "restaurant", name: "Restaurant Reservation", description: "Reservation management system" },
];

export default function AgencyWorkspaceCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    templateId: "blank"
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit form
      toast({
        title: "Workspace Created",
        description: `${formData.businessName} has been successfully created.`,
      });
      setLocation("/agency/workspaces");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setLocation("/agency/workspaces");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.address && formData.city && formData.state && formData.zip && formData.country;
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 3:
        return !!formData.templateId;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <DashboardLayout
      mode="agency"
      activeTool="agency-workspaces"
      header={
        <div className="flex items-center gap-4 px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit -ml-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            onClick={() => setLocation("/agency/workspaces")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workspaces
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create New Workspace</h1>
        </div>
      }
    >
      <div className="max-w-[1000px] mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Steps</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="relative">
                  {/* Vertical line connecting steps */}
                  <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800" />

                  <div className="space-y-8 relative">
                    {STEPS.map((step) => {
                      const isActive = step.id === currentStep;
                      const isCompleted = step.id < currentStep;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.id} className="flex items-start gap-4">
                          <div
                            className={cn(
                              "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-200",
                              isActive ? "border-primary bg-primary text-primary-foreground" :
                                isCompleted ? "border-primary bg-primary text-primary-foreground" :
                                  "border-slate-200 bg-white text-slate-400 dark:border-slate-800 dark:bg-slate-950"
                            )}
                          >
                            {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                          </div>
                          <div className="pt-1">
                            <p className={cn(
                              "text-sm font-medium leading-none",
                              isActive ? "text-primary" :
                                isCompleted ? "text-slate-900 dark:text-slate-100" :
                                  "text-slate-500 dark:text-slate-400"
                            )}>
                              {step.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Enter the business details for the new workspace."}
                  {currentStep === 2 && "Set up the primary account owner for this workspace."}
                  {currentStep === 3 && "Choose a starting template to pre-configure settings."}
                  {currentStep === 4 && "Review all information before creating the workspace."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 min-h-[400px]">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="businessName"
                        placeholder="e.g. Acme Corp"
                        value={formData.businessName}
                        onChange={(e) => updateFormData("businessName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        value={formData.address}
                        onChange={(e) => updateFormData("address", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                        <Input
                          id="city"
                          placeholder="San Francisco"
                          value={formData.city}
                          onChange={(e) => updateFormData("city", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State / Province <span className="text-red-500">*</span></Label>
                        <Input
                          id="state"
                          placeholder="CA"
                          value={formData.state}
                          onChange={(e) => updateFormData("state", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zip">Zip / Postal Code <span className="text-red-500">*</span></Label>
                        <Input
                          id="zip"
                          placeholder="94105"
                          value={formData.zip}
                          onChange={(e) => updateFormData("zip", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => updateFormData("country", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => updateFormData("firstName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => updateFormData("lastName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TEMPLATES.map((template) => (
                      <div
                        key={template.id}
                        className={cn(
                          "cursor-pointer rounded-lg border p-4 hover:border-primary transition-all duration-200",
                          formData.templateId === template.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 dark:border-slate-800"
                        )}
                        onClick={() => updateFormData("templateId", template.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            formData.templateId === template.id ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                          )}>
                            <LayoutTemplate className="h-5 w-5" />
                          </div>
                          {formData.templateId === template.id && (
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                      <h3 className="font-semibold text-sm mb-3 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Building className="h-4 w-4 text-slate-500" />
                        Business Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Business Name</p>
                          <p className="font-medium">{formData.businessName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Address</p>
                          <p className="font-medium">{formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Country</p>
                          <p className="font-medium">{formData.country}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                      <h3 className="font-semibold text-sm mb-3 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500" />
                        Account Owner
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{formData.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                      <h3 className="font-semibold text-sm mb-3 text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <LayoutTemplate className="h-4 w-4 text-slate-500" />
                        Selected Template
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                          <LayoutTemplate className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {TEMPLATES.find(t => t.id === formData.templateId)?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {TEMPLATES.find(t => t.id === formData.templateId)?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <Button variant="outline" onClick={handleBack}>
                  {currentStep === 1 ? "Cancel" : "Back"}
                </Button>
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  {currentStep === 4 ? "Create Workspace" : "Continue"}
                  {currentStep !== 4 && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
