import { createContext, useContext, useState, useMemo } from 'react';

type IdentificationContextType = {
  bvnFullName: string;
  ninFullName: string;
  bvnBirthDate: string;
  ninBirthDate: string;
  accountName: string;
  setBvnFullName: (name: string) => void;
  setNinFullName: (name: string) => void;
  setBvnBirthDate: (name: string) => void;
  setNinBirthDate: (name: string) => void;
  setAccountName: (name: string) => void;
};

const IdentificationContext = createContext<IdentificationContextType | undefined>(undefined);

export const IdentificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [bvnFullName, setBvnFullName] = useState('');
  const [ninFullName, setNinFullName] = useState('');
  const [bvnBirthDate, setBvnBirthDate] = useState('');
  const [ninBirthDate, setNinBirthDate] = useState('');
  const [accountName, setAccountName] = useState('');

  const value = useMemo(
    () => ({
      bvnFullName,
      ninFullName,
      bvnBirthDate,
      ninBirthDate,
      accountName,
      setAccountName,
      setBvnFullName,
      setNinFullName,
      setBvnBirthDate,
      setNinBirthDate
    }),
    [accountName, bvnBirthDate, bvnFullName, ninBirthDate, ninFullName]
  );

  return <IdentificationContext.Provider value={value}>{children}</IdentificationContext.Provider>;
};

export const UseIdentification = () => {
  const context = useContext(IdentificationContext);
  if (!context) {
    throw new Error('useIdentification must be used within an IdentificationProvider');
  }
  return context;
};
