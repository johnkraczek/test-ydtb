
import DashboardLayout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Mock data for contacts
const generateContacts = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `contact-${i + 1}`,
    name: [
      "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", 
      "Evan Wright", "Fiona Green", "George King", "Hannah White",
      "Ian Black", "Julia Roberts", "Kevin Lee", "Laura Croft",
      "Mike Tyson", "Nina Simone", "Oscar Wilde", "Paula Abdul",
      "Quincy Jones", "Rachel Green", "Steve Jobs", "Tina Turner"
    ][i % 20] + (Math.floor(i / 20) > 0 ? ` ${Math.floor(i / 20) + 1}` : ""),
    email: `user${i + 1}@example.com`,
    phone: `+1 (555) 000-${(1000 + i).toString().slice(1)}`,
    company: ["Acme Corp", "Globex", "Soylent Corp", "Initech", "Umbrella Corp"][i % 5],
    role: ["Manager", "Developer", "Designer", "Director", "Sales"][i % 5],
    status: ["Active", "Inactive", "Pending"][i % 3],
    location: ["New York", "London", "Tokyo", "San Francisco", "Berlin"][i % 5],
    lastActive: `${Math.floor(Math.random() * 24)} hours ago`
  }));
};

const allContacts = generateContacts(100);

export default function ContactsPage() {
  const [pageSize, setPageSize] = useState("20");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contacts
  const filteredContacts = allContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / parseInt(pageSize));
  const startIndex = (currentPage - 1) * parseInt(pageSize);
  const endIndex = startIndex + parseInt(pageSize);
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const toggleSelectAll = () => {
    if (selectedContacts.length === currentContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(currentContacts.map(c => c.id));
    }
  };

  const toggleSelectContact = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(c => c !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  return (
    <DashboardLayout activeTool="users">
      <div className="space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 p-4 rounded-lg border border-slate-200/60 dark:border-slate-800 backdrop-blur-sm">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search contacts..." 
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-800">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-800">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <TableHead className="w-[40px] pl-4">
                  <Checkbox 
                    checked={currentContacts.length > 0 && selectedContacts.length === currentContacts.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead className="hidden md:table-cell">Company & Role</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="hidden xl:table-cell">Location</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentContacts.length > 0 ? (
                currentContacts.map((contact) => (
                  <TableRow key={contact.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="pl-4">
                      <Checkbox 
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleSelectContact(contact.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} />
                          <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{contact.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 md:hidden">{contact.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{contact.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{contact.company}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{contact.role}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge 
                        variant="secondary" 
                        className={`
                          ${contact.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : ''}
                          ${contact.status === 'Inactive' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700' : ''}
                          ${contact.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' : ''}
                        `}
                      >
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {contact.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    No contacts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Rows per page</span>
              <Select value={pageSize} onValueChange={(val) => {
                setPageSize(val);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="h-8 w-[70px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}