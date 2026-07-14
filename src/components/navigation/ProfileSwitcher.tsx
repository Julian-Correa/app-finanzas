import { useProfile, type ProfileScope } from "@/app/providers/ProfileProvider";
import { cn } from "@/lib/utils";

const profileTone: Record<ProfileScope, string> = {
  julian: "bg-primary/10 text-primary dark:bg-primary/20",
  pareja: "bg-success/10 text-success dark:bg-success/20",
  ambos: "bg-info/10 text-info dark:bg-info/20",
};

export function ProfileSwitcher() {
  const { currentProfile, profileOptions, setCurrentProfile } = useProfile();

  return (
    <section className="rounded-card border border-slate-200/70 bg-slate-50/90 p-2 dark:border-white/10 dark:bg-white/[0.04]" aria-label="Profile selector">
      <p className="px-2 pb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">
        Profile
      </p>
      <div className="grid grid-cols-3 gap-1">
        {profileOptions.map((profile) => {
          const isActive = profile.id === currentProfile;

          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => setCurrentProfile(profile.id)}
              className={cn(
                "rounded-2xl px-2 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                isActive ? profileTone[profile.id] : "text-slate-500 hover:bg-white dark:text-zinc-400 dark:hover:bg-white/10",
              )}
            >
              {profile.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
