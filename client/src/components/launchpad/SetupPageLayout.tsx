import { ArrowLeft, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import videoThumbnail from '@assets/generated_images/video_thumbnail_for_setup_guide.png';

interface SetupPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function SetupPageLayout({ title, description, children, onComplete, isCompleted }: SetupPageLayoutProps) {
  const [, setLocation] = useLocation();

  return (
    <DashboardLayout
      activeTool="launchpad"
    >
      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex flex-col gap-2 mb-8">
          <Button 
            variant="ghost" 
            className="w-fit text-slate-500 hover:text-slate-900 pl-0 gap-2"
            onClick={() => setLocation("/launchpad")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Launchpad
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
            <p className="text-slate-500 mt-1">{description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
             {/* Configuration Form */}
             <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6">
                   {children}
                </CardContent>
             </Card>
          </div>

          {/* Instructions / Sidebar (1/3) */}
          <div className="space-y-6 sticky top-6">
             {/* Video Section */}
             <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-slate-900 group cursor-pointer ring-1 ring-slate-900/5">
               <img 
                 src={videoThumbnail} 
                 alt="Setup Guide Video" 
                 className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                   <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-lg pl-1">
                     <Play className="h-5 w-5 text-indigo-600 fill-indigo-600" />
                   </div>
                 </div>
               </div>
               <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-semibold text-lg">{title} Walkthrough</h3>
                  <p className="text-white/80 text-sm">Learn how to configure this feature in 2 minutes</p>
               </div>
             </div>

             <Card className="bg-slate-50 border-slate-200 shadow-sm">
                <CardContent className="p-6 space-y-4">
                   <h3 className="font-semibold text-slate-900">Next Steps</h3>
                   <div className="space-y-4">
                      <div className="flex gap-3">
                         <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-4 ring-white">1</div>
                         <div>
                            <p className="text-sm font-medium text-slate-900">Watch Tutorial</p>
                            <p className="text-xs text-slate-500 mt-0.5">Review the video guide to understand the requirements.</p>
                         </div>
                      </div>
                      <div className="flex gap-3">
                         <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-4 ring-white">2</div>
                         <div>
                            <p className="text-sm font-medium text-slate-900">Configure Settings</p>
                            <p className="text-xs text-slate-500 mt-0.5">Fill out the form on the left with your provider details.</p>
                         </div>
                      </div>
                      <div className="flex gap-3">
                         <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-4 ring-white">3</div>
                         <div>
                            <p className="text-sm font-medium text-slate-900">Verify Connection</p>
                            <p className="text-xs text-slate-500 mt-0.5">Test the integration to ensure everything is working.</p>
                         </div>
                      </div>
                   </div>
                   
                   {onComplete && (
                     <Button 
                       className={`w-full mt-4 ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                       onClick={onComplete}
                     >
                       {isCompleted ? (
                         <>
                           <CheckCircle2 className="mr-2 h-4 w-4" />
                           Setup Complete
                         </>
                       ) : (
                         "Mark as Complete"
                       )}
                     </Button>
                   )}
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
