"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type HomeSearchFilterContextValue = {
  query: string;
  setQuery: (v: string) => void;
  subject: string;
  setSubject: (v: string) => void;
  grade: string;
  setGrade: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  clearAllFilters: () => void;
};

const HomeSearchFilterContext =
  createContext<HomeSearchFilterContextValue | null>(null);

export function HomeSearchFilterProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [district, setDistrict] = useState("");

  const clearAllFilters = useCallback(() => {
    setQuery("");
    setSubject("");
    setGrade("");
    setDistrict("");
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      subject,
      setSubject,
      grade,
      setGrade,
      district,
      setDistrict,
      clearAllFilters,
    }),
    [query, subject, grade, district, clearAllFilters]
  );

  return (
    <HomeSearchFilterContext.Provider value={value}>
      {children}
    </HomeSearchFilterContext.Provider>
  );
}

export function useHomeSearchFilter(): HomeSearchFilterContextValue {
  const ctx = useContext(HomeSearchFilterContext);
  if (!ctx) {
    throw new Error(
      "useHomeSearchFilter must be used within HomeSearchFilterProvider"
    );
  }
  return ctx;
}
