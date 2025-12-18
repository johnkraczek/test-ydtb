export const WORKSPACE_WIZARD_ERRORS = {
  // Validation errors
  SLUG_REQUIRED: "A workspace subdomain is required",
  SLUG_INVALID: "Subdomain can only contain lowercase letters, numbers, and hyphens",
  SLUG_TOO_SHORT: "Subdomain must be at least 3 characters",
  SLUG_TAKEN: "This subdomain is already taken. Please choose another.",
  NAME_REQUIRED: "Please enter a workspace name",
  NAME_TOO_SHORT: "Workspace name must be at least 2 characters",
  NAME_TOO_LONG: "Workspace name cannot exceed 100 characters",

  // General errors
  CREATION_FAILED: "Failed to create workspace. Please try again.",
  INVITATION_FAILED: "Invitation failed - please check email addresses",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",

  // Success messages
  WORKSPACE_CREATED: "Workspace created successfully!",
  INVITATION_SENT: "Invitations sent successfully!",
} as const;