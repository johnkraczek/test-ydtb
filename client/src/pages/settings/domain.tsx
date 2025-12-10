
import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Trash2,
  ExternalLink,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Mock data for initial domains
const INITIAL_DOMAINS = [
  { id: "1", name: "myshop.com", status: "verified", verifiedAt: "2024-01-15T10:00:00Z" }
];

export default function DomainSettingsPage() {
  const [domains, setDomains] = useState(INITIAL_DOMAINS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState<1 | 2>(1);
  const [newDomain, setNewDomain] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    root: false,
    www: false
  });

  const resetDialog = () => {
    setDialogStep(1);
    setNewDomain("");
    setIsVerifying(false);
    setVerificationStatus({ root: false, www: false });
  };

  const handleOpenDialog = () => {
    resetDialog();
    setIsDialogOpen(true);
  };

  const handleNextStep = () => {
    if (newDomain && newDomain.includes('.')) {
      setDialogStep(2);
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus(prev => ({ ...prev, root: true }));
    }, 1500);

    setTimeout(() => {
      setVerificationStatus(prev => ({ ...prev, www: true }));
      setIsVerifying(false);
    }, 3000);
  };

  const handleAddDomain = () => {
    const domain = {
      id: Date.now().toString(),
      name: newDomain,
      status: "verified",
      verifiedAt: new Date().toISOString()
    };
    setDomains([...domains, domain]);
    setIsDialogOpen(false);
  };

  const handleDeleteDomain = (id: string) => {
    setDomains(domains.filter(d => d.id !== id));
  };

  const isFullyVerified = verificationStatus.root && verificationStatus.www;

  return (
    <DashboardLayout 
      activeTool="settings"
      header={
        <DashboardPageHeader
          title="Domain Settings"
          description="Manage your custom domains and DNS configurations."
          hideBreadcrumbs={true}
        />
      }
    >
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Connected Domains</h2>
            <p className="text-sm text-slate-500 mt-1">Connect your existing domain names to your Launchpad sites.</p>
          </div>
          <Button onClick={handleOpenDialog} className="gap-2">
            <Plus className="h-4 w-4" /> Add Domain
          </Button>
        </div>

        <div className="grid gap-4">
          {domains.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No domains connected</h3>
                <p className="text-slate-500 max-w-sm mt-2 mb-6">
                  Add a custom domain to professionalize your brand and improve trust with your customers.
                </p>
                <Button onClick={handleOpenDialog} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" /> Add your first domain
                </Button>
              </CardContent>
            </Card>
          ) : (
            domains.map((domain) => (
              <Card key={domain.id} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{domain.name}</h3>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        Connected on {new Date(domain.verifiedAt).toLocaleDateString()} • Primary Domain
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={() => handleDeleteDomain(domain.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-3 flex items-center gap-6 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                    SSL Certificate Active
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    DNS Configured
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{dialogStep === 1 ? "Connect a Domain" : "Verify DNS Configuration"}</DialogTitle>
              <DialogDescription>
                {dialogStep === 1 
                  ? "Enter the domain name you want to connect (e.g., example.com)."
                  : "Update your DNS records to point your domain to our servers."
                }
              </DialogDescription>
            </DialogHeader>

            {dialogStep === 1 ? (
              <div className="py-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input
                      id="domain"
                      placeholder="example.com"
                      className="pl-10"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value.toLowerCase().replace(/^https?:\/\//, ''))}
                      onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Enter the root domain (without https:// or www).
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-6">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4 text-sm text-amber-800 dark:text-amber-200 flex gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>
                    Log in to your domain provider (GoDaddy, Namecheap, etc.) and add the following CNAME records. DNS propagation may take up to 24 hours.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase px-2">
                    <div className="col-span-2">Type</div>
                    <div className="col-span-3">Name (Host)</div>
                    <div className="col-span-5">Value (Points to)</div>
                    <div className="col-span-2 text-right">Status</div>
                  </div>
                  
                  <div className="border border-slate-200 dark:border-slate-800 rounded-md divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Root Record */}
                    <div className="grid grid-cols-12 gap-4 p-3 items-center text-sm">
                      <div className="col-span-2 font-mono bg-slate-100 dark:bg-slate-800 w-fit px-2 py-0.5 rounded text-xs">CNAME</div>
                      <div className="col-span-3 font-medium text-slate-900 dark:text-slate-100">@</div>
                      <div className="col-span-5 font-mono text-slate-600 dark:text-slate-400 text-xs truncate" title="example.com">
                        example.com
                      </div>
                      <div className="col-span-2 flex justify-end">
                        {verificationStatus.root ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 pr-1.5">
                            <CheckCircle2 className="h-3 w-3" /> OK
                          </Badge>
                        ) : isVerifying ? (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        ) : (
                          <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">Pending</Badge>
                        )}
                      </div>
                    </div>

                    {/* WWW Record */}
                    <div className="grid grid-cols-12 gap-4 p-3 items-center text-sm">
                      <div className="col-span-2 font-mono bg-slate-100 dark:bg-slate-800 w-fit px-2 py-0.5 rounded text-xs">CNAME</div>
                      <div className="col-span-3 font-medium text-slate-900 dark:text-slate-100">www</div>
                      <div className="col-span-5 font-mono text-slate-600 dark:text-slate-400 text-xs truncate" title="www.example.com">
                        www.example.com
                      </div>
                      <div className="col-span-2 flex justify-end">
                        {verificationStatus.www ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 pr-1.5">
                            <CheckCircle2 className="h-3 w-3" /> OK
                          </Badge>
                        ) : isVerifying ? (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        ) : (
                          <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">Pending</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
              {dialogStep === 2 ? (
                <Button variant="ghost" onClick={() => setDialogStep(1)} disabled={isVerifying}>
                  Back
                </Button>
              ) : (
                <div /> /* Spacer */
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isVerifying}>
                  Cancel
                </Button>
                
                {dialogStep === 1 ? (
                  <Button onClick={handleNextStep} disabled={!newDomain || !newDomain.includes('.')}>
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <>
                    {!isFullyVerified ? (
                      <Button onClick={handleVerify} disabled={isVerifying}>
                        {isVerifying ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying Records...
                          </>
                        ) : (
                          "I have done this"
                        )}
                      </Button>
                    ) : (
                      <Button onClick={handleAddDomain} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-4 w-4 mr-2" /> Add Domain
                      </Button>
                    )}
                  </>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}
