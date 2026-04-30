import React, { createContext, useContext, useState, useEffect } from 'react';

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement_percentage: number;
}

interface CompareContextType {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<College[]>(() => {
    const saved = localStorage.getItem('compareList');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (college: College) => {
    if (compareList.find(c => c.id === college.id)) {
      setCompareList(prev => prev.filter(c => c.id !== college.id));
      return;
    }
    if (compareList.length >= 3) {
      alert('You can only compare up to 3 colleges at a time.');
      return;
    }
    setCompareList(prev => [...prev, college]);
  };

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(c => c.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within a CompareProvider');
  return context;
};
