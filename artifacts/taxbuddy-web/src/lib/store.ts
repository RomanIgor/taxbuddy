import { useState, useEffect, useCallback } from 'react';

export type Income = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  description: string;
  category: string;
};

export type Expense = {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  deductiblePercent: number;
};

export type Trip = {
  id: string;
  date: string;
  from: string;
  to: string;
  km: number;
  purpose: string;
};

export type Profile = {
  name: string;
  businessType: string;
  yearlyRevenueLimit: number;
  taxYear: number;
};

const SEED_INCOME: Income[] = [
  { id: '1', date: '2025-01-15', amount: 1200, description: 'Webdesign Projekt', category: 'Dienstleistung' },
  { id: '2', date: '2025-02-05', amount: 850, description: 'Logo Erstellung', category: 'Design' },
  { id: '3', date: '2025-03-10', amount: 2100, description: 'E-Commerce Setup', category: 'Entwicklung' },
];

const SEED_EXPENSES: Expense[] = [
  { id: '1', date: '2025-01-20', amount: 45, description: 'Software Abo', category: 'Software', deductiblePercent: 100 },
  { id: '2', date: '2025-02-15', amount: 890, description: 'Neuer Laptop', category: 'Hardware', deductiblePercent: 100 },
  { id: '3', date: '2025-03-01', amount: 120, description: 'Geschäftsessen', category: 'Bewirtung', deductiblePercent: 70 },
];

const SEED_TRIPS: Trip[] = [
  { id: '1', date: '2025-01-25', from: 'Büro', to: 'Kunde A (München)', km: 45, purpose: 'Kickoff Meeting' },
  { id: '2', date: '2025-02-10', from: 'Büro', to: 'Konferenz (Berlin)', km: 120, purpose: 'Networking' },
  { id: '3', date: '2025-03-05', from: 'Büro', to: 'Kunde B (Stuttgart)', km: 65, purpose: 'Präsentation' },
];

const DEFAULT_PROFILE: Profile = {
  name: 'Max Mustermann',
  businessType: 'Freiberufler',
  yearlyRevenueLimit: 22000,
  taxYear: new Date().getFullYear(),
};

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

export function useDataStore() {
  const [isInitialized, setIsInitialized] = useLocalStorage('taxbuddy_initialized', false);
  const [incomes, setIncomes] = useLocalStorage<Income[]>('taxbuddy_incomes', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('taxbuddy_expenses', []);
  const [trips, setTrips] = useLocalStorage<Trip[]>('taxbuddy_trips', []);
  const [profile, setProfile] = useLocalStorage<Profile>('taxbuddy_profile', DEFAULT_PROFILE);

  useEffect(() => {
    if (!isInitialized) {
      setIncomes(SEED_INCOME);
      setExpenses(SEED_EXPENSES);
      setTrips(SEED_TRIPS);
      setIsInitialized(true);
    }
  }, [isInitialized, setIncomes, setExpenses, setTrips, setIsInitialized]);

  return {
    incomes, setIncomes,
    expenses, setExpenses,
    trips, setTrips,
    profile, setProfile
  };
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(new Date(dateString));
};

export const KILOMETERPAUSCHALE = 0.30;
