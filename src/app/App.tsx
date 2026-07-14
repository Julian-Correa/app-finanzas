import { BrowserRouter } from "react-router-dom";

import { AppProviders } from "@/app/providers/AppProviders";
import { ErrorBoundary } from "@/app/providers/ErrorBoundary";
import { AppRoutes } from "@/app/routes/AppRoutes";

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  );
}
