import React, { createContext, useContext, useState, useMemo } from 'react';

interface ReloadContextProps {
  triggerReload: () => void;
  shouldReload: boolean;
}

const ReloadContext = createContext<ReloadContextProps | undefined>(undefined);

export const ReloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shouldReload, setShouldReload] = useState(false);

  const triggerReload = () => {
    setShouldReload(true);
    setTimeout(() => setShouldReload(false), 0);
  };

  const contextValue = useMemo(() => ({ triggerReload, shouldReload }), [shouldReload]);

  return <ReloadContext.Provider value={contextValue}>{children}</ReloadContext.Provider>;
};

export const useReloadContext = () => {
  const context = useContext(ReloadContext);
  if (!context) {
    throw new Error('useReloadContext must be used within a ReloadProvider');
  }
  return context;
};
