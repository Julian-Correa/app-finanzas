import { fetchSettings, upsertSetting } from "@/supabase/queries";

export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: "es" | "en";
  currency: "ARS";
  defaultProfile: string | null;
  animations: boolean;
  notifications: boolean;
}

const SETTINGS_KEY = "finos.settings";

const defaults: AppSettings = {
  theme: "system",
  language: "es",
  currency: "ARS",
  defaultProfile: null,
  animations: true,
  notifications: true,
};

export function getLocalSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppSettings>;
      return { ...defaults, ...parsed };
    }
  } catch {
  }
  return { ...defaults };
}

export function saveLocalSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getDefaultProfileId(profile: string | null): string | null {
  if (profile === "julian") return "11111111-1111-4111-8111-111111111111";
  if (profile === "pareja") return "22222222-2222-4222-8222-222222222222";
  return null;
}

export function getProfileFromId(id: string | null): string | null {
  if (id === "11111111-1111-4111-8111-111111111111") return "julian";
  if (id === "22222222-2222-4222-8222-222222222222") return "pareja";
  return null;
}

export async function loadSettingsFromDb(): Promise<AppSettings> {
  const local = getLocalSettings();

  try {
    const row = await fetchSettings();
    if (row) {
      const dbSettings: AppSettings = {
        theme: (row.theme as AppSettings["theme"]) ?? local.theme,
        language: (row.language && row.language.startsWith("es") ? "es" : "en") as AppSettings["language"],
        currency: (row.currency as AppSettings["currency"]) ?? local.currency,
        defaultProfile: getProfileFromId(row.default_profile) ?? "ambos",
        animations: row.animations ?? local.animations,
        notifications: row.notifications ?? local.notifications,
      };
      saveLocalSettings(dbSettings);
      return dbSettings;
    }
  } catch (err) {
    console.error("Error loading settings from DB:", err);
  }

  return local;
}

export async function persistSettings(settings: AppSettings): Promise<void> {
  saveLocalSettings(settings);

  try {
    await upsertSetting({
      theme: settings.theme,
      language: settings.language,
      currency: settings.currency,
      default_profile: getDefaultProfileId(settings.defaultProfile),
      animations: settings.animations,
      notifications: settings.notifications,
    });
  } catch (err) {
    console.error("Error persisting settings to DB:", err);
    throw err;
  }
}
