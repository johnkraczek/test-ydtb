import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/dashboard";
import ContactsPage from "@/pages/contacts";
import ContactDetailPage from "@/pages/contact-detail";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/launchpad" component={LaunchpadPage} />
      <Route path="/launchpad/email" component={EmailSetupPage} />
      <Route path="/launchpad/payment" component={PaymentSetupPage} />
      <Route path="/contacts" component={ContactsPage} />
      <Route path="/contacts/:id" component={ContactDetailPage} />
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
import { MediaProvider } from "@/context/media-context";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class" enableSystem>
        <ThemeColorProvider defaultThemeColor="zinc" storageKey="vite-ui-theme-color">
          <MediaProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </MediaProvider>
        </ThemeColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
