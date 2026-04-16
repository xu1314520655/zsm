
interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'orange';
}

const ProgressBar = ({ progress, size = 'md', color = 'blue' }: ProgressBarProps) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600'
  };

  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-600 font-medium">
          进度: {safeProgress.toFixed(0)}%
        </span>
      </div>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden shadow-inner ${sizeClasses[size]}`}>
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${safeProgress}%` }}
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

