import React from 'react';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function GlowButton({ children, variant = 'primary', className = '', ...props }: GlowButtonProps) {
  const baseStyle = "px-6 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1";
  
  // Efek glow hanya di tombol primary
  const primaryStyle = "bg-white/50 text-orange-700 hover:bg-white/70 hover:shadow-glow border border-white/60";
  const secondaryStyle = "bg-transparent text-slate-700 hover:bg-white/30 border border-white/50";

  return (
    <button
      className={`${baseStyle} ${variant === 'primary' ? primaryStyle : secondaryStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}