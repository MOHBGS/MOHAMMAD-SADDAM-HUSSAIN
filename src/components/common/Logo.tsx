import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  whiteText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  whiteText = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon: Curved heart with college arch cutout */}
      <div
        className={`relative ${iconSizes[size]} rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 p-1.5 shadow-md shadow-pink-500/20 flex items-center justify-center text-white flex-shrink-0 transition-transform hover:scale-105`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Heart shape with campus arch aperture */}
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          {/* Subtle collegiate dome/mortar cap arch cut out */}
          <path
            d="M12 7.5L8.5 9.5L12 11.5L15.5 9.5L12 7.5Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M9.5 11.2V13.8C9.5 14.8 10.6 15.6 12 15.6C13.4 15.6 14.5 14.8 14.5 13.8V11.2L12 12.6L9.5 11.2Z"
            fill="white"
            fillOpacity="0.85"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-extrabold tracking-tight leading-none ${textSizes[size]} ${
              whiteText ? 'text-white' : 'text-slate-900'
            }`}
          >
            College<span className="text-pink-600 font-black">Crush</span>
          </span>
          {size === 'xl' && (
            <span
              className={`text-xs font-medium tracking-wide mt-1 ${
                whiteText ? 'text-pink-200' : 'text-slate-500'
              }`}
            >
              Good Vibes · Same Campus · Better People ❤️
            </span>
          )}
        </div>
      )}
    </div>
  );
};
