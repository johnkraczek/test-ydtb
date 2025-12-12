
import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import DashboardLayout from "~/components/dashboard/Layout";
import { DashboardPageHeader } from "~/components/dashboard/headers/DashboardPageHeader";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  User,
  ChevronLeft,
  Share2,
  Download,
  Printer,
  FileText,
  AlertTriangle,
  Info,
  Lightbulb,
  AlertCircle
} from "lucide-react";
import { DashboardBreadcrumb } from "~/components/dashboard/layouts/DashboardBreadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "~/components/ui/dialog";

// Mock Data for the SOP Detail
const MOCK_SOP_DETAIL = {
  id: "1",
  title: "New Client Onboarding Process",
  category: "Client Success",
  status: "published",
  lastModified: "Oct 24, 2025",
  author: "Sarah Jenkins",
  description: "Standard procedure for onboarding new enterprise clients to the platform, ensuring all technical and administrative requirements are met.",
  videoThumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60",
  steps: [
    {
      id: "s1",
      title: "Initial Account Configuration",
      image: {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
        size: 'medium',
        align: 'center'
      },
      content: (
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          <p>
            The first step in onboarding a new client is to ensure their account is properly configured in the admin panel.
            This involves setting up the correct plan limits, enabling requested modules, and verifying the billing information.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Verify the contract details in Salesforce matching the signed agreement.</li>
            <li>Create the organization tenant in the Super Admin dashboard.</li>
            <li>Set the user seat limit according to the plan (Starter: 5, Pro: 20, Enterprise: Unlimited).</li>
            <li>Enable "SSO" and "Audit Logs" features if they are on the Enterprise plan.</li>
          </ul>
        </div>
      ),
      note: {
        title: "Important:",
        content: "Do not activate the account until the billing method has been verified by the Finance team.",
        color: "amber",
        icon: "warning"
      }
    },
    {
      id: "s2",
      title: "Welcome Email & Access Provisioning",
      image: {
        url: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&auto=format&fit=crop&q=60",
        size: 'medium',
        align: 'center'
      },
      content: (
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          <p>
            Once the technical setup is complete, we need to welcome the client and provide them with their initial access credentials.
          </p>
          <p>
            Use the "Enterprise Welcome" template in our email marketing tool. This template includes links to the documentation,
            support portal, and a calendar link for their kickoff call.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Generate a temporary admin password for the primary contact.</li>
            <li>Send the "Welcome Packet" email to the primary stakeholder.</li>
            <li>CC the Account Executive and the assigned Customer Success Manager.</li>
          </ol>
        </div>
      ),
      button: {
        text: "Open Email Templates",
        url: "#",
        color: "primary"
      }
    },
    {
      id: "s3",
      title: "Kickoff Call Scheduling",
      content: (
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          <p>
            The kickoff call is crucial for setting expectations and outlining the implementation timeline.
          </p>
          <p>
            Reach out to the client's project lead to find a suitable time for the 45-minute kickoff session.
            Ensure you have the "Implementation Deck" ready to customize for this meeting.
          </p>
        </div>
      )
    },
    {
      id: "s4",
      title: "Data Migration & Integration",
      content: (
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
          <p>
            Coordinate with the Solutions Engineering team to handle any data migration requirements.
            If the client needs to import data from a legacy system, request the "Data Import Template" be sent to them.
          </p>
        </div>
      )
    }
  ]
};

export default function SopDetailPage() {
  const [, params] = useRoute("/sop/:id");
  const [, setLocation] = useLocation();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const progress = Math.round((completedSteps.length / MOCK_SOP_DETAIL.steps.length) * 100);

  return (
    <DashboardLayout
      activeTool="sop"
      header={
        <DashboardPageHeader
          title={MOCK_SOP_DETAIL.title}
          description={
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {MOCK_SOP_DETAIL.author}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Updated {MOCK_SOP_DETAIL.lastModified}</span>
              <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200 font-normal">Published</Badge>
            </div>
          }
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" /> Print
              </Button>
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setLocation(params ? `/sop/${params.id}/edit` : "/sop")}>
                <FileText className="h-4 w-4" /> Edit SOP
              </Button>
            </div>
          }
          breadcrumbs={
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span className="hover:text-slate-900 cursor-pointer">SOP Library</span>
              <span className="text-slate-300">/</span>
              <span className="hover:text-slate-900 cursor-pointer">{MOCK_SOP_DETAIL.category}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-medium truncate max-w-[200px]">{MOCK_SOP_DETAIL.title}</span>
            </div>
          }
        />
      }
    >
      <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">

        {/* Left Column - Steps Content (2/3) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {MOCK_SOP_DETAIL.description}
            </p>
          </div>

          <Separator />

          <div className="space-y-10">
            {MOCK_SOP_DETAIL.steps.map((step, index) => (
              <div key={step.id} id={`step-${step.id}`} className="scroll-mt-24 group">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border transition-colors ${completedSteps.includes(step.id)
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}>
                    {completedSteps.includes(step.id) ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-semibold ${completedSteps.includes(step.id) ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>
                        {step.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs h-7 ${completedSteps.includes(step.id) ? 'text-primary hover:text-primary hover:bg-primary/10' : 'text-slate-400 hover:text-slate-600'}`}
                        onClick={() => toggleStep(step.id)}
                      >
                        {completedSteps.includes(step.id) ? "Mark Incomplete" : "Mark Complete"}
                      </Button>
                    </div>

                    <div className={`transition-opacity duration-300 ${completedSteps.includes(step.id) ? 'opacity-50' : 'opacity-100'}`}>
                      {step.image?.url && (
                        <div className={`mb-4 flex ${step.image.align === 'center' ? 'justify-center' :
                            step.image.align === 'right' ? 'justify-end' : 'justify-start'
                          }`}>
                          <div className={`rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 ${step.image.size === 'small' ? 'max-w-xs' :
                              step.image.size === 'medium' ? 'max-w-md' :
                                step.image.size === 'large' ? 'max-w-3xl' : 'w-full'
                            }`}>
                            <img src={step.image.url} alt={step.title} className="w-full h-auto object-cover" />
                          </div>
                        </div>
                      )}

                      {step.content}

                      {step.note && (
                        <div
                          className={`mt-4 p-4 rounded-md border text-sm flex gap-3 ${step.note.color === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' :
                              step.note.color === 'red' ? 'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300' :
                                step.note.color === 'green' ? 'bg-green-50 border-green-100 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' :
                                  step.note.color === 'amber' ? 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300' :
                                    '' // Custom handled via style
                            }`}
                          style={step.note.color === 'custom' ? {
                            backgroundColor: `${step.note.customColor}15`,
                            borderColor: `${step.note.customColor}40`,
                            color: step.note.customColor
                          } : undefined}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {step.note.icon === 'info' && <Info className="h-4 w-4" />}
                            {step.note.icon === 'warning' && <AlertTriangle className="h-4 w-4" />}
                            {step.note.icon === 'tip' && <Lightbulb className="h-4 w-4" />}
                            {step.note.icon === 'alert' && <AlertCircle className="h-4 w-4" />}
                          </div>
                          <div>
                            <span className="font-semibold block mb-0.5">{step.note.title}</span>
                            {step.note.content}
                          </div>
                        </div>
                      )}

                      {step.button && (
                        <div className="mt-4">
                          <Button
                            variant={step.button.color === 'custom' ? 'default' : step.button.color as any}
                            className="gap-2"
                            onClick={() => window.open(step.button.url, '_blank')}
                            style={step.button.color === 'custom' ? {
                              backgroundColor: step.button.customColor,
                              borderColor: step.button.customColor,
                            } : undefined}
                          >
                            {step.button.text}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {index < MOCK_SOP_DETAIL.steps.length - 1 && (
                  <div className="ml-4 pl-8 border-l border-slate-200 dark:border-slate-800 h-8 my-2" />
                )}
              </div>
            ))}
          </div>

          <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 mt-12">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Procedure Completed</h3>
              <p className="text-slate-500 max-w-md">
                You've reached the end of this SOP. Great job following the process!
              </p>
              <Button className="mt-4 bg-primary hover:bg-primary/90">
                Return to Library
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Video & TOC (1/3) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Video Card */}
          <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
            <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
              <DialogTrigger asChild>
                <div className="aspect-video relative bg-slate-900 group cursor-pointer">
                  <img
                    src={MOCK_SOP_DETAIL.videoThumbnail}
                    alt="SOP Walkthrough"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center pl-1 shadow-lg">
                        <Play className="h-5 w-5 text-primary fill-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs font-medium text-white backdrop-blur-md">
                    4:32
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-slate-800">
                <DialogHeader className="hidden">
                  <DialogTitle>Video Walkthrough</DialogTitle>
                  <DialogDescription>Watch the full video guide</DialogDescription>
                </DialogHeader>
                <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                  {/* In a real app, this would be a video player component */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={MOCK_SOP_DETAIL.videoThumbnail}
                      alt="Video Player Placeholder"
                      className="w-full h-full object-contain opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center pl-1 shadow-lg cursor-pointer hover:scale-105 transition-transform">
                          <Play className="h-8 w-8 text-primary fill-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-medium">Video Walkthrough</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm text-slate-500">
              Watch Sarah explain the nuances of the enterprise onboarding flow and common pitfalls to avoid.
            </CardContent>

            <Separator />

            {/* Progress & TOC */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
                <span className="text-xs font-medium text-slate-500">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Steps Checklist</h4>
              <div className="space-y-3">
                {MOCK_SOP_DETAIL.steps.map((step, i) => (
                  <div
                    key={step.id}
                    onClick={() => {
                      document.getElementById(`step-${step.id}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <div
                      className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors ${completedSteps.includes(step.id)
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-primary/50"
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStep(step.id);
                      }}
                    >
                      {completedSteps.includes(step.id) && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <span className={`text-sm leading-tight transition-colors ${completedSteps.includes(step.id) ? "text-slate-400 line-through" : "text-slate-600 dark:text-slate-300 group-hover:text-primary"
                      }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
