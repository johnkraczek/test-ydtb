
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Globe, 
  Search, 
  FileText, 
  ImageIcon, 
  LayoutTemplate, 
  MoreHorizontal, 
  ExternalLink,
  Eye,
  CheckCircle2,
  Filter,
  Plus,
  Calendar,
  BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRowClick = (page: Page) => {
    setSelectedPage(page);
    setIsSheetOpen(true);
  };

  const filteredPages = PAGES.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerActions = (
    <div className="flex items-center gap-2">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input 
          placeholder="Search pages..." 
          className="pl-8 h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-offset-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Button variant="outline" size="sm" className="h-8 gap-2 bg-white text-xs border-slate-200 dark:border-slate-800">
        <Filter className="h-3.5 w-3.5 text-slate-500" />
        Filter
      </Button>

      <Button size="sm" className="h-8 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs">
        <Plus className="h-3.5 w-3.5" />
        New Page
      </Button>
    </div>
  );

  return (
    <DashboardLayout 
      activeTool="pages"
      header={
        <DashboardPageHeader
          title="Pages"
          description="Manage your website pages and SEO settings."
          actions={headerActions}
        />
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow 
                  key={page.id} 
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  onClick={() => handleRowClick(page)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        page.status === 'published' 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        <LayoutTemplate className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{page.title}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                      {page.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    {page.status === "published" && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                        Published
                      </Badge>
                    )}
                    {page.status === "draft" && (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100">
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Calendar className="h-3 w-3" />
                      {page.lastModified}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-600">
                      <span className="font-medium">{page.views.toLocaleString()}</span>
                      <BarChart3 className="h-3 w-3 text-slate-400" />
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRowClick(page)}>
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col gap-0 border-l shadow-xl" side="right">
          {selectedPage && (
            <>
              <SheetHeader className="p-6 border-b bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-white">
                    {selectedPage.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-2 bg-white">
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                    <Button size="sm" className="h-8 gap-2 bg-indigo-600 hover:bg-indigo-700">
                      Save Changes
                    </Button>
                  </div>
                </div>
                <SheetTitle className="text-xl font-display">{selectedPage.title}</SheetTitle>
                <SheetDescription className="flex items-center gap-1.5 mt-1">
                  <Globe className="h-3 w-3" />
                  <span className="font-mono text-xs">https://mysite.com{selectedPage.slug}</span>
                  <ExternalLink className="h-3 w-3 ml-1 cursor-pointer hover:text-indigo-600" />
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">General</TabsTrigger>
                    <TabsTrigger value="seo" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">SEO & Social</TabsTrigger>
                    <TabsTrigger value="advanced" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-6 focus-visible:outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Page Title</Label>
                        <Input id="title" defaultValue={selectedPage.title} className="focus-visible:ring-indigo-500" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                            /
                          </span>
                          <Input id="slug" defaultValue={selectedPage.slug.replace('/', '')} className="rounded-l-none focus-visible:ring-indigo-500" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Visibility</Label>
                        <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50/50">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${selectedPage.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600'}`}>
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-slate-900">
                                {selectedPage.status === 'published' ? 'Published' : 'Draft Mode'}
                              </div>
                              <div className="text-xs text-slate-500">
                                {selectedPage.status === 'published' ? 'Visible to everyone' : 'Only visible to admins'}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="bg-white h-8 text-xs">Change</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-6 focus-visible:outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                          <Search className="h-4 w-4 text-indigo-600" />
                          Search Engine Listing
                        </h3>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                          <div className="text-xs text-slate-500 mb-1">mysite.com › {selectedPage.slug.replace('/', '')}</div>
                          <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer truncate mb-1">
                            {selectedPage.title} | My Company
                          </div>
                          <div className="text-sm text-slate-600 line-clamp-2">
                            This is how your page will appear in search engine results. Make sure to include relevant keywords in your title and description.
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="meta-title">Meta Title</Label>
                          <Input id="meta-title" placeholder="Detailed title for search engines" defaultValue={`${selectedPage.title} | My Company`} />
                          <div className="flex justify-between text-[11px] text-slate-400">
                            <span>Recommended: 50-60 characters</span>
                            <span>45/60</span>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="meta-desc">Meta Description</Label>
                          <Textarea id="meta-desc" placeholder="Brief description of the page content..." className="resize-none h-24" />
                          <div className="flex justify-between text-[11px] text-slate-400">
                            <span>Recommended: 150-160 characters</span>
                            <span>0/160</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-indigo-600" />
                          Social Sharing Image
                        </h3>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 hover:bg-slate-50 hover:border-indigo-200 transition-all cursor-pointer group">
                          <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                          <div>
                             <p className="text-sm font-medium text-slate-900">Click to upload image</p>
                             <p className="text-xs text-slate-500 mt-1">1200 x 630px recommended</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6 focus-visible:outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                     <div className="space-y-4">
                       <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            Custom Header Code
                          </h4>
                          <p className="text-xs text-slate-500 mb-4">Inject custom scripts or styles into the &lt;head&gt; tag of this page.</p>
                          <Textarea className="font-mono text-xs h-32 bg-white" placeholder="<!-- Add custom code here -->" />
                       </div>
                       
                       <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            Custom Body Code
                          </h4>
                          <p className="text-xs text-slate-500 mb-4">Inject custom scripts at the end of the &lt;body&gt; tag.</p>
                          <Textarea className="font-mono text-xs h-32 bg-white" placeholder="<!-- Add custom code here -->" />
                       </div>
                     </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
