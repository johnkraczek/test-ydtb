
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Calendar,
  MoreVertical,
  FileText,
  ArrowUpRight,
  Check,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock Data
const SAVED_CARDS = [
  { id: "card_1", last4: "4242", brand: "Visa", expiry: "12/28" },
  { id: "card_2", last4: "5555", brand: "Mastercard", expiry: "10/26" },
];

const INVOICES = [
  { id: "inv_001", date: "2024-12-01", amount: "$49.00", status: "Paid", description: "Pro Plan - Monthly" },
  { id: "inv_002", date: "2024-11-01", amount: "$49.00", status: "Paid", description: "Pro Plan - Monthly" },
  { id: "inv_003", date: "2024-10-01", amount: "$49.00", status: "Paid", description: "Pro Plan - Monthly" },
  { id: "inv_004", date: "2024-09-01", amount: "$49.00", status: "Paid", description: "Pro Plan - Monthly" },
  { id: "inv_005", date: "2024-08-01", amount: "$49.00", status: "Paid", description: "Pro Plan - Monthly" },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$19",
    period: "/mo",
    description: "Perfect for hobbyists and small projects.",
    features: ["1 User Seat", "2GB Storage", "Basic Support", "1 Custom Domain"]
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "Everything you need to grow your business.",
    features: ["5 User Seats", "10GB Storage", "Priority Support", "5 Custom Domains", "Advanced Analytics"],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$199",
    period: "/mo",
    description: "Advanced features for large teams.",
    features: ["Unlimited Seats", "1TB Storage", "24/7 Dedicated Support", "Unlimited Domains", "SSO & Audit Logs"]
  }
];

export default function BillingSettingsPage() {
  const [currentPlan, setCurrentPlan] = useState("pro");
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cardNumber, setCardNumber] = useState("4242");
  const [selectedCardId, setSelectedCardId] = useState("card_1");
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof INVOICES[0] | null>(null);

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) return;
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(planId);
      setIsUpdating(false);
      setIsPlanDialogOpen(false);
      toast.success(`Successfully switched to ${PLANS.find(p => p.id === planId)?.name} Plan`);
    }, 1500);
  };

  const handleUpdatePaymentMethod = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setIsPaymentDialogOpen(false);
      
      if (isAddingNewCard) {
         setCardNumber(cardNumber || "4242"); // In a real app this would come from the form
         toast.success("New payment method added and set as default");
      } else {
         const card = SAVED_CARDS.find(c => c.id === selectedCardId);
         if (card) setCardNumber(card.last4);
         toast.success("Default payment method updated");
      }
      
      setIsAddingNewCard(false);
    }, 1500);
  };

  const activePlanDetails = PLANS.find(p => p.id === currentPlan) || PLANS[1];

  return (
    <DashboardLayout 
      activeTool="settings"
      header={
        <DashboardPageHeader
          title="Billing & Subscription"
          description="Manage your subscription plan and payment methods."
        />
      }
    >
      <div className="max-w-5xl mx-auto space-y-8 pb-10">
        
        {/* Current Plan & Payment Method Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Current Plan */}
          <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="h-32 w-32 -mr-8 -mt-8 rotate-12" />
            </div>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {activePlanDetails.name} Plan
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Active</Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {activePlanDetails.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activePlanDetails.price}<span className="text-sm font-normal text-slate-500">{activePlanDetails.period}</span></div>
                  <div className="text-xs text-slate-500">Renews on Jan 1, 2025</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-500">Storage Used</div>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">7.5 GB</span>
                    <span className="text-xs text-slate-500 mb-1">of {currentPlan === 'starter' ? '2 GB' : currentPlan === 'pro' ? '10 GB' : '1 TB'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-primary transition-all duration-500`} 
                      style={{ width: currentPlan === 'starter' ? '100%' : currentPlan === 'pro' ? '75%' : '1%' }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-500">Team Members</div>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">5</span>
                    <span className="text-xs text-slate-500 mb-1">of {currentPlan === 'starter' ? '1 seat' : currentPlan === 'pro' ? '10 seats' : 'Unlimited'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div 
                      className={`h-full bg-blue-500 transition-all duration-500`} 
                      style={{ width: currentPlan === 'starter' ? '100%' : currentPlan === 'pro' ? '50%' : '5%' }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center py-3">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                Next invoice will be issued on Jan 1, 2025
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsPlanDialogOpen(true)}>Change Plan</Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">Cancel Subscription</Button>
              </div>
            </CardFooter>
          </Card>

          {/* Payment Method */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950">
                <div className="h-10 w-14 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <div className="font-medium text-sm">Visa ending in {cardNumber.slice(-4) || '4242'}</div>
                  <div className="text-xs text-slate-500">Expires 12/28</div>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <p>Your default payment method will be charged automatically at the start of each billing cycle.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-4 pb-4 mt-auto">
              <Button variant="outline" size="sm" className="w-full" onClick={() => {
                setIsPaymentDialogOpen(true);
                setIsAddingNewCard(false);
              }}>Update Payment Method</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Invoices List */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>View and download your past invoices.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpRight className="h-4 w-4" /> Billing Portal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-12 gap-4 p-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                <div className="col-span-4 md:col-span-5">Invoice</div>
                <div className="col-span-3 md:col-span-2">Amount</div>
                <div className="col-span-3 md:col-span-2">Date</div>
                <div className="col-span-2 md:col-span-2 text-right">Status</div>
                <div className="col-span-1 text-right"></div>
              </div>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {INVOICES.map((invoice) => (
                  <div key={invoice.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <div className="col-span-4 md:col-span-5 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-medium truncate">{invoice.description}</div>
                        <div className="text-xs text-slate-500 truncate md:hidden">{invoice.id}</div>
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-2 font-medium">{invoice.amount}</div>
                    <div className="col-span-3 md:col-span-2 text-slate-500">{new Date(invoice.date).toLocaleDateString()}</div>
                    <div className="col-span-2 md:col-span-2 text-right">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="col-span-12 md:col-span-1 flex justify-end mt-2 md:mt-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" /> Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                            <ArrowUpRight className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details Dialog */}
        <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Invoice Details</DialogTitle>
              <DialogDescription>
                Invoice {selectedInvoice?.id} for {selectedInvoice?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedInvoice && (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="text-sm text-slate-500">Amount Paid</div>
                    <div className="text-3xl font-bold">{selectedInvoice.amount}</div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                    {selectedInvoice.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-slate-500">Date Issued</div>
                    <div>{new Date(selectedInvoice.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-slate-500">Billing Period</div>
                    <div>{new Date(selectedInvoice.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-slate-500">Payment Method</div>
                    <div className="flex items-center gap-2">
                       <CreditCard className="h-4 w-4 text-slate-400" />
                       <span>Visa ending in 4242</span>
                    </div>
                  </div>
                   <div className="space-y-1">
                    <div className="text-sm font-medium text-slate-500">Billed To</div>
                    <div>Acme Inc.</div>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{selectedInvoice.description}</span>
                    <span className="font-medium">{selectedInvoice.amount}</span>
                  </div>
                   <div className="flex justify-between text-sm text-slate-500">
                    <span>Tax (0%)</span>
                    <span>$0.00</span>
                  </div>
                   <Separator />
                   <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{selectedInvoice.amount}</span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedInvoice(null)}>Close</Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Plan Dialog */}
        <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Change Subscription Plan</DialogTitle>
              <DialogDescription>
                Choose the plan that best fits your needs. You can upgrade or downgrade at any time.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              {PLANS.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative rounded-xl border-2 p-4 transition-all cursor-pointer hover:border-primary/50 ${
                    currentPlan === plan.id 
                      ? "border-primary bg-primary/5 dark:bg-primary/10" 
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  } ${plan.popular ? "md:-mt-4 md:mb-4 shadow-lg z-10" : ""}`}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-sm text-slate-500">{plan.period}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug h-8">
                      {plan.description}
                    </p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${currentPlan === plan.id ? "bg-primary/20 text-primary hover:bg-primary/30 border-none shadow-none" : ""}`}
                    variant={currentPlan === plan.id ? "outline" : "default"}
                    disabled={currentPlan === plan.id || isUpdating}
                  >
                    {isUpdating && currentPlan !== plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : currentPlan === plan.id ? (
                      "Current Plan"
                    ) : (
                      "Select Plan"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Update Payment Method Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update Payment Method</DialogTitle>
              <DialogDescription>
                Select an existing card or add a new one for future billing.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              {!isAddingNewCard ? (
                <div className="space-y-4">
                  <RadioGroup value={selectedCardId} onValueChange={setSelectedCardId} className="space-y-3">
                    {SAVED_CARDS.map((card) => (
                      <div key={card.id} className="flex items-center space-x-2 border border-slate-200 dark:border-slate-800 rounded-lg p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <RadioGroupItem value={card.id} id={card.id} />
                        <Label htmlFor={card.id} className="flex-1 cursor-pointer flex items-center justify-between font-normal">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-12 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{card.brand} ending in {card.last4}</div>
                              <div className="text-xs text-slate-500">Expires {card.expiry}</div>
                            </div>
                          </div>
                          {card.last4 === cardNumber && (
                             <Badge variant="secondary" className="text-[10px] h-5">Default</Badge>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-12" 
                    onClick={() => setIsAddingNewCard(true)}
                  >
                    <div className="h-8 w-12 bg-slate-50 dark:bg-slate-900 rounded border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                    </div>
                    <span>Add New Card...</span>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name on Card</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input 
                        id="card" 
                        placeholder="0000 0000 0000 0000" 
                        className="pl-9" 
                        onChange={(e) => setCardNumber(e.target.value.slice(-4))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              {isAddingNewCard ? (
                <Button variant="ghost" onClick={() => setIsAddingNewCard(false)} disabled={isUpdating}>
                  Back
                </Button>
              ) : (
                <div /> /* Spacer */
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePaymentMethod} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Save Payment Method"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}
