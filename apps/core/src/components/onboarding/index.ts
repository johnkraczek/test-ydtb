// Main components
export { ProgressIndicator } from "./ProgressIndicator";
export { WorkspaceIcon } from "./WorkspaceIcon";
export { IconPicker } from "./IconPicker";
export { UrlInput } from "./UrlInput";
export { ToolsGrid } from "./ToolsGrid";
export { TeamMemberForm } from "./TeamMemberForm";

// Step components
export { Step0Welcome } from "./steps/Step0Welcome";
export { Step1Identity } from "./steps/Step1Identity";
export { Step2Description } from "./steps/Step2Description";
export { Step5Review } from "./steps/Step5Review";

// Types and constants
export type {
  WorkspaceType,
  Role,
  TeamMember,
  WorkspaceData,
  CropArea,
  Tool,
  IconOption,
  ColorOption,
  MockInvite
} from "./types";

export {
  STEPS,
  AVAILABLE_TOOLS,
  ICON_LIST,
  COLORS,
  MOCK_INVITES,
  ROLE_OPTIONS
} from "./constants";

export { createImage, getCroppedImg, generateSlug, getColorClasses } from "./utils";