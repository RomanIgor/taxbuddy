import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Expense } from "../types";
import { defaultExpenses } from "../data/seed";
import { useProfile } from "./ProfileContext";

interface ExpensesContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  isLoading: boolean;
}

const ExpensesContext = createContext<ExpensesContextType | null>(null);

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useProfile();

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const stored = await AsyncStorage.getItem("taxbuddy.expenses");
        if (stored) {
          setExpenses(JSON.parse(stored));
        } else if (profile?.onboardingComplete) {
          await AsyncStorage.setItem("taxbuddy.expenses", JSON.stringify(defaultExpenses));
          setExpenses(defaultExpenses);
        }
      } catch (error) {
        console.error("Failed to load expenses", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExpenses();
  }, [profile?.onboardingComplete]);

  const saveExpenses = async (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    await AsyncStorage.setItem("taxbuddy.expenses", JSON.stringify(newExpenses));
  };

  const addExpense = async (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    await saveExpenses([newExpense, ...expenses]);
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    const newExpenses = expenses.map((e) => (e.id === id ? { ...e, ...updates } : e));
    await saveExpenses(newExpenses);
  };

  const removeExpense = async (id: string) => {
    const newExpenses = expenses.filter((e) => e.id !== id);
    await saveExpenses(newExpenses);
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense, updateExpense, removeExpense, isLoading }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) throw new Error("useExpenses must be used within an ExpensesProvider");
  return context;
};
