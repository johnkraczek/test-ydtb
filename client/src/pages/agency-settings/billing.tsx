
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Check, 
  Download, 
  AlertCircle, 
  Zap,
  Building,
  Calendar,
  History,
  Plus,
  ArrowRight,
  Shield,
  Star
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const CURRENT_PLAN = {
  name: "Agency Unlimited",
  price: "$297",
  period: "month",
  status: "Active",
  nextBilling: "May 15, 2024",
  features: [
    "Unlimited Sub-Accounts",
    "Unlimited Team Members",
    "White Label Dashboard",
    "API Access",
    "Priority Support",
    "Custom Domains"
  ]
};

const PAYMENT_METHODS = [
  {
    id: "1",
    type: "Visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
    brand: "visa"
  },
  {
    id: "2",
    type: "Mastercard",
    last4: "8822",
    expiry: "09/24",
    isDefault: false,
    brand: "mastercard"
  }
];

const INVOICES = [
  {
    id: "INV-2024-001",
    date: "Apr 15, 2024",
    amount: "$297.00",
    status: "Paid",
    downloadUrl: "#"
  },
  {
    id: "INV-2024-002",
    date: "Mar 15, 2024",
    amount: "$297.00",
    status: "Paid",
    downloadUrl: "#"
  },
  {
    id: "INV-2024-003",
    date: "Feb 15, 2024",
    amount: "$297.00",
    status: "Paid",
    downloadUrl: "#"
  },
  {
    id: "INV-2024-004",
    date: "Jan 15, 2024",
    amount: "$297.00",
    status: "Paid",
    downloadUrl: "#"
  }
];

const USAGE_STATS = [
  { label: "Sub-Accounts", used: 12, limit: "Unlimited", percent: 10 }, // Just visual
  { label: "Team Members", used: 8, limit: "Unlimited", percent: 5 },
  { label: "SMS Segments", used: 14502, limit: 25000, percent: 58 },
  { label: "Email Sends", used: 45200, limit: 100000, percent: 45 }
];

const AVAILABLE_PLANS = [
  {
    id: "starter",
    name: "Agency Starter",
    price: "$97",
    period: "month",
    description: "Perfect for new agencies getting started.",
    features: [
      "Up to 3 Sub-Accounts",
      "Unlimited Team Members",
      "Standard Support",
      "API Access"
    ]
  },
  {
    id: "unlimited",
    name: "Agency Unlimited",
    price: "$297",
    period: "month",
    description: "Scale your agency without limits.",
    popular: true,
    features: [
      "Unlimited Sub-Accounts",
      "Unlimited Team Members",
      "Priority Support",
      "API Access",
      "White Label Dashboard",
      "Custom Domains"
    ]
  },
  {
    id: "pro",
    name: "Agency Pro",
    price: "$497",
    period: "month",
    description: "Advanced features for power users.",
    features: [
      "Everything in Unlimited",
      "SaaS Configurator",
      "Advanced API Access",
      "Dedicated Account Manager",
      "Early Access to Features"
    ]
  }
];

export default function AgencyBillingPage() {
  const { toast } = useToast();
  const [isManageSubscriptionOpen, setIsManageSubscriptionOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("unlimited");

  const handleUpdatePlan = () => {
    setIsManageSubscriptionOpen(false);
    toast({
      title: "Plan Updated",
      description: "Your subscription has been updated successfully.",
    });
  };

  return (
    <DashboardLayout 
      mode="agency" 
      activeTool="agency-settings"
      header={
        <DashboardPageHeader 
          title="Billing" 
          description="Manage your agency subscription and payment methods."
          hideBreadcrumbs={true}
          actions={
            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              View Billing History
            </Button>
          }
        />
      }
    >
      <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
        
        {/* Current Plan Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Current Plan</CardTitle>
                    <CardDescription>You are currently on the {CURRENT_PLAN.name} plan</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                  {CURRENT_PLAN.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">{CURRENT_PLAN.price}</span>
                <span className="text-slate-500 mb-1">/{CURRENT_PLAN.period}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CURRENT_PLAN.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div className="text-sm">
                    <span className="text-slate-500">Next billing date:</span>
                    <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">{CURRENT_PLAN.nextBilling}</span>
                  </div>
                </div>
                <Button 
                  variant="link" 
                  className="text-primary h-auto p-0"
                  onClick={() => setIsManageSubscriptionOpen(true)}
                >
                  Manage Subscription <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resource Usage</CardTitle>
              <CardDescription>Current billing cycle usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {USAGE_STATS.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{stat.label}</span>
                    <span className="text-slate-500">{stat.used} / {stat.limit}</span>
                  </div>
                  <Progress value={stat.percent} className="h-2" />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Increase Limits</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your credit cards and payment details.</CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" /> Add Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-16 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center border border-slate-200 dark:border-slate-700">
                         {/* Simple visual representation of card brand */}
                         <span className="font-bold text-xs uppercase text-slate-500">{method.brand}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {method.type} ending in {method.last4}
                          </p>
                          {method.isDefault && (
                            <Badge variant="secondary" className="text-[10px] h-5">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing Info */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Company details for invoices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-slate-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-slate-900 dark:text-slate-100">Acme Agency Inc.</p>
                  <p className="text-slate-500">123 Marketing Ave</p>
                  <p className="text-slate-500">Suite 400</p>
                  <p className="text-slate-500">San Francisco, CA 94105</p>
                  <p className="text-slate-500">United States</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-slate-400" />
                <div className="text-sm">
                  <p className="text-slate-500">Tax ID: <span className="font-medium text-slate-900 dark:text-slate-100">US-123456789</span></p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Update Info</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Recent billing history and receipts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-3 font-medium">Invoice ID</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {INVOICES.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        {invoice.id}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {invoice.date}
                      </td>
                      <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                        {invoice.amount}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>

      <Dialog open={isManageSubscriptionOpen} onOpenChange={setIsManageSubscriptionOpen}>
        <DialogContent className="max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              Upgrade or downgrade your agency plan. Changes take effect immediately.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {AVAILABLE_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`
                  relative rounded-xl border p-6 cursor-pointer transition-all duration-200
                  ${selectedPlan === plan.id 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 hover:shadow-sm'
                  }
                `}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`h-4 w-4 mt-0.5 ${selectedPlan === plan.id ? 'text-primary' : 'text-slate-400'}`} />
                      <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedPlan === plan.id && (
                  <div className="absolute top-4 right-4">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              Cancel Subscription
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsManageSubscriptionOpen(false)}>
                Close
              </Button>
              <Button onClick={handleUpdatePlan}>
                Update Plan
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
