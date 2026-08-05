import { useEffect, useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTheme } from "@/app/providers/ThemeProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useProfile, type ProfileScope } from "@/app/providers/ProfileProvider";
import {
  loadSettingsFromDb,
  persistSettings,
  getLocalSettings,
  type AppSettings,
} from "@/services/settingsService";

export function useSettings() {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { currentProfile, setCurrentProfile } = useProfile();

  const [local, setLocal] = useState<AppSettings>(getLocalSettings);
  const [dirty, setDirty] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const query = useQuery({
    queryKey: ["settings"],
    queryFn: loadSettingsFromDb,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.data) {
      setLocal(query.data);
    }
  }, [query.data]);

  const persistMutation = useMutation({
    mutationFn: (settings: AppSettings) => persistSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setDirty(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    },
    onError: (err) => {
      alert("Error al guardar ajustes: " + err.message);
    }
  });

  const updateField = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    setTheme(local.theme);
    setLanguage(local.language);
    setCurrentProfile((local.defaultProfile ?? "ambos") as ProfileScope);
    persistMutation.mutate(local);
  }, [local, setTheme, setLanguage, setCurrentProfile, persistMutation]);

  return {
    settings: local,
    isLoading: query.isLoading,
    error: query.error,
    updateField,
    handleSave,
    isSaving: persistMutation.isPending,
    isDirty: dirty,
    savedMsg,
  };
}
