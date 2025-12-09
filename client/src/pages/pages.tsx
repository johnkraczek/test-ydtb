
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Search, 
  FileText, 
  ImageIcon, 
  LayoutTemplate, 
  MoreHorizontal, 
  ExternalLink,
  Eye,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft" | "archived";
  lastModified: string;
  views: number;
}

const PAGES: Page[] = [
  { id: "1", title: "Home", slug: "/", status: "published", lastModified: "2 hours ago", views: 12450 },
  { id: "2", title: "About Us", slug: "/about", status: "published", lastModified: "1 day ago", views: 3420 },
  { id: "3", title: "Pricing", slug: "/pricing", status: "published", lastModified: "3 days ago", views: 8900 },
  { id: "4", title: "Contact", slug: "/contact", status: "published", lastModified: "1 week ago", views: 1200 },
  { id: "5", title: "Blog", slug: "/blog", status: "published", lastModified: "2 days ago", views: 5600 },
  { id: "6", title: "Summer Campaign", slug: "/campaigns/summer-2025", status: "draft", lastModified: "Just now", views: 0 },
];

export default function PagesPage() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(PAGES[0]);

  return (
    <DashboardLayout 
      activeTool="pages"
      header={
        <DashboardPageHeader
          title="Pages"
          description="Manage your website pages and SEO settings."
        />
      }
    >
      <div className="flex h-full gap-6">
        {/* Page List */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search pages..." className="pl-9 bg-white border-slate-200" />
          </div>
          
          <div className="flex flex-col gap-2">
            {PAGES.map((page) => (
              <div 
                key={page.id}
                onClick={() => setSelectedPage(page)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedPage?.id === page.id 
                    ? "bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-100" 
                    : "bg-white/50 border-slate-200 hover:border-indigo-200 hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className={`h-4 w-4 ${selectedPage?.id === page.id ? "text-indigo-600" : "text-slate-400"}`} />
                    <span className="font-medium text-slate-900">{page.title}</span>
                  </div>
                  {page.status === "published" && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-[10px]">Published</Badge>}
                  {page.status === "draft" && <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-slate-200 text-[10px]">Draft</Badge>}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">{page.slug}</span>
                  <span>{page.lastModified}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Details / Meta Editor */}
        <div className="flex-1">
          {selectedPage ? (
            <Card className="h-full border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{selectedPage.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      https://mysite.com{selectedPage.slug}
                      <ExternalLink className="h-3 w-3 cursor-pointer hover:text-indigo-600" />
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 bg-white">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                      <LayoutTemplate className="h-4 w-4" />
                      Edit Content
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Social</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Page Title</Label>
                        <Input id="title" defaultValue={selectedPage.title} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                            /
                          </span>
                          <Input id="slug" defaultValue={selectedPage.slug.replace('/', '')} className="rounded-l-none" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-sm">Published</span>
                          </div>
                          <span className="text-xs text-slate-500">Visible to the public</span>
                          <Button variant="outline" size="sm" className="ml-auto bg-white h-7 text-xs">Change</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-900">Search Engine Optimization</h3>
                        <div className="grid gap-2">
                          <Label htmlFor="meta-title">Meta Title</Label>
                          <Input id="meta-title" placeholder="Detailed title for search engines" defaultValue={`${selectedPage.title} | My Company`} />
                          <p className="text-[11px] text-slate-500 text-right">45/60 characters</p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="meta-desc">Meta Description</Label>
                          <Textarea id="meta-desc" placeholder="Brief description of the page content..." className="resize-none h-24" />
                          <p className="text-[11px] text-slate-500 text-right">0/160 characters</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-900">Social Sharing (Open Graph)</h3>
                        <div className="border border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-2 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-medium text-slate-900">Upload Social Image</p>
                          <p className="text-xs text-slate-500">Recommended size: 1200x630px</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                     <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <h4 className="font-medium text-sm mb-2">Custom Code</h4>
                        <p className="text-xs text-slate-500 mb-4">Inject custom header or footer code specific to this page.</p>
                        <Button variant="outline" size="sm" className="bg-white">Manage Code Snippets</Button>
                     </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <FileText className="h-12 w-12 mb-4 opacity-20" />
              <p>Select a page to edit details</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
