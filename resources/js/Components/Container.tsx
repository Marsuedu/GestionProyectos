import React, { PropsWithChildren } from 'react';

export default function Container({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-6 ${className}`.trim()}>{children}</div>
  );
}
