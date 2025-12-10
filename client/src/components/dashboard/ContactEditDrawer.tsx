import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Save, Trash, User, Mail, Phone as PhoneIcon, MapPin, Calendar, Tag } from "lucide-react";

interface ContactEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: any; // Using any for mockup simplicity, ideally strictly typed
}

export function ContactEditDrawer({ open, onOpenChange, contact }: ContactEditDrawerProps) {
  const [formData, setFormData] = useState<any>({});
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (contact) {
      setFormData({ ...contact });
    }
  }, [contact]);

  if (!contact) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag: string) => tag !== tagToRemove)
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()]
      });
      setNewTag("");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col">
        <SheetHeader className="px-6 py-6 border-b bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white dark:border-slate-800 shadow-sm">
              <AvatarImage src={formData.image} />
              <AvatarFallback className="text-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                {formData.initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <SheetTitle className="text-xl">{formData.name}</SheetTitle>
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <span className="truncate max-w-[200px]">{formData.email}</span>
                <span>•</span>
                <span className="capitalize">{formData.role || 'Contact'}</span>
              </div>
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Contact Details */}
            <section className="space-y-4">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Name</Label>
                            <Input 
                                id="name" 
                                value={formData.name || ''} 
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="source">Source</Label>
                            <Input 
                                id="source" 
                                value={formData.source || ''} 
                                onChange={(e) => handleInputChange('source', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                id="email" 
                                className="pl-9"
                                value={formData.email || ''} 
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <PhoneIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                id="phone" 
                                className="pl-9"
                                value={formData.phone || ''} 
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <div className="relative">
                                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    id="dob" 
                                    className="pl-9"
                                    type="date"
                                    value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} 
                                    onChange={(e) => handleInputChange('dob', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Input 
                                id="type" 
                                value={formData.type || ''} 
                                onChange={(e) => handleInputChange('type', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Separator />

            {/* Tags Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-slate-400" />
                        Tags
                    </h3>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {formData.tags && formData.tags.length > 0 ? (
                            formData.tags.map((tag: string) => (
                                <Badge 
                                    key={tag} 
                                    variant="secondary"
                                    className="pl-2 pr-1 py-1 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 gap-1"
                                >
                                    {tag}
                                    <button 
                                        onClick={() => handleRemoveTag(tag)}
                                        className="h-4 w-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                                    >
                                        <X className="h-3 w-3 text-slate-400" />
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-slate-500 italic">No tags added yet</span>
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Add a new tag..." 
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            className="h-8 text-sm bg-white dark:bg-slate-950"
                        />
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8"
                            onClick={handleAddTag}
                            disabled={!newTag.trim()}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>

        <div className="p-6 border-t bg-white dark:bg-slate-900 mt-auto flex items-center justify-between">
            <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10">
                <Trash className="h-4 w-4 mr-2" />
                Delete Contact
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
