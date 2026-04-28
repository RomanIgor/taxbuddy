import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trip } from "../types";
import { defaultTrips } from "../data/seed";
import { useProfile } from "./ProfileContext";

interface TripsContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, "id">) => Promise<void>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
  removeTrip: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TripsContext = createContext<TripsContextType | null>(null);

export const TripsProvider = ({ children }: { children: ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useProfile();

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const stored = await AsyncStorage.getItem("taxbuddy.trips");
        if (stored) {
          setTrips(JSON.parse(stored));
        } else if (profile?.onboardingComplete) {
          await AsyncStorage.setItem("taxbuddy.trips", JSON.stringify(defaultTrips));
          setTrips(defaultTrips);
        }
      } catch (error) {
        console.error("Failed to load trips", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrips();
  }, [profile?.onboardingComplete]);

  const saveTrips = async (newTrips: Trip[]) => {
    setTrips(newTrips);
    await AsyncStorage.setItem("taxbuddy.trips", JSON.stringify(newTrips));
  };

  const addTrip = async (trip: Omit<Trip, "id">) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    await saveTrips([newTrip, ...trips]);
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    const newTrips = trips.map((t) => (t.id === id ? { ...t, ...updates } : t));
    await saveTrips(newTrips);
  };

  const removeTrip = async (id: string) => {
    const newTrips = trips.filter((t) => t.id !== id);
    await saveTrips(newTrips);
  };

  return (
    <TripsContext.Provider value={{ trips, addTrip, updateTrip, removeTrip, isLoading }}>
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripsContext);
  if (!context) throw new Error("useTrips must be used within a TripsProvider");
  return context;
};
