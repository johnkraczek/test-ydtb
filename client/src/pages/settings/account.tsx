
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Loader2, 
  CheckCircle2,
  Bell,
  Globe,
  Shield,
  Smartphone,
  Fingerprint,
  Trash2,
  Laptop,
  ArrowRight,
  QrCode
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function AccountSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("Jane");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("jane.doe@example.com");
  
  const [passkeys, setPasskeys] = useState<Array<{id: string, name: string, addedAt: string}>>([]);
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);

  // 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  const handleSaveProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully");
    }, 1000);
  };

  const handleSetup2FA = () => {
    setTwoFAStep(1);
    setOtpCode("");
    setIs2FADialogOpen(true);
  };

  const handleVerifyOTP = () => {
    if (otpCode.length !== 6) return;
    
    setIsVerifying2FA(true);
    setTimeout(() => {
        setIsVerifying2FA(false);
        setIs2FAEnabled(true);
        setIs2FADialogOpen(false);
        toast.success("Two-Factor Authentication enabled successfully");
    }, 1500);
  };

  const handleAddPasskey = () => {
    setIsAddingPasskey(true);
    // Simulate webauthn ceremony
    setTimeout(() => {
        setIsAddingPasskey(false);
        const newPasskey = {
            id: Date.now().toString(),
            name: "MacBook Pro (Touch ID)",
            addedAt: new Date().toLocaleDateString()
        };
        setPasskeys([...passkeys, newPasskey]);
        toast.success("Passkey added successfully");
    }, 1500);
  };

  const handleDeletePasskey = (id: string) => {
    setPasskeys(passkeys.filter(p => p.id !== id));
    toast.success("Passkey removed");
  };

  return (
    <DashboardLayout 
      activeTool="settings"
      header={
        <DashboardPageHeader
          title="Account Settings"
          description="Manage your personal information and security preferences."
          hideBreadcrumbs={true}
          actions={<></>}
        />
      }
    >
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        
        {/* Profile Section */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your photo and personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-slate-50 dark:border-slate-900 shadow-sm">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs">Change Photo</Button>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input 
                        id="firstName" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-9" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                      id="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9" 
                    />
                  </div>
                  <p className="text-xs text-slate-500">This is the email you will use to login.</p>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your language and regional settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Select defaultValue="utc">
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                      <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                      <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="cet">CET (Central European Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your password and authentication methods.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-500" /> Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm">Update Password</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" /> Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${is2FAEnabled ? "bg-green-100 dark:bg-green-900/30" : "bg-indigo-50 dark:bg-indigo-900/20"}`}>
                    <Smartphone className={`h-5 w-5 ${is2FAEnabled ? "text-green-600 dark:text-green-400" : "text-indigo-600 dark:text-indigo-400"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <div className="font-medium text-slate-900 dark:text-slate-100">Authenticator App</div>
                        {is2FAEnabled && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                Active
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-slate-500">Secure your account with TOTP (Google Authenticator, Authy).</p>
                  </div>
                </div>
                {is2FAEnabled ? (
                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => setIs2FAEnabled(false)}>Disable</Button>
                ) : (
                    <Button variant="outline" onClick={handleSetup2FA}>Setup</Button>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-slate-500" /> Passkey Authentication
              </h3>
              
              {passkeys.length > 0 ? (
                <div className="space-y-3">
                    {passkeys.map(passkey => (
                        <div key={passkey.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center shrink-0">
                                    <Laptop className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium text-slate-900 dark:text-slate-100">{passkey.name}</div>
                                        <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                            Active
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-500">Added on {passkey.addedAt}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600" onClick={() => handleDeletePasskey(passkey.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full border-dashed" onClick={handleAddPasskey} disabled={isAddingPasskey}>
                         {isAddingPasskey ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> Registering...
                            </>
                         ) : (
                            <>
                                <Fingerprint className="h-3.5 w-3.5 mr-2" /> Add Another Passkey
                            </>
                         )}
                    </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center shrink-0">
                        <Fingerprint className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">Biometric Login</div>
                        <p className="text-sm text-slate-500">Log in securely using your device's fingerprint or face recognition.</p>
                    </div>
                    </div>
                    <Button variant="outline" onClick={handleAddPasskey} disabled={isAddingPasskey}>
                        {isAddingPasskey ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying...
                            </>
                        ) : "Add Passkey"}
                    </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what you want to be notified about.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-slate-500">Receive emails about your account activity.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Marketing Emails</Label>
                <p className="text-sm text-slate-500">Receive emails about new products, features, and more.</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Security Alerts</Label>
                <p className="text-sm text-slate-500">Receive emails about login attempts and security changes.</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
          </CardContent>
        </Card>

      </div>

        {/* 2FA Setup Dialog */}
        <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{twoFAStep === 1 ? "Set up Authenticator" : "Verify Authentication"}</DialogTitle>
                    <DialogDescription>
                        {twoFAStep === 1 
                            ? "Scan the QR code with your authenticator app to get started." 
                            : "Enter the 6-digit code from your authenticator app."
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {twoFAStep === 1 ? (
                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative h-48 w-48 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                                <QrCode className="h-32 w-32 text-slate-900" strokeWidth={1.5} />
                                {/* Placeholder for actual QR code */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="h-40 w-40 border-2 border-slate-900/10 rounded-lg"></div>
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-sm text-slate-500">
                                    Open your authenticator app (like Google Authenticator or Authy) and scan the QR code.
                                </p>
                                <Button variant="link" className="text-xs h-auto p-0 text-primary">
                                    Can't scan? Enter code manually
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-6">
                             <div className="flex justify-center w-full">
                                <InputOTP
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(value) => setOtpCode(value)}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <div className="w-4" /> {/* Spacer */}
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            <p className="text-xs text-center text-slate-500">
                                Enter the 6-digit code generated by your app to verify the connection.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex items-center justify-between sm:justify-between">
                    {twoFAStep === 2 ? (
                        <Button variant="ghost" onClick={() => setTwoFAStep(1)}>Back</Button>
                    ) : (
                        <div /> 
                    )}
                    
                    {twoFAStep === 1 ? (
                        <Button onClick={() => setTwoFAStep(2)}>
                            Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleVerifyOTP} disabled={otpCode.length !== 6 || isVerifying2FA}>
                            {isVerifying2FA ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                                </>
                            ) : (
                                "Finish Setup"
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </DashboardLayout>
  );
}
