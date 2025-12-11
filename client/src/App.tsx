import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/dashboard";
import ContactsPage from "@/pages/contacts";
import ContactDetailPage from "@/pages/contact-detail";
import TeamPage from "@/pages/team";
import TeamMemberPage from "@/pages/team-member";
import MediaPage from "@/pages/media";
import MessagesPage from "@/pages/messages";
import AutomationPage from "@/pages/automation";
import AutomationEditor from "@/pages/automation-editor";
import PagesPage from "@/pages/pages";
import PageEditor from "@/pages/page-editor";
import LaunchpadPage from "@/pages/launchpad";
import EmailSetupPage from "@/pages/launchpad-setup/email";
import PaymentSetupPage from "@/pages/launchpad-setup/payment";
import SopPage from "@/pages/sop";
import SopDetailPage from "@/pages/sop-detail";
import SopEditorPage from "@/pages/sop-editor";
import DomainSettingsPage from "@/pages/settings/domain";
import AccountSettingsPage from "@/pages/settings/account";
import BillingSettingsPage from "@/pages/settings/billing";
import CustomFieldsPage from "@/pages/custom-fields";
import CustomValuesPage from "@/pages/custom-values";
import AgencyDashboardPage from "@/pages/agency-dashboard";
import AgencyWorkspacesPage from "@/pages/agency-workspaces";
import AgencyWorkspaceDetailPage from "@/pages/agency-workspace-detail";
import AgencyTemplatesPage from "@/pages/agency-templates";
import AgencySettingsPage from "@/pages/agency-settings";
import AgencyProfilePage from "@/pages/agency-settings/profile";
import AgencyTeamPage from "@/pages/agency-settings/team";
import AgencyBillingPage from "@/pages/agency-settings/billing";
import AgencyWhiteLabelPage from "@/pages/agency-settings/white-label";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/agency" component={AgencyDashboardPage} />
      <Route path="/agency/workspaces" component={AgencyWorkspacesPage} />
      <Route path="/agency/workspaces/:id" component={AgencyWorkspaceDetailPage} />
      <Route path="/agency/templates" component={AgencyTemplatesPage} />
      {/* <Route path="/agency/settings" component={AgencySettingsPage} /> */}
      <Route path="/agency/settings/profile" component={AgencyProfilePage} />
      <Route path="/agency/settings/team" component={AgencyTeamPage} />
      <Route path="/agency/settings/billing" component={AgencyBillingPage} />
      <Route path="/agency/settings/white-label" component={AgencyWhiteLabelPage} />
      <Route path="/launchpad" component={LaunchpadPage} />
      <Route path="/launchpad/email" component={EmailSetupPage} />
      <Route path="/launchpad/payment" component={PaymentSetupPage} />
      <Route path="/settings/domain" component={DomainSettingsPage} />
      <Route path="/settings/account" component={AccountSettingsPage} />
      <Route path="/settings/billing" component={BillingSettingsPage} />
      <Route path="/settings/custom-values" component={CustomValuesPage} />
      <Route path="/custom-fields" component={CustomFieldsPage} />
      <Route path="/contacts" component={ContactsPage} />
      <Route path="/contacts/:id" component={ContactDetailPage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/team/member/:id" component={TeamMemberPage} />
      <Route path="/team/chat/:chatId" component={TeamPage} />
      <Route path="/media" component={MediaPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/automation" component={AutomationPage} />
      <Route path="/automation/:id/edit" component={AutomationEditor} />
      <Route path="/pages" component={PagesPage} />
      <Route path="/pages/:id/edit" component={PageEditor} />
      <Route path="/sop" component={SopPage} />
      <Route path="/sop/new" component={SopEditorPage} />
      <Route path="/sop/:id" component={SopDetailPage} />
      <Route path="/sop/:id/edit" component={SopEditorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeColorProvider } from "@/hooks/use-theme-color";
import { ThemePatternProvider } from "@/hooks/use-theme-pattern";
import { MediaProvider } from "@/context/media-context";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class" enableSystem>
        <ThemeColorProvider defaultThemeColor="zinc" storageKey="vite-ui-theme-color">
          <ThemePatternProvider defaultThemePattern="dots" storageKey="vite-ui-theme-pattern">
            <MediaProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </MediaProvider>
          </ThemePatternProvider>
        </ThemeColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
