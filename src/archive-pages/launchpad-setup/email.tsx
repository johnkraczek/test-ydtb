import { useState } from "react";
import { SetupPageLayout } from "~/components/launchpad/SetupPageLayout";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Info, Mail, CheckCircle2 } from "lucide-react";

export default function EmailSetupPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState("");

  const handleConnect = () => {
    // Simulate connection
    setTimeout(() => setIsConnected(true), 1000);
  };

  return (
    <SetupPageLayout
      title="Connect Email Provider"
      description="Link your professional email to send automated notifications and campaigns."
      isCompleted={isConnected}
      onComplete={() => setIsConnected(true)}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Provider Settings</h3>
          <p className="text-sm text-slate-500">Choose your email service provider to get started.</p>
        </div>

        {isConnected ? (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Connected Successfully</AlertTitle>
            <AlertDescription>
              Your email provider <strong>{provider || "Gmail"}</strong> is now connected and ready to send.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Service</Label>
              <Select onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmail">Gmail / Google Workspace</SelectItem>
                  <SelectItem value="outlook">Outlook / Office 365</SelectItem>
                  <SelectItem value="smtp">Custom SMTP</SelectItem>
                  <SelectItem value="resend">Resend</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {provider === "smtp" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input placeholder="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input placeholder="587" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </>
            )}

            <Button onClick={handleConnect} disabled={!provider} className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Connect Account
            </Button>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-700 text-sm">
          <Info className="h-5 w-5 flex-shrink-0" />
          <p>
            We recommend using a dedicated sending domain to improve deliverability rates for your marketing campaigns.
          </p>
        </div>
      </div>
    </SetupPageLayout>
  );
}
