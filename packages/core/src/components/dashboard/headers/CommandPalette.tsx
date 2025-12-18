"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, Settings, ArrowLeft, Plus, CheckCircle2, Calendar, FileText, Hash, Mail, Box, Github, Slack, List, AppWindow, Command as CommandIcon, Image as ImageIcon, MessageSquare, LayoutGrid, User, Palette } from "lucide-react";
import { Button } from "@ydtb/ui/base/button";
import { Switch } from "@ydtb/ui/base/switch";
import { useThemeColor } from "@ydtb/core/context/theme/use-theme-color";
import { useThemePattern } from "@ydtb/core/context/theme/use-theme-pattern";
import { useTheme } from "next-themes";
import { cn } from "@ydtb/core/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@ydtb/ui/base/command";
import { Command as CommandPrimitive } from "cmdk";

const availableThemeColors = [
  { name: "Zinc", value: "zinc", color: "bg-zinc-950" },
  { name: "Slate", value: "slate", color: "bg-slate-500" },
  { name: "Stone", value: "stone", color: "bg-stone-500" },
  { name: "Gray", value: "gray", color: "bg-gray-500" },
  { name: "Neutral", value: "neutral", color: "bg-neutral-500" },
  { name: "Red", value: "red", color: "bg-red-500" },
  { name: "Rose", value: "rose", color: "bg-rose-500" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
  { name: "Green", value: "green", color: "bg-green-500" },
  { name: "Blue", value: "blue", color: "bg-blue-500" },
  { name: "Yellow", value: "yellow", color: "bg-yellow-500" },
  { name: "Violet", value: "violet", color: "bg-violet-500" },
] as const;

const availableThemePatterns = [
  { name: "None", value: "none", preview: "bg-white dark:bg-slate-900" },
  { name: "Dots", value: "dots", preview: "bg-dot-pattern" },
  { name: "Grid", value: "grid", preview: "bg-grid-pattern" },
  { name: "Graph", value: "graph", preview: "bg-graph-paper" },
  { name: "Noise", value: "noise", preview: "bg-noise" },
] as const;

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [view, setView] = useState<'command' | 'settings'>('command');
  const [settingsTab, setSettingsTab] = useState<'general' | 'theme' | 'sources' | 'commands'>('general');
  const { themeColor, setThemeColor } = useThemeColor();
  const { themePattern, setThemePattern } = useThemePattern();
  const { theme, setTheme } = useTheme();

  const [searchSettings, setSearchSettings] = useState([
    { id: 'contacts', label: 'Contacts', icon: User, enabled: true, description: 'Search through your contacts and team members' },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2, enabled: true, description: 'Find tasks, subtasks and projects' },
    { id: 'media', label: 'Media', icon: ImageIcon, enabled: true, description: 'Images, videos and other media files' },
    { id: 'docs', label: 'Documents', icon: FileText, enabled: true, description: 'Text documents, PDFs and spreadsheets' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, enabled: false, description: 'Events, meetings and reminders' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, enabled: true, description: 'Chat messages and direct messages' },
    { id: 'channels', label: 'Channels', icon: Hash, enabled: true, description: 'Public and private channels' },
    { id: 'repos', label: 'Repositories', icon: Github, enabled: false, description: 'Code repositories and branches' },
  ]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
        if (!open) setView('command'); // Reset to command view when opening
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      {view === 'command' ? (
        <>
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search, run a command, or ask a question..."
            />
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700">
              Ask AI
              <Sparkles className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-1 p-2 border-b bg-slate-50/50 overflow-x-auto no-scrollbar">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium bg-white shadow-sm border border-slate-200 text-slate-900">
              All
            </Button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50">
              <Mail className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50">
              <Box className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50">
              <Github className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50">
              <Slack className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs font-medium text-slate-600 hover:bg-slate-200/50 border border-transparent hover:border-slate-200">
              <CheckCircle2 className="h-3 w-3" />
              Tasks
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs font-medium text-slate-600 hover:bg-slate-200/50 border border-transparent hover:border-slate-200">
              <FileText className="h-3 w-3" />
              Docs
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs font-medium text-slate-600 hover:bg-slate-200/50 border border-transparent hover:border-slate-200">
              <Hash className="h-3 w-3" />
              Channels
            </Button>
          </div>

          <CommandList className="max-h-[500px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem className="py-3">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 truncate">Connect GHL to Clinic Sense via forms</span>
                      <span className="text-xs text-slate-400 shrink-0">1mo ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>in Tasks</span>
                    </div>
                  </div>
                </div>
              </CommandItem>
              <CommandItem className="py-3">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <LayoutGrid className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 truncate">Phone Process for how to answer a call</span>
                      <span className="text-xs text-slate-400 shrink-0">2mo ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">E</span>
                      <span>in Tasks</span>
                    </div>
                  </div>
                </div>
              </CommandItem>
              <CommandItem className="py-3">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 truncate">Export Contacts to upload to High Level</span>
                      <span className="text-xs text-slate-400 shrink-0">2mo ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">E</span>
                      <span>in Tasks</span>
                    </div>
                  </div>
                </div>
              </CommandItem>
              <CommandItem className="py-3">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 truncate">Obtain Files from Haley, Graphic Designer</span>
                      <span className="text-xs text-slate-400 shrink-0">2mo ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">E</span>
                      <span>in Tasks</span>
                    </div>
                  </div>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Rise AI">
              <CommandItem className="py-3">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <LayoutGrid className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 truncate">Botanza</span>
                      <span className="text-xs text-slate-400 shrink-0">3mo ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>in Rise AI</span>
                    </div>
                  </div>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>

          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-t text-[10px] text-slate-500">
            <div className="flex items-center gap-2">
              <span>Type <kbd className="font-mono bg-white border rounded px-1">/</kbd> to view available commands</span>
              <span>hit <kbd className="font-mono bg-white border rounded px-1">tab</kbd> on a selected item to see additional actions</span>
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-slate-900"
              onClick={() => setView('settings')}
            >
              <Settings className="h-3 w-3" />
              <span>Settings</span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-[625px] w-full bg-white rounded-lg overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r bg-slate-50 p-2 flex flex-col gap-1">
            <div className="px-3 py-2 mb-2 flex items-center gap-2 font-semibold text-sm text-slate-900">
              <Settings className="h-4 w-4" />
              Search settings
            </div>

            <button
              onClick={() => setSettingsTab('general')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-left",
                settingsTab === 'general' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <List className="h-4 w-4" />
              General
            </button>
            <button
              onClick={() => setSettingsTab('theme')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-left",
                settingsTab === 'theme' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <Palette className="h-4 w-4" />
              Theme
            </button>
            <button
              onClick={() => setSettingsTab('sources')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-left",
                settingsTab === 'sources' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <AppWindow className="h-4 w-4" />
              Sources
            </button>
            <button
              onClick={() => setSettingsTab('commands')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-left",
                settingsTab === 'commands' ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <CommandIcon className="h-4 w-4" />
              Commands
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-600"
                onClick={() => setView('command')}
              >
                <span className="sr-only">Back to search</span>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {settingsTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-1">Search Scope</h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Customize what content appears in your search results.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {searchSettings.map((setting) => (
                      <div key={setting.id} className="flex items-start justify-between group">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 h-8 w-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                            <setting.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 mb-0.5">{setting.label}</div>
                            <div className="text-xs text-slate-500">{setting.description}</div>
                          </div>
                        </div>
                        <Switch
                          checked={setting.enabled}
                          onCheckedChange={(checked) => {
                            setSearchSettings(prev => prev.map(s =>
                              s.id === setting.id ? { ...s, enabled: checked } : s
                            ));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settingsTab === 'theme' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-1">Appearance</h3>
                    <p className="text-xs text-slate-500 mb-4">Choose your preferred visual theme.</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        className={cn(
                          "cursor-pointer rounded-lg border-2 p-1",
                          theme === 'light' ? "border-indigo-600 bg-indigo-50/30" : "border-slate-200 hover:border-slate-300"
                        )}
                        onClick={() => setTheme('light')}
                      >
                        <div className="bg-slate-100 rounded-md h-16 w-full border border-slate-200 relative overflow-hidden flex">
                          <div className="w-6 bg-white border-r border-slate-200 h-full flex flex-col items-center gap-1 pt-2">
                            <div className="w-3 h-3 bg-indigo-500 rounded-sm" />
                            <div className="w-3 h-3 bg-slate-200 rounded-sm" />
                          </div>
                          <div className="flex-1 bg-white p-2">
                            <div className="w-12 h-2 bg-slate-200 rounded mb-2" />
                            <div className="w-8 h-2 bg-indigo-100 rounded" />
                          </div>
                        </div>
                        <div className="mt-2 text-center text-xs font-medium text-slate-700">Light</div>
                      </div>

                      <div
                        className={cn(
                          "cursor-pointer rounded-lg border-2 p-1",
                          theme === 'dark' ? "border-indigo-600 bg-indigo-50/30" : "border-slate-200 hover:border-slate-300"
                        )}
                        onClick={() => setTheme('dark')}
                      >
                        <div className="bg-slate-900 rounded-md h-16 w-full border border-slate-800 relative overflow-hidden flex">
                          <div className="w-6 bg-slate-800 border-r border-slate-700 h-full flex flex-col items-center gap-1 pt-2">
                            <div className="w-3 h-3 bg-indigo-500 rounded-sm" />
                            <div className="w-3 h-3 bg-slate-700 rounded-sm" />
                          </div>
                          <div className="flex-1 bg-slate-900 p-2">
                            <div className="w-12 h-2 bg-slate-700 rounded mb-2" />
                            <div className="w-8 h-2 bg-indigo-900/30 rounded" />
                          </div>
                        </div>
                        <div className="mt-2 text-center text-xs font-medium text-slate-700">Dark</div>
                      </div>

                      <div
                        className={cn(
                          "cursor-pointer rounded-lg border-2 p-1",
                          theme === 'system' ? "border-indigo-600 bg-indigo-50/30" : "border-slate-200 hover:border-slate-300"
                        )}
                        onClick={() => setTheme('system')}
                      >
                        <div className="rounded-md h-16 w-full border border-slate-200 relative overflow-hidden flex">
                          <div className="w-1/2 bg-white h-full flex">
                            <div className="w-3 bg-slate-50 border-r border-slate-100 h-full flex flex-col items-center gap-1 pt-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-[1px]" />
                            </div>
                            <div className="flex-1 p-1">
                              <div className="w-4 h-1 bg-slate-200 rounded mb-1" />
                            </div>
                          </div>
                          <div className="w-1/2 bg-slate-900 h-full flex">
                            <div className="w-3 bg-slate-800 border-r border-slate-700 h-full flex flex-col items-center gap-1 pt-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-[1px]" />
                            </div>
                            <div className="flex-1 p-1">
                              <div className="w-4 h-1 bg-slate-700 rounded mb-1" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-center text-xs font-medium text-slate-700">Auto</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-1">Background Pattern</h3>
                    <p className="text-xs text-slate-500 mb-4">Add texture to your dashboard background.</p>
                    <div className="grid grid-cols-5 gap-2">
                      {availableThemePatterns.map((pattern) => (
                        <button
                          key={pattern.value}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-2 rounded-lg border bg-white transition-all aspect-square justify-center",
                            themePattern === pattern.value
                              ? "border-indigo-600 ring-1 ring-indigo-600"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                          onClick={() => setThemePattern(pattern.value)}
                        >
                          <div className={`h-8 w-8 rounded border border-slate-100 ${pattern.preview} bg-slate-50/50`} />
                          <span className="text-[10px] font-medium text-slate-700">{pattern.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-900 mb-1">Accent Color</h3>
                    <p className="text-xs text-slate-500 mb-4">Select an accent color for active elements.</p>
                    <div className="grid grid-cols-4 gap-2">
                      {availableThemeColors.map((color) => (
                        <button
                          key={color.value}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg border bg-white text-left transition-all",
                            themeColor === color.value
                              ? "border-indigo-600 ring-1 ring-indigo-600"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                          onClick={() => setThemeColor(color.value)}
                        >
                          <div className={`h-5 w-5 rounded-full ${color.color}`} />
                          <span className="text-xs font-medium text-slate-700">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'sources' && (
                <div className="flex flex-col h-full items-center justify-center text-center">
                  <div className="relative mb-6">
                    <div className="h-16 w-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                      <div className="flex flex-col gap-1.5 opacity-50">
                        <div className="w-8 h-1 bg-slate-300 rounded-full" />
                        <div className="w-6 h-1 bg-slate-300 rounded-full" />
                        <div className="w-8 h-1 bg-slate-300 rounded-full" />
                      </div>
                    </div>
                    <div className="absolute -right-2 -bottom-2 h-8 w-8 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                      <Search className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="absolute -left-2 -top-2">
                      <Slack className="h-4 w-4 text-slate-400 rotate-12" />
                    </div>
                    <div className="absolute right-6 -top-4">
                      <Box className="h-3 w-3 text-slate-300" />
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-slate-900 mb-2">Search your Apps</h3>
                  <p className="text-xs text-slate-500 max-w-[360px] mb-6 leading-relaxed">
                    Visit our App Center to connect apps you're using, enable Connected Search for them and we will use those apps as sources for your search.
                  </p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 h-9 px-4 text-xs font-medium">
                    Connect app
                  </Button>
                </div>
              )}

              {settingsTab === 'commands' && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex flex-col items-center justify-center text-center mb-8">
                    <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 text-slate-400">
                      <span className="font-mono text-xl">⌘</span>
                      <Search className="h-3 w-3 absolute translate-x-3 translate-y-3 bg-white rounded-full p-0.5" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 mb-1">No custom commands</h3>
                    <p className="text-xs text-slate-500 max-w-[240px] mb-4">
                      Create, customize and share your custom commands here.
                    </p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 h-9 px-4 text-xs font-medium">
                      Add command
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-slate-500 mb-3">Quickly create a new command:</h4>

                    <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all group text-left bg-white">
                      <div className="h-8 w-8 rounded-md bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors border border-slate-200/50">
                        <div className="rotate-45">
                          <Plus className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-slate-900">Link</span>
                        </div>
                        <p className="text-xs text-slate-500">Create a shortcut for the fastest way to open any webpage or URL.</p>
                      </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all group text-left bg-white">
                      <div className="h-8 w-8 rounded-md bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors border border-slate-200/50">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-slate-900">Clipboard</span>
                        </div>
                        <p className="text-xs text-slate-500">Add a text snippet that you can instantly copy and paste from the...</p>
                      </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all group text-left bg-white">
                      <div className="h-8 w-8 rounded-md bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors border border-slate-200/50">
                        <Box className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-slate-900">Cloud</span>
                        </div>
                        <p className="text-xs text-slate-500">Fully custom, shareable commands that are just JSON endpoints on t...</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </CommandDialog>
  );
}