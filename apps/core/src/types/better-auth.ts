// Types for Better Auth organization API

export interface CreateOrganizationBody {
  name: string;
  slug: string; // Required by Better Auth API
  userId?: string;
  logo?: string;
  metadata?: Record<string, any>;
  keepCurrentActiveOrganization?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationResponse extends Organization {
}

export interface InviteUserBody {
  email: string;
  role: "owner" | "admin" | "member";
  organizationId: string;
}

export interface InviteUserResponse {
  data?: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
    status: "pending" | "accepted" | "rejected";
    expiresAt: Date;
  };
  error?: string;
  status?: number;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "member" | "guest";
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export interface ListMembersResponse {
  members?: OrganizationMember[];
  error?: string;
  status?: number;
}