import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Profile } from "../types";
import { defaultProfile } from "../data/seed";

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  resetProfile: () => Promise<void>;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem("taxbuddy.profile");
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const current = profile || { ...defaultProfile, onboardingComplete: false };
      const updated = { ...current, ...updates };
      await AsyncStorage.setItem("taxbuddy.profile", JSON.stringify(updated));
      setProfile(updated);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const resetProfile = async () => {
    try {
      await AsyncStorage.removeItem("taxbuddy.profile");
      setProfile(null);
    } catch (error) {
      console.error("Failed to reset profile", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, resetProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};
