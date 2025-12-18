import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@ydtb/core/server/auth'
import OnboardingWizard from '@ydtb/core/components/onboarding/OnboardingWizard'
import { WelcomeWrapper } from './components/WelcomeWrapper'

export default async function WelcomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If user is not authenticated, redirect to login
  if (!session?.user) {
    redirect('/login');
  }

  // Check if user already has organizations/workspaces
  try {
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    // If user has workspaces, redirect to dashboard
    if (organizations && organizations.length > 0) {
      redirect('/');
    }
  } catch (error) {
    // Continue to onboarding if we can't check organizations
  }

  // User is authenticated but has no workspaces, show onboarding with profile avatar
  return (
    <WelcomeWrapper>
      <OnboardingWizard />
    </WelcomeWrapper>
  );
}