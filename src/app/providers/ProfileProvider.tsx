import { createContext, type ReactNode, useContext, useState } from "react";

export type ProfileScope = "julian" | "pareja" | "ambos";

interface ProfileOption {
  id: ProfileScope;
  label: string;
}

interface ProfileContextValue {
  currentProfile: ProfileScope;
  profileOptions: ProfileOption[];
  setCurrentProfile: (profile: ProfileScope) => void;
}

const profileStorageKey = "finos.profile";
const profileOptions: ProfileOption[] = [
  { id: "julian", label: "Julian" },
  { id: "pareja", label: "Sol" },
  { id: "ambos", label: "Ambos" },
];

const ProfileContext = createContext<ProfileContextValue | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
}

function getInitialProfile(): ProfileScope {
  const storedProfile = window.localStorage.getItem(profileStorageKey);

  if (storedProfile === "julian" || storedProfile === "pareja" || storedProfile === "ambos") {
    return storedProfile;
  }

  return "ambos";
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [currentProfile, setProfile] = useState<ProfileScope>(getInitialProfile);

  const setCurrentProfile = (profile: ProfileScope) => {
    window.localStorage.setItem(profileStorageKey, profile);
    setProfile(profile);
  };

  const value: ProfileContextValue = {
    currentProfile,
    profileOptions,
    setCurrentProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider.");
  }

  return context;
}
