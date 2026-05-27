import { cn } from '../../lib/utils';

export default function Spinner({ fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div
      className={cn(
        'rounded-full border-2 border-accent/20 border-t-accent animate-spin',
        sizes[size]
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
