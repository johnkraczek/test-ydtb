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
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Video Section */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-slate-900 group cursor-pointer">
          <img 
            src={videoThumbnail} 
            alt="Setup Guide Video" 
            className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center shadow-lg pl-1">
                <Play className="h-6 w-6 text-indigo-600 fill-indigo-600" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
             <h3 className="text-white font-semibold text-lg">{title} Walkthrough</h3>
             <p className="text-white/80 text-sm">Learn how to configure this feature in 2 minutes</p>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
             <Card>
                <CardContent className="p-6">
                   {children}
                </CardContent>
             </Card>
          </div>

          <div className="space-y-6">
             <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-6 space-y-4">
                   <h3 className="font-semibold text-slate-900">Next Steps</h3>
                   <div className="space-y-3">
                      <div className="flex gap-3">
                         <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                         <p className="text-sm text-slate-600">Watch the tutorial video above</p>
                      </div>
                      <div className="flex gap-3">
                         <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                         <p className="text-sm text-slate-600">Enter your configuration details</p>
                      </div>
                      <div className="flex gap-3">
                         <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                         <p className="text-sm text-slate-600">Verify the connection</p>
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
