export default function WelcomePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Welcome to YDTB!
        </h1>
        <p className="text-slate-600">
          Your email has been verified. The workspace onboarding wizard will be implemented in the next step.
        </p>
      </div>
    </div>
  );
}