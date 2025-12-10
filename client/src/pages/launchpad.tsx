
import { useTheme } from "next-themes";
import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Mail, 
  Bot, 
  Palette, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Settings,
  Rocket,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Badge } from "@/components/ui/badge";

interface SetupTask {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  actionLabel: string;
  actionUrl?: string; // In a real app this would link to settings
  type: "link" | "color-picker" | "mode-picker" | "integration";
}

export default function LaunchpadPage() {
  const { themeColor, setThemeColor } = useThemeColor();
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();
  
  // Mock state for completed tasks
  const [tasks, setTasks] = useState<SetupTask[]>([
    {
      id: "theme",
      title: "Customize Theme",
      description: "Choose a primary color for your workspace to match your brand.",
      icon: Palette,
      completed: true, // Considered completed if they interacted, but for now just static
      actionLabel: "Customize",
      type: "color-picker"
    },
    {
      id: "mode",
      title: "Customize Mode",
      description: "Choose between light, dark, or system appearance.",
      icon: Monitor,
      completed: true,
      actionLabel: "Customize",
      type: "mode-picker"
    },
    {
      id: "payment",
      title: "Connect Payment Processor",
      description: "Set up Stripe or PayPal to start accepting payments from your customers.",
      icon: CreditCard,
      completed: false,
      actionLabel: "Connect Payments",
      actionUrl: "/launchpad/payment",
      type: "integration"
    },
    {
      id: "email",
      title: "Connect Email Provider",
      description: "Link your email service (Gmail, Outlook, etc.) to send automated messages.",
      icon: Mail,
      completed: true,
      actionLabel: "Manage Email",
      actionUrl: "/launchpad/email",
      type: "integration"
    },
    {
      id: "ai",
      title: "Connect AI Provider",
      description: "Configure OpenAI or Anthropic API keys to enable AI features.",
      icon: Bot,
      completed: false,
      actionLabel: "Setup AI",
      type: "integration"
    }
  ]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAction = (task: SetupTask) => {
    if (task.type === "color-picker" || task.type === "mode-picker") {
        toggleTask(task.id);
    } else if (task.actionUrl) {
        setLocation(task.actionUrl);
    } else {
        toggleTask(task.id);
    }
  };

  return (
    <DashboardLayout 
      activeTool="launchpad"
      header={
        <DashboardPageHeader
          title="Launchpad"
          description="Get your workspace ready for action."
        />
      }
    >
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Progress Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary-foreground/80 font-medium text-sm uppercase tracking-wider">
                <Rocket className="h-4 w-4" />
                Setup Progress
              </div>
              <h2 className="text-3xl font-bold">
                {progress === 100 ? "All Systems Go!" : `${completedCount} of ${tasks.length} tasks completed`}
              </h2>
              <p className="text-primary-foreground/80 max-w-md">
                {progress === 100 
                  ? "Your workspace is fully configured and ready to scale." 
                  : "Complete these steps to unlock the full potential of your dashboard."}
              </p>
            </div>
            
            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3 bg-primary-foreground/20 [&>div]:bg-primary-foreground" />
            </div>
          </div>
          
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className={`border transition-all duration-300 ${task.completed ? 'bg-slate-50/50 border-slate-200/60' : 'bg-white border-slate-200 hover:border-primary/50 hover:shadow-sm'}`}>
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                
                {/* Icon & Status */}
                <div className="flex-shrink-0 relative">
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${task.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                    <task.icon className="h-7 w-7" />
                  </div>
                  {task.completed && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-600 fill-green-100" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold text-lg ${task.completed ? 'text-slate-700' : 'text-slate-900'}`}>{task.title}</h3>
                    {task.completed && <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-[10px] px-1.5 py-0 h-5">Completed</Badge>}
                  </div>
                  <p className="text-slate-500 text-sm">{task.description}</p>
                  
                  {/* Specific controls for Color Picker */}
                  {task.type === "color-picker" && !task.completed && (
                    <div className="flex gap-2 mt-3 pt-2">
                      {[
                        { name: 'zinc', class: 'bg-zinc-900' },
                        { name: 'red', class: 'bg-red-600' },
                        { name: 'rose', class: 'bg-rose-600' },
                        { name: 'orange', class: 'bg-orange-500' },
                        { name: 'green', class: 'bg-green-600' },
                        { name: 'blue', class: 'bg-blue-600' },
                        { name: 'yellow', class: 'bg-yellow-500' },
                        { name: 'violet', class: 'bg-violet-600' }
                      ].map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setThemeColor(color.name as any)}
                          className={`h-6 w-6 rounded-full border border-slate-200 transition-transform hover:scale-110 ${color.class} ${
                            themeColor === color.name ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  )}

                  {/* Specific controls for Mode Picker */}
                  {task.type === "mode-picker" && !task.completed && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div 
                        className={`cursor-pointer rounded-lg border-2 p-1 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                        onClick={() => setTheme('light')}
                      >
                        <div className="bg-slate-100 rounded-md h-16 w-full border border-slate-200 relative overflow-hidden flex">
                           <div className="w-6 bg-white border-r border-slate-200 h-full flex flex-col items-center gap-1 pt-2">
                              <div className="w-3 h-3 bg-primary rounded-sm" />
                              <div className="w-3 h-3 bg-slate-200 rounded-sm" />
                           </div>
                           <div className="flex-1 bg-white p-2">
                              <div className="w-12 h-2 bg-slate-200 rounded mb-2" />
                              <div className="w-8 h-2 bg-primary/20 rounded" />
                           </div>
                        </div>
                        <div className="mt-2 text-center text-xs font-medium text-slate-700 dark:text-slate-300">Light</div>
                      </div>

                      <div 
                        className={`cursor-pointer rounded-lg border-2 p-1 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                        onClick={() => setTheme('dark')}
                      >
                        <div className="bg-slate-900 rounded-md h-16 w-full border border-slate-800 relative overflow-hidden flex">
                           <div className="w-6 bg-slate-800 border-r border-slate-700 h-full flex flex-col items-center gap-1 pt-2">
                              <div className="w-3 h-3 bg-primary rounded-sm" />
                              <div className="w-3 h-3 bg-slate-700 rounded-sm" />
                           </div>
                           <div className="flex-1 bg-slate-900 p-2">
                              <div className="w-12 h-2 bg-slate-700 rounded mb-2" />
                              <div className="w-8 h-2 bg-primary/30 rounded" />
                           </div>
                        </div>
                        <div className="mt-2 text-center text-xs font-medium text-slate-700 dark:text-slate-300">Dark</div>
                      </div>

                      <div 
                        className={`cursor-pointer rounded-lg border-2 p-1 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                        onClick={() => setTheme('system')}
                      >
                         <div className="rounded-md h-16 w-full border border-slate-200 dark:border-slate-700 relative overflow-hidden flex">
                           <div className="w-1/2 bg-white h-full flex">
                              <div className="w-3 bg-slate-50 border-r border-slate-100 h-full flex flex-col items-center gap-1 pt-2">
                                 <div className="w-1.5 h-1.5 bg-primary rounded-[1px]" />
                              </div>
                              <div className="flex-1 p-1">
                                 <div className="w-4 h-1 bg-slate-200 rounded mb-1" />
                              </div>
                           </div>
                           <div className="w-1/2 bg-slate-900 h-full flex">
                              <div className="w-3 bg-slate-800 border-r border-slate-700 h-full flex flex-col items-center gap-1 pt-2">
                                 <div className="w-1.5 h-1.5 bg-primary rounded-[1px]" />
                              </div>
                              <div className="flex-1 p-1">
                                 <div className="w-4 h-1 bg-slate-700 rounded mb-1" />
                              </div>
                           </div>
                        </div>
                        <div className="mt-2 text-center text-xs font-medium text-slate-700 dark:text-slate-300">Auto</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="flex-shrink-0">
                  {task.type === "color-picker" || task.type === "mode-picker" ? (
                    <Button 
                      variant={task.completed ? "outline" : "default"}
                      onClick={() => handleAction(task)}
                      className={task.completed ? "bg-white" : "bg-primary hover:bg-primary/90"}
                    >
                      {task.completed ? (task.type === "color-picker" ? "Change Color" : "Change Mode") : "Save Changes"}
                    </Button>
                  ) : (
                    <Button 
                      variant={task.completed ? "outline" : "default"}
                      className={`gap-2 min-w-[140px] ${task.completed ? 'bg-white text-slate-600' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                      onClick={() => handleAction(task)}
                    >
                      {task.completed ? (
                         <>Manage <Settings className="h-3.5 w-3.5" /></>
                      ) : (
                         <>{task.actionLabel} <ArrowRight className="h-3.5 w-3.5" /></>
                      )}
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Help / Support Link */}
        <div className="text-center pt-8 pb-4">
            <p className="text-sm text-slate-500">
                Need help getting set up? <a href="#" className="text-primary font-medium hover:underline inline-flex items-center gap-1">Read the setup guide <ExternalLink className="h-3 w-3" /></a>
            </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
