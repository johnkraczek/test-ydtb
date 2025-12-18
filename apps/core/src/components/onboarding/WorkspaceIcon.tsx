import { Avatar, AvatarFallback, AvatarImage } from "@ydtb/ui/base/avatar";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspaceData } from "./types";
import { ICON_LIST } from "./constants";
import { getColorClasses } from "./utils";

interface WorkspaceIconProps {
  data: WorkspaceData;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function WorkspaceIcon({ data, size = "md", className }: WorkspaceIconProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
    xl: "h-10 w-10"
  };

  const renderIcon = () => {
    if (data.iconType === "image" && data.icon) {
      return <AvatarImage key="image" src={data.icon} />;
    }

    // If lucide icon
    const IconComponent = ICON_LIST.find(i => i.name === data.icon)?.icon || Building2;
    const iconColorStyle = getColorClasses(data.iconColor || "indigo");
    const bgColorStyle = getColorClasses(data.backgroundColor || "indigo");

    return (
      <AvatarFallback key="icon" className={cn(bgColorStyle.softBg, iconColorStyle.text)}>
        <IconComponent className={iconSizeClasses[size]} />
      </AvatarFallback>
    );
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {renderIcon()}
    </Avatar>
  );
}