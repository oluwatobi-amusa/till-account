import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  allowMultiple?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, type, allowMultiple, value, defaultValue, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    const isControlled = value !== undefined;
    const multipleAttr = type === 'file' ? { multiple: allowMultiple || false } : {};

    const valueProps =
      type === 'file'
        ? {}
        : isControlled
          ? { value: value ?? '' }
          : defaultValue !== undefined
            ? { defaultValue }
            : {};

    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">{leftIcon}</span>
        )}
        <input
          type={type === 'password' ? (show ? 'text' : 'password') : type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            leftIcon && 'pl-8',
            rightIcon && 'pr-12',
            className
          )}
          ref={ref}
          {...valueProps}
          {...multipleAttr}
          {...props}
        />
        {type === 'password' || rightIcon ? (
          <span className="absolute inset-y-0 right-0 flex items-center">
            {type === 'password' && !rightIcon && (
              <Button
                aria-label="toggle show password"
                onClick={handleClick}
                size="sm"
                type="button"
                className="text-muted-foreground bg-transparent hover:bg-transparent"
              >
                {show ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </Button>
            )}
            {rightIcon}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
