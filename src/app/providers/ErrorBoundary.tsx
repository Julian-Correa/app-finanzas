import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("FinOS error boundary", error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-surface-light px-6 text-slate-950 dark:bg-surface-dark dark:text-white">
          <section className="max-w-md rounded-card border border-slate-200/70 bg-white/85 p-8 text-center shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">FinOS</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-300">
              The app encountered an unexpected error. Refresh the page and try again.
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
