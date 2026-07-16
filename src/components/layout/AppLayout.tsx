import { Plus } from "lucide-react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
    </div>
  );
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-surface-light text-slate-950 antialiased dark:bg-surface-dark dark:text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl dark:bg-primary/20" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-info/10 blur-3xl dark:bg-info/15" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0 lg:pl-[280px]">
          <Header />
          <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-24 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-soft transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:hidden"
        aria-label="Add transaction"
      >
        <Plus className="h-6 w-6" aria-hidden="true" />
      </button>

      <BottomNavigation />
    </div>
  );
}
