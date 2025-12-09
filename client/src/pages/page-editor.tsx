
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRoute } from "wouter";
import { 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Undo, 
  Redo, 
  Save, 
  Eye, 
  Plus, 
  Image as ImageIcon,
  Type,
  Layout,
  MousePointer2,
  Settings,
  X
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PageEditor() {
  const [, params] = useRoute("/pages/:id/edit");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* Editor Header */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Home Page</span>
            <span className="text-[10px] text-slate-500">Last saved 2 mins ago</span>
          </div>
        </div>

        {/* Device Toggles */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-7 w-7 p-0 ${device === "desktop" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}
                onClick={() => setDevice("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Desktop</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-7 w-7 p-0 ${device === "tablet" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}
                onClick={() => setDevice("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tablet</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-7 w-7 p-0 ${device === "mobile" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}
                onClick={() => setDevice("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mobile</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2 border-r border-slate-200 pr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>
          <Button size="sm" className="h-8 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Elements */}
        <div className="w-14 lg:w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              {/* Categories (Desktop) */}
              <div className="hidden lg:block p-4 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Basic</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <DraggableElement icon={Layout} label="Section" />
                    <DraggableElement icon={Type} label="Heading" />
                    <DraggableElement icon={Type} label="Text" />
                    <DraggableElement icon={ImageIcon} label="Image" />
                    <DraggableElement icon={MousePointer2} label="Button" />
                    <DraggableElement icon={Layout} label="Container" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Components</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <DraggableElement icon={Layout} label="Navbar" />
                    <DraggableElement icon={Layout} label="Hero" />
                    <DraggableElement icon={Layout} label="Features" />
                    <DraggableElement icon={Layout} label="Footer" />
                  </div>
                </div>
              </div>

              {/* Icon Only (Collapsed/Mobile) */}
              <div className="lg:hidden flex flex-col items-center py-4 gap-4">
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500"><Plus className="h-5 w-5" /></Button>
                   </TooltipTrigger>
                   <TooltipContent side="right">Add Elements</TooltipContent>
                 </Tooltip>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500"><ImageIcon className="h-5 w-5" /></Button>
                   </TooltipTrigger>
                   <TooltipContent side="right">Media</TooltipContent>
                 </Tooltip>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500"><Settings className="h-5 w-5" /></Button>
                   </TooltipTrigger>
                   <TooltipContent side="right">Settings</TooltipContent>
                 </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-100/50 dark:bg-slate-950 p-8 overflow-auto flex justify-center items-start">
           <div 
             className={`bg-white shadow-lg transition-all duration-300 min-h-[800px] flex flex-col ${
               device === 'mobile' ? 'w-[375px]' : 
               device === 'tablet' ? 'w-[768px]' : 
               'w-full max-w-[1200px]'
             }`}
           >
              {/* Mock Page Content */}
              <div className="border-b border-dashed border-slate-200 p-8 hover:ring-2 hover:ring-indigo-500/20 hover:bg-slate-50/50 relative group cursor-default">
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1">
                     <Button size="icon" variant="secondary" className="h-6 w-6"><Settings className="h-3 w-3" /></Button>
                     <Button size="icon" variant="destructive" className="h-6 w-6"><X className="h-3 w-3" /></Button>
                  </div>
                  <nav className="flex items-center justify-between">
                      <div className="font-bold text-xl text-slate-900">Logo</div>
                      <div className="flex gap-6 text-sm font-medium text-slate-600">
                          <span>Home</span>
                          <span>About</span>
                          <span>Services</span>
                          <span>Contact</span>
                      </div>
                      <Button>Get Started</Button>
                  </nav>
              </div>

              <div className="border-b border-dashed border-slate-200 py-20 px-8 text-center hover:ring-2 hover:ring-indigo-500/20 hover:bg-slate-50/50 relative group cursor-default">
                   <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1">
                     <Button size="icon" variant="secondary" className="h-6 w-6"><Settings className="h-3 w-3" /></Button>
                     <Button size="icon" variant="destructive" className="h-6 w-6"><X className="h-3 w-3" /></Button>
                  </div>
                  <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Build something amazing</h1>
                  <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">Create beautiful websites in minutes with our drag-and-drop builder. No coding required.</p>
                  <div className="flex justify-center gap-4">
                      <Button size="lg" className="h-12 px-8 text-base">Start Building</Button>
                      <Button size="lg" variant="outline" className="h-12 px-8 text-base">Learn More</Button>
                  </div>
              </div>

              <div className="border-b border-dashed border-slate-200 py-20 px-8 hover:ring-2 hover:ring-indigo-500/20 hover:bg-slate-50/50 relative group cursor-default">
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1">
                     <Button size="icon" variant="secondary" className="h-6 w-6"><Settings className="h-3 w-3" /></Button>
                     <Button size="icon" variant="destructive" className="h-6 w-6"><X className="h-3 w-3" /></Button>
                  </div>
                  <div className="grid grid-cols-3 gap-8">
                      <div className="text-center p-6 rounded-xl bg-slate-50">
                          <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <Layout className="h-6 w-6" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Drag & Drop</h3>
                          <p className="text-slate-600">Easily move elements around to create your perfect layout.</p>
                      </div>
                      <div className="text-center p-6 rounded-xl bg-slate-50">
                          <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <Smartphone className="h-6 w-6" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Responsive</h3>
                          <p className="text-slate-600">Your site looks great on all devices automatically.</p>
                      </div>
                      <div className="text-center p-6 rounded-xl bg-slate-50">
                          <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <Zap className="h-6 w-6" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Fast Performance</h3>
                          <p className="text-slate-600">Optimized for speed to give your visitors the best experience.</p>
                      </div>
                  </div>
              </div>
           </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-sm">Properties</h3>
            </div>
            <div className="p-4 space-y-4">
                <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-full bg-white border border-slate-200 cursor-pointer ring-2 ring-offset-2 ring-indigo-500"></div>
                        <div className="h-8 w-8 rounded-full bg-slate-100 cursor-pointer"></div>
                        <div className="h-8 w-8 rounded-full bg-slate-900 cursor-pointer"></div>
                        <div className="h-8 w-8 rounded-full bg-indigo-600 cursor-pointer"></div>
                    </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                    <Label>Typography</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="justify-start font-normal">Inter</Button>
                        <Button variant="outline" size="sm" className="justify-start font-normal">Regular</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Spacing</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Top" className="text-xs" />
                        <Input placeholder="Bottom" className="text-xs" />
                        <Input placeholder="Left" className="text-xs" />
                        <Input placeholder="Right" className="text-xs" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function DraggableElement({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-500 hover:text-indigo-600 cursor-grab active:cursor-grabbing transition-all hover:shadow-sm group">
      <Icon className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
      <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-600">{label}</span>
    </div>
  );
}

import { Zap } from "lucide-react";
