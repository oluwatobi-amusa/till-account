import { Fragment, FC } from 'react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from '@headlessui/react';
import {
  Modal as ModalType,
  ModalTitle as ModalTitleType,
  ModalBody as ModalBodyType,
  ModalFooter as ModelFooterType
} from './types';
import { X } from 'lucide-react';

export const ModalTitle: FC<ModalTitleType> = ({ children }) => {
  return (
    <DialogTitle as="h3" className="text-xl font-bold leading-6 text-gray-900">
      {children}
    </DialogTitle>
  );
};

export const ModalBody: FC<ModalBodyType> = ({ children }) => {
  return (
    <div className="mt-4">
      <Description as="div" className="text-lg">
        {children}
      </Description>
    </div>
  );
};

export const ModalFooter: FC<ModelFooterType> = ({ children }) => {
  return <>{children}</>;
};
export const Modal: FC<ModalType> = ({
  onClose,
  isOpen,
  closeOnOverlayClick = true,
  width = 'md:max-w-md',
  children
}) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[100] overflow-y-auto"
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        <DialogPanel>
          <div className="min-h-screen px-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black opacity-30" />
            </TransitionChild>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`my-8 inline-block w-full ${width} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                <button
                  onClick={onClose}
                  className="absolute right-6 top-6 rounded-full p-1 text-black bg-[#52525A] bg-opacity-40 focus:outline-none cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
                {children}
              </div>
            </TransitionChild>
          </div>
        </DialogPanel>
      </Dialog>
    </Transition>
  );
};
