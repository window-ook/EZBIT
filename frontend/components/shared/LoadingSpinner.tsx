interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'ring' | 'dots' | 'pulse';
  className?: string;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
  xl: 'size-10',
  '2xl': 'size-12'
};

export function LoadingSpinner({ size = 'lg', variant = 'ring', className = '' }: LoadingSpinnerProps) {
  const spinnerSize = sizeClasses[size];

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="flex space-x-2">
          <div className={`bg-main rounded-full animate-bounce ${spinnerSize}`} style={{ animationDelay: '0ms' }}></div>
          <div className={`bg-main rounded-full animate-bounce ${spinnerSize}`} style={{ animationDelay: '150ms' }}></div>
          <div className={`bg-main rounded-full animate-bounce ${spinnerSize}`} style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className={`bg-main rounded-full animate-pulse ${spinnerSize}`}></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="relative">
        <div className={`rounded-full border-4 border-gray-200 ${spinnerSize}`}></div>
        <div className={`absolute top-0 left-0 rounded-full border-4 border-transparent border-t-main animate-spin ${spinnerSize}`}></div>
      </div>
    </div>
  );
}