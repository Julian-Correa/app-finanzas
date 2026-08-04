import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Globe,
  User,
  Sparkles,
  Bell,
  Download,
  Info,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { PageShell } from "@/components/common/PageShell";
import { MotionCard } from "@/components/common/MotionCard";
import { SkeletonCard } from "@/components/common/Skeleton";
import { PageTransition } from "@/components/common/PageTransition";
import { useProfile } from "@/app/providers/ProfileProvider";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { fetchTransactions, fetchBudgets, fetchDebts, fetchGoals, resetDatabase } from "@/supabase/queries";
import { downloadCsv, printAsPdf, type CsvColumn } from "@/services/exportService";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import type { AppSettings } from "@/services/settingsService";

const themeOptions: Array<{ value: AppSettings["theme"]; icon: typeof Sun }> = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Laptop },
];

const profileOptions: Array<{ value: string }> = [
  { value: "julian" },
  { value: "pareja" },
  { value: "ambos" },
];

export function SettingsPage() {
  const { t, language } = useTranslation();
  const queryClient = useQueryClient();
  const { settings, isLoading, error, updateField, handleSave, isSaving, isDirty, savedMsg } = useSettings();
  const { currentProfile } = useProfile();
  const profileId = currentProfile === "ambos" ? "ambos" : currentProfile === "julian" ? "11111111-1111-4111-8111-111111111111" : "22222222-2222-4222-8222-222222222222";

  if (isLoading) {
    return (
      <PageShell eyebrow={t("settings.eyebrow")} title={t("dashboard.loading")} description={t("settings.loadingDesc")} icon={Settings}>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="p-6" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell eyebrow={t("settings.eyebrow")} title={t("dashboard.error")} description={t("settings.errorDesc")} icon={Settings}>
        <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
          <p>{(error as Error)?.message ?? t("settings.errorUnknown")}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageTransition>
      <PageShell
        eyebrow={t("settings.eyebrow")}
        title={t("settings.title")}
        description={t("settings.description")}
        icon={Settings}
      >
        <div className="space-y-5">
          <MotionCard hover="none">
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sun className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">{t("settings.sectionAppearance")}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">{t("settings.sectionAppearanceDesc")}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("settings.theme")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {themeOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = settings.theme === opt.value;
                      const label = opt.value === "light" ? t("settings.themeLight") : opt.value === "dark" ? t("settings.themeDark") : t("settings.themeSystem");
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField("theme", opt.value)}
                          className={cn(
                            "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition",
                            isActive
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-slate-200/70 bg-white/50 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:border-white/20"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("settings.language")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["es", "en"] as const).map((lang) => {
                      const isActive = settings.language === lang;
                      const label = lang === "es" ? t("settings.languageEs") : t("settings.languageEn");
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => updateField("language", lang)}
                          className={cn(
                            "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition",
                            isActive
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-slate-200/70 bg-white/50 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:border-white/20"
                          )}
                        >
                          <Globe className="h-4 w-4" />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </MotionCard>

          <MotionCard hover="none">
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info/10 text-info">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">{t("settings.sectionProfile")}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">{t("settings.sectionProfileDesc")}</p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("settings.defaultProfile")}</label>
                <p className="mb-3 text-[11px] text-slate-400 dark:text-zinc-500">{t("settings.defaultProfileDesc")}</p>
                <div className="grid grid-cols-3 gap-2">
                  {profileOptions.map((opt) => {
                    const isActive = settings.defaultProfile === opt.value;
                    const label = opt.value === "julian" ? t("settings.profileJulian") : opt.value === "pareja" ? t("settings.profilePareja") : t("settings.profileAmbos");
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateField("defaultProfile", opt.value)}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-xs font-medium transition",
                          isActive
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-slate-200/70 bg-white/50 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:border-white/20"
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </MotionCard>

          <MotionCard hover="none">
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">{t("settings.sectionPreferences")}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">{t("settings.sectionPreferencesDesc")}</p>
                </div>
              </div>

              <div className="space-y-4">
                <ToggleRow
                  icon={Sparkles}
                  label={t("settings.animations")}
                  description={t("settings.animationsDesc")}
                  checked={settings.animations}
                  onChange={(v) => updateField("animations", v)}
                />
                <ToggleRow
                  icon={Bell}
                  label={t("settings.notifications")}
                  description={t("settings.notificationsDesc")}
                  checked={settings.notifications}
                  onChange={(v) => updateField("notifications", v)}
                />
              </div>
            </div>
          </MotionCard>

          <MotionCard hover="none">
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Download className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">{t("settings.sectionData")}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">{t("settings.sectionDataDesc")}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!profileId) return;
                    const [transactions, budgets, debts, goals] = await Promise.all([
                      fetchTransactions(profileId),
                      fetchBudgets(profileId, new Date().getMonth() + 1, new Date().getFullYear()),
                      fetchDebts(profileId),
                      fetchGoals(profileId),
                    ]);
                    const rows: Array<{ type: string; description: string; amount: number }> = [
                      ...transactions.map((t) => ({ type: t.transaction_type, description: t.description, amount: Number(t.amount) })),
                      ...budgets.map((b) => ({ type: "budget" as const, description: `Budget (cat ${b.category_id})`, amount: Number(b.limit_amount) })),
                      ...debts.map((d) => ({ type: "debt" as const, description: d.name, amount: Number(d.remaining_amount) })),
                      ...goals.map((g) => ({ type: "goal" as const, description: g.name, amount: Number(g.target_amount) })),
                    ];
                    const columns: CsvColumn<typeof rows[number]>[] = [
                      { key: "type", header: "Type" },
                      { key: "description", header: "Description" },
                      { key: "amount", header: "Amount ($)" },
                    ];
                    downloadCsv(rows, columns, `finos-full-export-${new Date().toISOString().slice(0, 10)}.csv`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/70 bg-white/50 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t("settings.exportCsv")}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!profileId) return;
                    const [transactions, debts, goals] = await Promise.all([
                      fetchTransactions(profileId),
                      fetchDebts(profileId),
                      fetchGoals(profileId),
                    ]);
                    const txRows = transactions.map((t) => `<tr><td>${t.date}</td><td>${t.description}</td><td class="text-right">$${Number(t.amount).toLocaleString("es-AR")}</td></tr>`).join("");
                    const debtRows = debts.map((d) => `<tr><td>${d.name}</td><td class="text-right">$${Number(d.remaining_amount).toLocaleString("es-AR")}</td><td>${d.status}</td></tr>`).join("");
                    const goalRows = goals.map((g) => `<tr><td>${g.name}</td><td class="text-right">$${Number(g.current_amount).toLocaleString("es-AR")} / $${Number(g.target_amount).toLocaleString("es-AR")}</td></tr>`).join("");
                    printAsPdf("FinOS Full Report", `
                      <h1>FinOS — Full Report</h1>
                      <p class="subtitle">Generated on ${new Date().toLocaleDateString()}</p>
                      <h2>Transactions (${transactions.length})</h2>
                      <table><thead><tr><th>Date</th><th>Description</th><th class="text-right">Amount</th></tr></thead><tbody>${txRows}</tbody></table>
                      <h2>Debts (${debts.length})</h2>
                      <table><thead><tr><th>Name</th><th class="text-right">Remaining</th><th>Status</th></tr></thead><tbody>${debtRows}</tbody></table>
                      <h2>Goals (${goals.length})</h2>
                      <table><thead><tr><th>Name</th><th class="text-right">Progress</th></tr></thead><tbody>${goalRows}</tbody></table>
                    `);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/70 bg-white/50 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t("settings.exportPdf")}
                </button>
              </div>
            </div>
          </MotionCard>

          <MotionCard hover="none">
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-zinc-400">
                  <Info className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">{t("settings.sectionAbout")}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">{t("settings.sectionAboutDesc")}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.03]">
                  <span className="text-slate-500 dark:text-zinc-400">{t("settings.version")}</span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">0.1.0</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.03]">
                  <span className="text-slate-500 dark:text-zinc-400">{t("settings.framework")}</span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">React 19 + Vite + TypeScript</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.03]">
                  <span className="text-slate-500 dark:text-zinc-400">Idioma / Language</span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">{language === "es" ? "Español (Argentina)" : "English"}</span>
                </div>
              </div>
            </div>
          </MotionCard>

          <MotionCard hover="none">
            <div className="rounded-card border border-red-200/50 bg-red-50/50 p-5 backdrop-blur-xl dark:border-red-500/10 dark:bg-red-950/30">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">{t("settings.resetDatabase")}</p>
                  <p className="text-xs text-red-500/80 dark:text-red-400/80">{t("settings.resetDatabaseDesc")}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm(t("settings.resetDatabaseConfirm"))) {
                      try {
                        await resetDatabase();
                        alert(t("settings.resetDatabaseSuccess"));
                        queryClient.clear();
                        window.location.reload();
                      } catch (err) {
                        console.error(err);
                        alert("Error: " + ((err as any)?.message || String(err)));
                      }
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("settings.resetDatabase")}
                </button>
              </div>
            </div>
          </MotionCard>

          <div className="flex items-center justify-end gap-3">
            {savedMsg && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t("settings.saved")}
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition",
                isDirty && !isSaving
                  ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                  : "bg-slate-100 text-slate-400 dark:bg-white/10 dark:text-zinc-500"
              )}
            >
              {isSaving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : null}
              {isSaving ? t("settings.saving") : t("settings.save")}
            </button>
          </div>
        </div>
      </PageShell>
    </PageTransition>
  );
}

interface ToggleRowProps {
  icon: typeof Sparkles;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ToggleRow({ icon: Icon, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/[0.03]">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
        <div>
          <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">{label}</p>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          checked ? "bg-primary" : "bg-slate-200 dark:bg-white/20"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
