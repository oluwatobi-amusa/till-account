import { useState, useCallback } from 'react';

export interface DisclosureState<T = string> {
  isOpen: boolean;
  modalType: T | null;
  onOpen: (type?: T) => void;
  onClose: () => void;
}

export const useDisclosure = <T = string>(): DisclosureState<T> => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<T | null>(null);

  const onOpen = useCallback((type?: T) => {
    setIsOpen(true);
    setModalType(type || null);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
    setModalType(null);
  }, []);

  return {
    isOpen,
    modalType,
    onOpen,
    onClose
  };
};
