
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
  Image as ImageIcon,
  MoreVertical,
  Link as LinkIcon,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize
} from "lucide-react";
import { DashboardBreadcrumb } from "@/components/dashboard/layouts/DashboardBreadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FileSelectionDialog } from "@/components/media/FileSelectionDialog";

// Types for our SOP structure
type ImageSettings = {
  url: string;
  size: 'small' | 'medium' | 'large' | 'full';
  align: 'left' | 'center' | 'right';
};

type StepNote = {
  title: string;
  content: string;
  color: 'blue' | 'amber' | 'red' | 'green';
  icon: 'info' | 'warning' | 'tip' | 'alert';
};

type StepButton = {
  text: string;
  url: string;
  color: 'primary' | 'secondary' | 'outline' | 'destructive';
};

interface SopStep {
  id: string;
  title: string;
  content: string;
  image?: ImageSettings;
  note?: StepNote;
  button?: StepButton;
}

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
      image: {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
        size: 'medium',
        align: 'center'
      } as ImageSettings,
      content: "The first step in onboarding a new client is to ensure their account is properly configured in the admin panel.\n\n• Verify the contract details in Salesforce matching the signed agreement.\n• Create the organization tenant in the Super Admin dashboard.\n• Set the user seat limit according to the plan.",
      note: {
        title: "Important:",
        content: "Do not activate the account until the billing method has been verified by the Finance team.",
        color: "amber",
        icon: "warning"
      } as StepNote
    },
    {
      id: "s2",
      title: "Welcome Email & Access Provisioning",
      image: {
        url: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&auto=format&fit=crop&q=60",
        size: 'medium',
        align: 'center'
      } as ImageSettings,
      content: "Once the technical setup is complete, we need to welcome the client and provide them with their initial access credentials.",
      button: {
        text: "Open Email Templates",
        url: "/templates/welcome",
        color: "primary"
      } as StepButton
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
  
  const [steps, setSteps] = useState<SopStep[]>(isEditing ? MOCK_SOP_DATA.steps : [
    { id: "new-1", title: "", content: "" }
  ]);

  const addStep = () => {
    setSteps([...steps, { id: `new-${Date.now()}`, title: "", content: "" }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: string, field: keyof SopStep, value: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateStepImage = (id: string, field: keyof ImageSettings, value: any) => {
    setSteps(steps.map(s => {
      if (s.id !== id) return s;
      const currentImage = s.image || { url: '', size: 'medium', align: 'center' };
      return { ...s, image: { ...currentImage, [field]: value } };
    }));
  };

  const updateStepNote = (id: string, field: keyof StepNote, value: any) => {
    setSteps(steps.map(s => {
      if (s.id !== id) return s;
      const currentNote = s.note || { title: 'Note:', content: '', color: 'amber', icon: 'info' };
      return { ...s, note: { ...currentNote, [field]: value } };
    }));
  };

  const updateStepButton = (id: string, field: keyof StepButton, value: any) => {
    setSteps(steps.map(s => {
      if (s.id !== id) return s;
      const currentButton = s.button || { text: 'Click Here', url: '', color: 'primary' };
      return { ...s, button: { ...currentButton, [field]: value } };
    }));
  };

  const addDetailToStep = (id: string, type: 'note' | 'button') => {
    setSteps(steps.map(s => {
      if (s.id !== id) return s;
      if (type === 'note' && !s.note) {
        return { ...s, note: { title: 'Note:', content: '', color: 'amber', icon: 'info' } };
      }
      if (type === 'button' && !s.button) {
        return { ...s, button: { text: 'Action Button', url: '', color: 'primary' } };
      }
      return s;
    }));
  };

  const removeDetailFromStep = (id: string, type: 'note' | 'button') => {
    setSteps(steps.map(s => {
      if (s.id !== id) return s;
      const newStep = { ...s };
      if (type === 'note') delete newStep.note;
      if (type === 'button') delete newStep.button;
      return newStep;
    }));
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

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1 p-1 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 w-fit">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500"><Bold className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500"><Italic className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500"><List className="h-3.5 w-3.5" /></Button>
                        <Separator orientation="vertical" className="h-4 mx-1" />
                        
                        <FileSelectionDialog 
                          trigger={
                            <Button variant={step.image?.url ? "secondary" : "ghost"} size="icon" className={`h-7 w-7 ${step.image?.url ? 'text-primary bg-primary/10' : 'text-slate-500'}`}>
                              <ImageIcon className="h-3.5 w-3.5" />
                            </Button>
                          }
                          onSelect={(file) => {
                            if (file.url) {
                              updateStepImage(step.id, 'url', file.url);
                            }
                          }}
                        />
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
                            <Plus className="h-3.5 w-3.5" /> Add Detail
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => addDetailToStep(step.id, 'note')} disabled={!!step.note}>
                            <Info className="h-4 w-4 mr-2" /> Add Note
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addDetailToStep(step.id, 'button')} disabled={!!step.button}>
                            <LinkIcon className="h-4 w-4 mr-2" /> Add Button
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {step.image?.url && (
                      <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="relative group w-fit">
                          <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                             <img 
                                src={step.image.url} 
                                alt="Step visual" 
                                className={`w-auto object-cover ${
                                  step.image.size === 'small' ? 'h-32' :
                                  step.image.size === 'medium' ? 'h-48' :
                                  step.image.size === 'large' ? 'h-64' : 'h-80'
                                }`} 
                              />
                          </div>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            onClick={() => updateStep(step.id, 'image', undefined)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex-1 space-y-4 pt-2">
                           <div className="space-y-2">
                             <Label className="text-xs text-slate-500 uppercase">Image Size</Label>
                             <div className="flex items-center gap-1">
                               {['small', 'medium', 'large', 'full'].map((size) => (
                                 <Button 
                                    key={size}
                                    variant={step.image?.size === size ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateStepImage(step.id, 'size', size)}
                                    className="h-7 text-xs capitalize"
                                 >
                                    {size}
                                 </Button>
                               ))}
                             </div>
                           </div>

                           <div className="space-y-2">
                             <Label className="text-xs text-slate-500 uppercase">Alignment</Label>
                             <div className="flex items-center gap-1">
                               <Button 
                                  variant={step.image?.align === 'left' ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => updateStepImage(step.id, 'align', 'left')}
                                  className="h-7 w-7"
                                  title="Left"
                               >
                                  <AlignLeft className="h-3.5 w-3.5" />
                               </Button>
                               <Button 
                                  variant={step.image?.align === 'center' ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => updateStepImage(step.id, 'align', 'center')}
                                  className="h-7 w-7"
                                  title="Center"
                               >
                                  <AlignCenter className="h-3.5 w-3.5" />
                               </Button>
                               <Button 
                                  variant={step.image?.align === 'right' ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => updateStepImage(step.id, 'align', 'right')}
                                  className="h-7 w-7"
                                  title="Right"
                               >
                                  <AlignRight className="h-3.5 w-3.5" />
                               </Button>
                             </div>
                           </div>
                        </div>
                      </div>
                    )}

                    <Textarea 
                      placeholder="Describe the actions required for this step..." 
                      className="min-h-[150px] resize-y"
                      value={step.content}
                      onChange={(e) => updateStep(step.id, 'content', e.target.value)}
                    />

                    {/* Button Editor */}
                    {step.button && (
                       <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md border border-slate-200 dark:border-slate-800 space-y-3 relative group">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 h-6 w-6 text-slate-400 hover:text-red-500"
                            onClick={() => removeDetailFromStep(step.id, 'button')}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <div className="flex items-center gap-2 mb-2">
                             <LinkIcon className="h-4 w-4 text-slate-500" />
                             <span className="text-xs font-semibold uppercase text-slate-500">Action Button</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label className="text-xs">Button Text</Label>
                                <Input 
                                  value={step.button.text} 
                                  onChange={(e) => updateStepButton(step.id, 'text', e.target.value)}
                                  className="h-8"
                                  placeholder="e.g. Open Dashboard"
                                />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs">URL</Label>
                                <Input 
                                  value={step.button.url} 
                                  onChange={(e) => updateStepButton(step.id, 'url', e.target.value)}
                                  className="h-8"
                                  placeholder="https://..."
                                />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="text-xs">Color</Label>
                                <Select 
                                  value={step.button.color} 
                                  onValueChange={(val) => updateStepButton(step.id, 'color', val)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="primary">Primary (Brand)</SelectItem>
                                    <SelectItem value="secondary">Secondary (Gray)</SelectItem>
                                    <SelectItem value="outline">Outline</SelectItem>
                                    <SelectItem value="destructive">Destructive (Red)</SelectItem>
                                  </SelectContent>
                                </Select>
                             </div>
                          </div>
                       </div>
                    )}

                    {/* Note Editor */}
                    {step.note && (
                      <div className={`p-4 rounded-md border space-y-3 relative group ${
                        step.note.color === 'blue' ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800' :
                        step.note.color === 'red' ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800' :
                        step.note.color === 'green' ? 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800' :
                        'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800'
                      }`}>
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 h-6 w-6 text-slate-400 hover:text-red-500"
                            onClick={() => removeDetailFromStep(step.id, 'note')}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label className="text-xs">Note Title</Label>
                                <div className="relative">
                                  {step.note.icon === 'info' && <Info className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />}
                                  {step.note.icon === 'warning' && <AlertTriangle className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />}
                                  {step.note.icon === 'tip' && <Lightbulb className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />}
                                  {step.note.icon === 'alert' && <AlertCircle className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />}
                                  
                                  <Input 
                                    value={step.note.title} 
                                    onChange={(e) => updateStepNote(step.id, 'title', e.target.value)}
                                    className="h-8 pl-8 bg-white/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black"
                                    placeholder="Note:"
                                  />
                                </div>
                             </div>
                             
                             <div className="flex gap-2">
                               <div className="space-y-1.5 flex-1">
                                  <Label className="text-xs">Icon</Label>
                                  <Select 
                                    value={step.note.icon} 
                                    onValueChange={(val) => updateStepNote(step.id, 'icon', val)}
                                  >
                                    <SelectTrigger className="h-8 bg-white/50 dark:bg-black/20 border-transparent">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="info">Info</SelectItem>
                                      <SelectItem value="warning">Warning</SelectItem>
                                      <SelectItem value="tip">Tip</SelectItem>
                                      <SelectItem value="alert">Alert</SelectItem>
                                    </SelectContent>
                                  </Select>
                               </div>
                               <div className="space-y-1.5 flex-1">
                                  <Label className="text-xs">Color</Label>
                                  <Select 
                                    value={step.note.color} 
                                    onValueChange={(val) => updateStepNote(step.id, 'color', val)}
                                  >
                                    <SelectTrigger className="h-8 bg-white/50 dark:bg-black/20 border-transparent">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="amber">Amber</SelectItem>
                                      <SelectItem value="blue">Blue</SelectItem>
                                      <SelectItem value="red">Red</SelectItem>
                                      <SelectItem value="green">Green</SelectItem>
                                    </SelectContent>
                                  </Select>
                               </div>
                             </div>
                          </div>

                          <div className="space-y-1.5">
                              <Label className="text-xs">Content</Label>
                              <Input 
                                value={step.note.content}
                                onChange={(e) => updateStepNote(step.id, 'content', e.target.value)}
                                className="h-8 bg-white/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black"
                                placeholder="Enter note content..."
                              />
                          </div>
                      </div>
                    )}
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
