
import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Plus, 
  Trash2, 
  GripVertical, 
  Video, 
  Bold, 
  Italic, 
  List, 
  Type, 
  Info,
  ChevronLeft,
  Image as ImageIcon
} from "lucide-react";
import { DashboardBreadcrumb } from "@/components/dashboard/layouts/DashboardBreadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FileSelectionDialog } from "@/components/media/FileSelectionDialog";

// Mock data to pre-fill if editing
const MOCK_SOP_DATA = {
  id: "1",
  title: "New Client Onboarding Process",
  category: "Client Success",
  author: "Sarah Jenkins",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  description: "Standard procedure for onboarding new enterprise clients to the platform, ensuring all technical and administrative requirements are met.",
  steps: [
    {
      id: "s1",
      title: "Initial Account Configuration",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
      content: "The first step in onboarding a new client is to ensure their account is properly configured in the admin panel.\n\n• Verify the contract details in Salesforce matching the signed agreement.\n• Create the organization tenant in the Super Admin dashboard.\n• Set the user seat limit according to the plan.",
      note: "Do not activate the account until the billing method has been verified by the Finance team."
    },
    {
      id: "s2",
      title: "Welcome Email & Access Provisioning",
      imageUrl: "",
      content: "Once the technical setup is complete, we need to welcome the client and provide them with their initial access credentials.",
      note: ""
    }
  ]
};

export default function SopEditorPage() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute("/sop/:id/edit");
  const isEditing = !!match;

  // Form State
  const [title, setTitle] = useState(isEditing ? MOCK_SOP_DATA.title : "");
  const [category, setCategory] = useState(isEditing ? MOCK_SOP_DATA.category : "");
  const [author, setAuthor] = useState(isEditing ? MOCK_SOP_DATA.author : "");
  const [videoUrl, setVideoUrl] = useState(isEditing ? MOCK_SOP_DATA.videoUrl : "");
  const [description, setDescription] = useState(isEditing ? MOCK_SOP_DATA.description : "");
  
  const [steps, setSteps] = useState(isEditing ? MOCK_SOP_DATA.steps : [
    { id: "new-1", title: "", imageUrl: "", content: "", note: "" }
  ]);

  const addStep = () => {
    setSteps([...steps, { id: `new-${Date.now()}`, title: "", imageUrl: "", content: "", note: "" }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: string, field: string, value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;
    
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
  };

  return (
    <DashboardLayout 
      activeTool="sop"
      header={
        <DashboardPageHeader
          title={isEditing ? "Edit SOP" : "Create New SOP"}
          description={isEditing ? `Editing "${MOCK_SOP_DATA.title}"` : "Create a new standard operating procedure."}
          breadcrumbs={
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span className="hover:text-slate-900 cursor-pointer" onClick={() => setLocation("/sop")}>SOP Library</span>
              <span className="text-slate-300">/</span>
              {isEditing && (
                <>
                  <span className="hover:text-slate-900 cursor-pointer" onClick={() => setLocation(`/sop/${params.id}`)}>{MOCK_SOP_DATA.title}</span>
                  <span className="text-slate-300">/</span>
                </>
              )}
              <span className="text-slate-900 font-medium">Editor</span>
            </div>
          }
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setLocation(isEditing ? `/sop/${params.id}` : "/sop")}>
                Cancel
              </Button>
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setLocation(isEditing ? `/sop/${params.id}` : "/sop")}>
                <Save className="h-4 w-4" /> Save SOP
              </Button>
            </div>
          }
        />
      }
    >
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        
        {/* General Info Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">General Information</CardTitle>
            <CardDescription>Basic details about this procedure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. New Client Onboarding" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client Success">Client Success</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input 
                  id="author" 
                  placeholder="e.g. Sarah Jenkins" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video Walkthrough URL</Label>
                <div className="relative">
                  <Video className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    id="video" 
                    className="pl-9" 
                    placeholder="https://youtube.com/..." 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Brief summary of what this SOP covers..." 
                className="min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Steps Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Procedure Steps</h2>
            <Button onClick={addStep} variant="outline" className="gap-2 border-dashed">
              <Plus className="h-4 w-4" /> Add Step
            </Button>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={step.id} className="border-slate-200 dark:border-slate-800 shadow-sm relative group">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 rounded-l-lg flex items-center justify-center cursor-move text-slate-400 hover:text-slate-600">
                  <GripVertical className="h-4 w-4" />
                </div>
                
                <CardContent className="pl-12 pr-6 py-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                     <div className="flex-1 space-y-2">
                        <Label className="text-xs font-semibold uppercase text-slate-500">Step {index + 1} Title</Label>
                        <Input 
                          placeholder="e.g. Initial Account Setup" 
                          value={step.title} 
                          onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                          className="font-medium text-lg border-transparent px-0 h-auto focus-visible:ring-0 placeholder:font-normal"
                        />
                     </div>
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-red-600 -mr-2"
                      onClick={() => removeStep(step.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-1 p-1 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 w-fit">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500"><Bold className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500"><Italic className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500"><List className="h-3.5 w-3.5" /></Button>
                      <Separator orientation="vertical" className="h-4 mx-1" />
                      
                      <FileSelectionDialog 
                        trigger={
                          <Button variant={step.imageUrl ? "secondary" : "ghost"} size="icon" className={`h-7 w-7 ${step.imageUrl ? 'text-primary bg-primary/10' : 'text-slate-500'}`}>
                            <ImageIcon className="h-3.5 w-3.5" />
                          </Button>
                        }
                        onSelect={(file) => {
                          if (file.url) {
                            updateStep(step.id, 'imageUrl', file.url);
                          }
                        }}
                      />
                    </div>
                    
                    {step.imageUrl && (
                      <div className="relative group w-fit">
                        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 max-w-md">
                          <img src={step.imageUrl} alt="Step visual" className="max-h-[200px] w-auto object-cover" />
                        </div>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          onClick={() => updateStep(step.id, 'imageUrl', "")}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    <Textarea 
                      placeholder="Describe the actions required for this step..." 
                      className="min-h-[150px] resize-y"
                      value={step.content}
                      onChange={(e) => updateStep(step.id, 'content', e.target.value)}
                    />
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-md border border-amber-100 dark:border-amber-900/20">
                    <div className="flex items-start gap-3">
                      <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs font-medium text-amber-800 dark:text-amber-200 uppercase">Important Note (Optional)</Label>
                        <Input 
                          placeholder="Add a warning or helpful tip..." 
                          className="bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-sm text-slate-700 dark:text-slate-300 placeholder:text-amber-700/50"
                          value={step.note}
                          onChange={(e) => updateStep(step.id, 'note', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={addStep} variant="outline" className="w-full border-dashed py-8 text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5">
            <Plus className="h-5 w-5 mr-2" /> Add Next Step
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
