
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  FileText, 
  MoreHorizontal, 
  Eye,
  CheckCircle2,
  Filter,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  Share2,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface SOP {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft" | "review";
  lastModified: string;
  author: string;
}

const SOPS: SOP[] = [
  { id: "1", title: "New Client Onboarding Process", category: "Client Success", status: "published", lastModified: "2 days ago", author: "Sarah J." },
  { id: "2", title: "Emergency Server Response Protocol", category: "Engineering", status: "published", lastModified: "1 week ago", author: "Mike T." },
  { id: "3", title: "Social Media Content Guidelines", category: "Marketing", status: "review", lastModified: "3 hours ago", author: "Jessica L." },
  { id: "4", title: "Quarterly Financial Reporting", category: "Finance", status: "draft", lastModified: "1 day ago", author: "Robert C." },
  { id: "5", title: "Remote Work Policy 2025", category: "HR", status: "published", lastModified: "2 weeks ago", author: "Jennifer A." },
  { id: "6", title: "Customer Support Escalation Matrix", category: "Support", status: "published", lastModified: "4 days ago", author: "David W." },
  { id: "7", title: "Brand Voice & Tone Guide", category: "Marketing", status: "published", lastModified: "1 month ago", author: "Jessica L." },
];

export default function SopPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSops = SOPS.filter(sop => 
    sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sop.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerActions = (
    <div className="flex items-center gap-2">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input 
          placeholder="Search documents..." 
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
        New SOP
      </Button>
    </div>
  );

  return (
    <DashboardLayout 
      activeTool="sop"
      header={
        <DashboardPageHeader
          title="SOP Library"
          description="Standard Operating Procedures and internal documentation."
          actions={headerActions}
        />
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <TableHead className="w-[400px]">Document Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSops.map((sop) => (
                <TableRow 
                  key={sop.id} 
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3 group">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                        sop.status === 'published' 
                          ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' 
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}>
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{sop.title}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-slate-600 bg-slate-50 border-slate-200">
                      {sop.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sop.status === "published" && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                        Published
                      </Badge>
                    )}
                    {sop.status === "draft" && (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100">
                        Draft
                      </Badge>
                    )}
                     {sop.status === "review" && (
                      <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
                        In Review
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Clock className="h-3 w-3" />
                      {sop.lastModified}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{sop.author}</span>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                           <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" /> Share
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" /> Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Archive
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
    </DashboardLayout>
  );
}
