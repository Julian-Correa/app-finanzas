import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { ProfileProvider } from "@/app/providers/ProfileProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
