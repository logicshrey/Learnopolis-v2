interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export default function LoadingSpinner({ size = 'medium', message = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizeClasses[size]} border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin`}></div>
      {message && <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>}
    </div>
  );
} 