import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  // Styles for a more mechanical/magical feel
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold tracking-wide transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 font-display uppercase text-xs";
  
  const variants = {
    // Sapphire Blue (Howl's feathers)
    primary: "bg-[#2b5876] hover:bg-[#1a3a52] text-[#fdf6e3] shadow-md border border-[#1a3a52] hover:shadow-lg focus:ring-[#2b5876]",
    // Calcifer Red/Orange
    accent: "bg-[#ff6b6b] hover:bg-[#e05252] text-white shadow-md border border-[#e05252] hover:shadow-lg focus:ring-[#ff6b6b]",
    // Parchment/Gold
    secondary: "bg-[#fdf6e3] hover:bg-[#f4ebd0] text-[#2c3e50] border-2 border-[#c5a059] shadow-sm focus:ring-[#c5a059]",
    outline: "border-2 border-[#2b5876] text-[#2b5876] hover:bg-[#eef5fa] focus:ring-[#2b5876]",
    ghost: "text-[#637b89] hover:bg-[#eef5fa] hover:text-[#2b5876] focus:ring-[#c5a059]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};