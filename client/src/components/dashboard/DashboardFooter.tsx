
export function DashboardFooter() {
  return (
    <footer className="border-t bg-white/50 backdrop-blur-sm px-8 py-2 mt-auto">
      <div className="flex items-center justify-between">
        <div className="text-slate-400 text-xs">
          © 2024 Acme Corp. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-slate-500 text-xs font-medium">
          <a className="transition-colors hover:text-indigo-600" href="#">
            Documentation
          </a>
          <a className="transition-colors hover:text-indigo-600" href="#">
            Support
          </a>
          <a className="transition-colors hover:text-indigo-600" href="#">
            Terms
          </a>
          <a className="transition-colors hover:text-indigo-600" href="#">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
