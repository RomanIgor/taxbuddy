import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExportEntry } from "../types";

interface ExportsContextType {
  exports: ExportEntry[];
  addExport: (exportEntry: Omit<ExportEntry, "id" | "createdAt">) => Promise<void>;
  isLoading: boolean;
}

const ExportsContext = createContext<ExportsContextType | null>(null);

export const ExportsProvider = ({ children }: { children: ReactNode }) => {
  const [exportsList, setExportsList] = useState<ExportEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExports = async () => {
      try {
        const stored = await AsyncStorage.getItem("taxbuddy.exports");
        if (stored) {
          setExportsList(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load exports", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExports();
  }, []);

  const saveExports = async (newExports: ExportEntry[]) => {
    setExportsList(newExports);
    await AsyncStorage.setItem("taxbuddy.exports", JSON.stringify(newExports));
  };

  const addExport = async (exportEntry: Omit<ExportEntry, "id" | "createdAt">) => {
    const newExport: ExportEntry = {
      ...exportEntry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    await saveExports([newExport, ...exportsList]);
  };

  return (
    <ExportsContext.Provider value={{ exports: exportsList, addExport, isLoading }}>
      {children}
    </ExportsContext.Provider>
  );
};

export const useExports = () => {
  const context = useContext(ExportsContext);
  if (!context) throw new Error("useExports must be used within an ExportsProvider");
  return context;
};
