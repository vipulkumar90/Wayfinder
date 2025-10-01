import type { PropsWithChildren } from "react";

export function AuthShell({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,#e8f1ff,#f8fbff_60%,#ffffff_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(103,85,237,0.18),transparent)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
