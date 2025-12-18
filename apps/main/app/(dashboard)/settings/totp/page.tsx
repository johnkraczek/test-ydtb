"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@ydtb/ui/base/button";
import { Card, CardContent, CardHeader } from "@ydtb/ui/base/card";
import { Alert, AlertDescription } from "@ydtb/ui/base/alert";
import { Shield, ShieldCheck, ShieldX, Loader2, QrCode } from "lucide-react";

export default function TOTPSettingsPage() {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [showSetup, setShowSetup] = useState(false);

  const handleEnableTwoFactor = async () => {
    setError("");
    setIsGenerating(true);

    try {
      // TODO: Generate TOTP secret via API
      // const response = await fetch('/api/auth/2fa/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const data = await response.json();

      // Mock data for now
      const mockSecret = "JBSWY3DPEHPK3PXP";
      const mockBackupCodes = [
        "123456", "789012", "345678", "901234", "567890", "234567",
      ];

      setSecret(mockSecret);
      setBackupCodes(mockBackupCodes);
      setShowSetup(true);
    } catch (err) {
      setError("Failed to generate TOTP secret");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerifyAndEnable = async (totpCode: string) => {
    setError("");
    setIsGenerating(true);

    try {
      // TODO: Verify TOTP code and enable 2FA via API
      console.log("Verifying TOTP code:", totpCode, "with secret:", secret);

      // Mock verification - in real implementation, this would validate the code
      if (totpCode.length === 6) {
        setIsTwoFactorEnabled(true);
        setShowSetup(false);
        setSecret("");
        setBackupCodes([]);
      } else {
        setError("Invalid TOTP code");
      }
    } catch (err) {
      setError("Failed to verify TOTP code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    setError("");
    setIsGenerating(true);

    try {
      // TODO: Disable 2FA via API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsTwoFactorEnabled(false);
    } catch (err) {
      setError("Failed to disable 2FA");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
            </div>
            <p className="text-sm text-slate-500">
              Add an extra layer of security to your account with Time-based One-Time Passwords (TOTP)
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-500">
                  {isTwoFactorEnabled
                    ? "Your account is protected with 2FA"
                    : "2FA is not enabled for your account"}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${isTwoFactorEnabled
                  ? "bg-green-100 text-green-800"
                  : "bg-slate-100 text-slate-800"
                }`}>
                {isTwoFactorEnabled ? (
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" />
                    Enabled
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <ShieldX className="h-4 w-4" />
                    Disabled
                  </span>
                )}
              </div>
            </div>

            {!showSetup && (
              <div className="text-center">
                {!isTwoFactorEnabled ? (
                  <Button
                    onClick={handleEnableTwoFactor}
                    disabled={isGenerating}
                    className="w-full sm:w-auto"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Enable Two-Factor Authentication
                  </Button>
                ) : (
                  <Button
                    onClick={handleDisableTwoFactor}
                    disabled={isGenerating}
                    variant="destructive"
                    className="w-full sm:w-auto"
                  >
                    <ShieldX className="mr-2 h-4 w-4" />
                    Disable Two-Factor Authentication
                  </Button>
                )}
              </div>
            )}

            {showSetup && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 p-6 border rounded-lg bg-slate-50"
              >
                <div>
                  <h3 className="font-medium mb-2">Step 1: Scan QR Code</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>

                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <QrCode className="h-48 w-48 text-slate-400" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-500">Can't scan?</p>
                    <p className="text-xs font-mono text-slate-600 mt-1">{secret}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Step 2: Enter Verification Code</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Enter the 6-digit code from your authenticator app
                  </p>

                  <div className="flex justify-center">
                    {/* TODO: Add OTP input component */}
                    <input
                      type="text"
                      maxLength={6}
                      className="w-64 text-center text-2xl tracking-widest px-3 py-2 border rounded-md"
                      placeholder="000000"
                    />
                  </div>

                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowSetup(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="000000"]') as HTMLInputElement;
                        if (input) {
                          handleVerifyAndEnable(input.value);
                        }
                      }}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify and Enable"
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Backup Codes</h3>
                  <p className="text-sm text-slate-600">
                    Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
                  </p>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {backupCodes.map((code, index) => (
                      <code key={index} className="p-2 text-xs bg-slate-100 rounded text-center">
                        {code}
                      </code>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}