# File Organization Plan

## Current Location → Target Location

### Dashboard Components (app/dashboard)
| Should Move | Current Location | Target Location | Type |
|------------|------------------|----------------|------|
| yes | `app/dashboard/DashboardFooter.tsx` | `components/dashboard/DashboardFooter.tsx` | Dashboard component |
| yes | `app/dashboard/components/DashboardClient.tsx` | `components/dashboard/DashboardClient.tsx` | Dashboard component |
| yes | `app/dashboard/headers/CommandPalette.tsx` | `components/dashboard/headers/CommandPalette.tsx` | Dashboard header |
| yes | `app/dashboard/headers/HelpDropdown.tsx` | `components/dashboard/headers/HelpDropdown.tsx` | Dashboard header |
| yes | `app/dashboard/headers/MainHeader.tsx` | `components/dashboard/headers/MainHeader.tsx` | Dashboard header |
| yes | `app/dashboard/headers/NotificationDropdown.tsx` | `components/dashboard/headers/NotificationDropdown.tsx` | Dashboard header |
| yes | `app/dashboard/headers/ProfileAvatar.tsx` | `components/dashboard/headers/ProfileAvatar.tsx` | Dashboard header |
| yes | `app/dashboard/headers/ToolHeader.tsx` | `components/dashboard/headers/ToolHeader.tsx` | Dashboard header |
| yes | `app/dashboard/headers/WorkspaceDropdown.tsx` | `components/dashboard/headers/WorkspaceDropdown.tsx` | Dashboard header |
| yes | `app/dashboard/sidebars/IconRail.tsx` | `components/dashboard/sidebars/IconRail.tsx` | Dashboard sidebar |
| yes | `app/dashboard/sidebars/ToolSidebar.tsx` | `components/dashboard/sidebars/ToolSidebar.tsx` | Dashboard sidebar |
| yes | `app/dashboard/customization/CustomizeNavigationDialog.tsx` | `components/dashboard/customization/CustomizeNavigationDialog.tsx` | Dashboard customization |

### Hooks
| Should Move | Current Location | Target Location | Type |
|------------|------------------|----------------|------|
| yes | `hooks/use-theme-color.tsx` | `hooks/theme/use-theme-color.tsx` | Theme hook |
| yes | `hooks/use-theme-pattern.tsx` | `hooks/theme/use-theme-pattern.tsx` | Theme hook |

### Core Components
| Should Move | Current Location | Target Location | Type |
|------------|------------------|----------------|------|
| yes | `components/theme-provider.tsx` | `components/providers/theme-provider.tsx` | Provider |
| yes | `app/providers.tsx` | `components/providers/app-providers.tsx` | Provider |

### UI Components (already well-organized)
| Should Move | Current Location | Target Location | Type |
|------------|------------------|----------------|------|
| | `components/ui/*` | `components/ui/*` | UI components (no change) |

### App Structure (keep as is)
| Should Move | Current Location | Target Location | Type |
|------------|------------------|----------------|------|
| | `app/layout.tsx` | `app/layout.tsx` | App layout |
| | `app/dashboard/layout.tsx` | `app/dashboard/layout.tsx` | Dashboard layout |
| | `app/dashboard/page.tsx` | `app/dashboard/page.tsx` | Dashboard page |

### Configuration (keep as is)
| Should Move | Current Location | Target Location | Type |
|------------|------------------|----------------|------|
| | `lib/utils.ts` | `lib/utils.ts` | Utility functions |
| | `index.css` | `index.css` | Global styles |

## New Folder Structure After Reorganization
```
src/
├── app/                          # Next.js app router
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── headers/
│   │   │   ├── CommandPalette.tsx
│   │   │   ├── HelpDropdown.tsx
│   │   │   ├── MainHeader.tsx
│   │   │   ├── NotificationDropdown.tsx
│   │   │   ├── ProfileAvatar.tsx
│   │   │   ├── ToolHeader.tsx
│   │   │   └── WorkspaceDropdown.tsx
│   │   ├── sidebars/
│   │   │   ├── IconRail.tsx
│   │   │   └── ToolSidebar.tsx
│   │   ├── customization/
│   │   │   └── CustomizeNavigationDialog.tsx
│   │   ├── DashboardClient.tsx
│   │   └── DashboardFooter.tsx
│   ├── providers/                # Context providers
│   │   ├── app-providers.tsx
│   │   └── theme-provider.tsx
│   └── ui/                       # UI components (shadcn/ui)
├── hooks/
│   └── theme/                    # Theme-related hooks
│       ├── use-theme-color.tsx
│       └── use-theme-pattern.tsx
├── lib/
│   └── utils.ts
└── index.css
```

## Benefits of This Reorganization

1. **Better Separation of Concerns**: Components are clearly separated from app structure
2. **Improved Discoverability**: Similar files are grouped together logically
3. **Scalability**: Easier to add new components in the right place
4. **Maintainability**: Cleaner structure makes the codebase easier to navigate
5. **Industry Standards**: Follows React/Next.js best practices

## Migration Steps

1. Create the new folder structure
2. Move files according to the table above
3. Update all import paths in the files
4. Test that the application still works
5. Commit the changes

## Important Notes

- After moving files, all import statements will need to be updated
- The `app/providers.tsx` should be moved to `components/providers/app-providers.tsx`
- Make sure to update the import in `app/layout.tsx` if you move providers
- Consider using absolute imports (with `~/` or `@/`) to make imports cleaner