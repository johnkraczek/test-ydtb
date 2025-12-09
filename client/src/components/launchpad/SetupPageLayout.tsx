import { ArrowLeft, Play, CheckCircle2, ChevronRight, ChevronLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import videoThumbnail from '@assets/generated_images/video_thumbnail_for_setup_guide.png';
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SetupPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function SetupPageLayout({ title, description, children, onComplete, isCompleted }: SetupPageLayoutProps) {
  const [, setLocation] = useLocation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <DashboardLayout
      activeTool="launchpad"
      header={
        <div className="flex flex-col gap-4 mb-6">
          <Button 
            variant="ghost" 
            className="w-fit text-slate-500 hover:text-slate-900 pl-0 gap-2"
            onClick={() => setLocation("/launchpad")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Launchpad
          </Button>
          <DashboardPageHeader
            title={title}
            description={description}
          />
        </div>
      }
    >
      <div className="flex h-[calc(100vh-200px)] gap-6 relative overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pr-2 pb-12">
           <Card>
              <CardContent className="p-6">
                 {children}
              </CardContent>
           </Card>

           {/* Completion Action (Main Area) */}
           {onComplete && (
             <div className="mt-6 flex justify-end">
                <Button 
                  size="lg"
                  className={isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}
                  onClick={onComplete}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Setup Complete
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </Button>
             </div>
           )}
        </div>

        {/* Right Help Panel */}
        <div 
            className={cn(
                "absolute top-0 right-0 bottom-0 border-l border-slate-200 shadow-xl transition-all duration-300 ease-in-out z-20 flex flex-col rounded-l-2xl",
                isHelpOpen ? "w-[400px] translate-x-0 bg-slate-50" : "w-[400px] translate-x-[360px] cursor-pointer hover:bg-indigo-700 bg-indigo-600 border-none"
            )}
            onClick={() => !isHelpOpen && setIsHelpOpen(true)}
        >
            {/* Toggle Handle */}
            <div 
                className={cn(
                    "absolute top-1/2 -left-3 -mt-6 border shadow-md rounded-full p-1 cursor-pointer z-30 transition-colors",
                    isHelpOpen ? "bg-white border-slate-200 hover:bg-slate-50" : "bg-white border-indigo-500 text-indigo-600"
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsHelpOpen(!isHelpOpen);
                }}
            >
                {isHelpOpen ? <ChevronRight className="h-4 w-4 text-slate-600" /> : <ChevronLeft className="h-4 w-4 text-indigo-600" />}
            </div>

            {/* Collapsed State Indicator (Peek) */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-10 flex flex-col items-center pt-8 transition-opacity duration-200",
                isHelpOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                 <div className="rotate-90 origin-center whitespace-nowrap font-medium text-white text-sm tracking-wide flex items-center gap-2 mt-12">
                    <HelpCircle className="h-4 w-4 text-white/80" />
                    Video Guide & Instructions
                 </div>
            </div>

            {/* Expanded Content */}
            <div className={cn(
                "flex-1 overflow-y-auto p-6 space-y-6 transition-all duration-200",
                isHelpOpen ? "opacity-100 visible" : "opacity-0 invisible"
            )}>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-slate-900">Setup Guide</h3>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setIsHelpOpen(false); }}>Close</Button>
                </div>

                {/* Video */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-slate-900 group cursor-pointer">
                  <img 
                    src={videoThumbnail} 
                    alt="Setup Guide Video" 
                    className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-lg pl-0.5">
                        <Play className="h-4 w-4 text-indigo-600 fill-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                   <h4 className="font-medium text-slate-900">Step-by-Step Instructions</h4>
                   <div className="space-y-4 relative">
                      {/* Connector Line */}
                      <div className="absolute left-3 top-2 bottom-4 w-0.5 bg-slate-200"></div>

                      <div className="flex gap-4 relative">
                         <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold ring-4 ring-slate-50 z-10">1</div>
                         <div className="pt-0.5">
                            <p className="font-medium text-sm text-slate-900">Watch the tutorial</p>
                            <p className="text-sm text-slate-500 mt-1">Review the video guide above to understand the requirements.</p>
                         </div>
                      </div>
                      
                      <div className="flex gap-4 relative">
                         <div className="h-6 w-6 rounded-full bg-white border-2 border-slate-300 text-slate-500 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-4 ring-slate-50 z-10">2</div>
                         <div className="pt-0.5">
                            <p className="font-medium text-sm text-slate-900">Configure settings</p>
                            <p className="text-sm text-slate-500 mt-1">Enter your API keys or credentials in the form on the left.</p>
                         </div>
                      </div>

                      <div className="flex gap-4 relative">
                         <div className="h-6 w-6 rounded-full bg-white border-2 border-slate-300 text-slate-500 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-4 ring-slate-50 z-10">3</div>
                         <div className="pt-0.5">
                            <p className="font-medium text-sm text-slate-900">Verify connection</p>
                            <p className="text-sm text-slate-500 mt-1">Click the connect button to test your integration.</p>
                         </div>
                      </div>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
