export type WorkspaceType = "Company" | "Team" | "Project" | "Personal" | "Location" | "Other";
export type Role = "Admin" | "Member" | "Guest";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  message?: string;
}

export interface WorkspaceData {
  name: string;
  type: WorkspaceType;
  customType?: string;
  slug: string;
  icon?: string;
  iconType: "image" | "lucide";
  description: string;
  members: TeamMember[];
  tools: string[];
  iconColor?: string;
  backgroundColor?: string;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface IconOption {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ColorOption {
  name: string;
  value: string;
}

export interface MockInvite {
  id: string;
  workspaceName: string;
  inviterName: string;
  inviterEmail: string;
  role: string;
  sentAt: string;
}