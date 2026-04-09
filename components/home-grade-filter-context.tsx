"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type HomeGradeFilterContextValue = {
  selectedGrade: string | null;
  setSelectedGrade: (grade: string | null) => void;
  toggleGrade: (grade: string) => void;
};

const HomeGradeFilterContext = createContext<HomeGradeFilterContextValue | null>(
  null
);

export function HomeGradeFilterProvider({ children }: { children: ReactNode }) {
  const [selectedGrade, setSelectedGradeState] = useState<string | null>(null);

  const setSelectedGrade = useCallback((grade: string | null) => {
    setSelectedGradeState(grade);
  }, []);

  const toggleGrade = useCallback((grade: string) => {
    setSelectedGradeState((prev) => (prev === grade ? null : grade));
  }, []);

  const value = useMemo(
    () => ({ selectedGrade, setSelectedGrade, toggleGrade }),
    [selectedGrade, setSelectedGrade, toggleGrade]
  );

  return (
    <HomeGradeFilterContext.Provider value={value}>
      {children}
    </HomeGradeFilterContext.Provider>
  );
}

export function useHomeGradeFilter(): HomeGradeFilterContextValue {
  const ctx = useContext(HomeGradeFilterContext);
  if (!ctx) {
    throw new Error("useHomeGradeFilter must be used within HomeGradeFilterProvider");
  }
  return ctx;
}
