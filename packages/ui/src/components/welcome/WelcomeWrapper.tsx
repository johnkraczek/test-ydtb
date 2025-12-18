"use client";

import { SimpleProfileAvatar } from "@ydtb/ui/base/SimpleProfileAvatar";

interface WelcomeWrapperProps {
  children: React.ReactNode;
}

export function WelcomeWrapper({ children }: WelcomeWrapperProps) {
  return (
    <div className="relative min-h-screen">
      {/* Profile Avatar in top right */}
      <div className="absolute top-4 right-4 z-50">
        <SimpleProfileAvatar />
      </div>

      {/* Main content */}
      {children}
    </div>
  );
}