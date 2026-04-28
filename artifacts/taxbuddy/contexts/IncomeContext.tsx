import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Income } from "../types";
import { defaultIncomes } from "../data/seed";
import { useProfile } from "./ProfileContext";

interface IncomeContextType {
  incomes: Income[];
  addIncome: (income: Omit<Income, "id">) => Promise<void>;
  updateIncome: (id: string, updates: Partial<Income>) => Promise<void>;
  removeIncome: (id: string) => Promise<void>;
  ytdRevenue: number;
  isLoading: boolean;
}

const IncomeContext = createContext<IncomeContextType | null>(null);

export const IncomeProvider = ({ children }: { children: ReactNode }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useProfile();

  useEffect(() => {
    const loadIncomes = async () => {
      try {
        const stored = await AsyncStorage.getItem("taxbuddy.incomes");
        if (stored) {
          setIncomes(JSON.parse(stored));
        } else if (profile?.onboardingComplete) {
          await AsyncStorage.setItem("taxbuddy.incomes", JSON.stringify(defaultIncomes));
          setIncomes(defaultIncomes);
        }
      } catch (error) {
        console.error("Failed to load incomes", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadIncomes();
  }, [profile?.onboardingComplete]);

  const saveIncomes = async (newIncomes: Income[]) => {
    setIncomes(newIncomes);
    await AsyncStorage.setItem("taxbuddy.incomes", JSON.stringify(newIncomes));
  };

  const addIncome = async (income: Omit<Income, "id">) => {
    const newIncome: Income = {
      ...income,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    await saveIncomes([newIncome, ...incomes]);
  };

  const updateIncome = async (id: string, updates: Partial<Income>) => {
    const newIncomes = incomes.map((i) => (i.id === id ? { ...i, ...updates } : i));
    await saveIncomes(newIncomes);
  };

  const removeIncome = async (id: string) => {
    const newIncomes = incomes.filter((i) => i.id !== id);
    await saveIncomes(newIncomes);
  };

  const currentYear = new Date().getFullYear();
  const ytdRevenue = incomes
    .filter((i) => new Date(i.date).getFullYear() === currentYear && i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <IncomeContext.Provider value={{ incomes, addIncome, updateIncome, removeIncome, ytdRevenue, isLoading }}>
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncomes = () => {
  const context = useContext(IncomeContext);
  if (!context) throw new Error("useIncomes must be used within an IncomeProvider");
  return context;
};
