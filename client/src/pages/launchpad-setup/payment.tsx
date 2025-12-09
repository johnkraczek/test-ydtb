import { useState } from "react";
import { SetupPageLayout } from "@/components/launchpad/SetupPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";

export default function PaymentSetupPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [mode, setMode] = useState("test");

  const handleConnect = () => {
    setTimeout(() => setIsConnected(true), 1500);
  };

  return (
    <SetupPageLayout
      title="Connect Payments"
      description="Start accepting secure payments from your customers."
      isCompleted={isConnected}
      onComplete={() => setIsConnected(true)}
    >
      <div className="space-y-6">
        <div className="space-y-2">
           <h3 className="text-lg font-medium">Payment Gateway</h3>
           <p className="text-sm text-slate-500">Configure how you want to receive payments.</p>
        </div>

        {isConnected ? (
           <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Stripe Connected</AlertTitle>
              <AlertDescription>
                 Your Stripe account is successfully linked in <strong>{mode === 'test' ? 'Test' : 'Live'} Mode</strong>.
              </AlertDescription>
           </Alert>
        ) : (
          <div className="space-y-6">
             <RadioGroup defaultValue="stripe" className="grid grid-cols-2 gap-4">
                <div className="relative flex flex-col gap-2 rounded-xl border-2 border-primary bg-primary/5 p-4 cursor-pointer">
                   <div className="flex items-center gap-2 font-semibold">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe">Stripe</Label>
                   </div>
                   <p className="text-xs text-slate-500 pl-6">Accept cards, Apple Pay, Google Pay, and more.</p>
                </div>
                <div className="relative flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 opacity-60 cursor-not-allowed">
                   <div className="flex items-center gap-2 font-semibold">
                      <RadioGroupItem value="paypal" id="paypal" disabled />
                      <Label htmlFor="paypal">PayPal</Label>
                   </div>
                   <p className="text-xs text-slate-500 pl-6">Coming soon</p>
                </div>
             </RadioGroup>

             <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                   <Label>Environment</Label>
                   <div className="flex items-center bg-slate-100 rounded-lg p-1">
                      <button 
                        onClick={() => setMode('test')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === 'test' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        Test Mode
                      </button>
                      <button 
                        onClick={() => setMode('live')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === 'live' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        Live Mode
                      </button>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="space-y-2">
                      <Label>Public Key</Label>
                      <Input placeholder={mode === 'test' ? 'pk_test_...' : 'pk_live_...'} className="font-mono text-xs" />
                   </div>
                   <div className="space-y-2">
                      <Label>Secret Key</Label>
                      <div className="relative">
                         <Input type="password" placeholder={mode === 'test' ? 'sk_test_...' : 'sk_live_...'} className="font-mono text-xs pr-10" />
                         <Lock className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                      </div>
                   </div>
                </div>
             </div>

             <Button onClick={handleConnect} className="w-full bg-[#635BFF] hover:bg-[#5851E1] text-white">
                <CreditCard className="mr-2 h-4 w-4" />
                Connect Stripe
             </Button>
          </div>
        )}
      </div>
    </SetupPageLayout>
  );
}
