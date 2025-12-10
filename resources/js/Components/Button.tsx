import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50',
  secondary:
    'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 disabled:opacity-50',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50',
  ghost:
    'bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-700 dark:text-white',
};

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles[variant]} ${className}`.trim()}
    />
  );
}
