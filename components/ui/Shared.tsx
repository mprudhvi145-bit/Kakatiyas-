
import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' | 'white' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "uppercase tracking-[0.2em] text-[11px] font-bold py-4 px-10 transition-all duration-500 ease-out border";
  
  const variants = {
    primary: "bg-stone-900 text-white border-stone-900 hover:bg-kakatiya-gold hover:border-kakatiya-gold hover:text-white",
    outline: "bg-transparent text-stone-900 border-stone-900 hover:bg-stone-900 hover:text-white",
    ghost: "bg-transparent text-stone-600 border-transparent hover:text-kakatiya-gold",
    white: "bg-white text-stone-900 border-white hover:bg-stone-200 hover:border-stone-200"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const SectionTitle: React.FC<{ title: string; subtitle?: string; light?: boolean; align?: 'center' | 'left' }> = ({ 
  title, 
  subtitle, 
  light,
  align = 'center' 
}) => (
  <div className={`mb-20 space-y-4 ${align === 'center' ? 'text-center' : 'text-left'}`}>
    {subtitle && (
      <p className={`font-royal uppercase tracking-[0.3em] text-xs font-medium ${light ? 'text-kakatiya-gold' : 'text-stone-500'}`}>
        {subtitle}
      </p>
    )}
    <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight ${light ? 'text-white' : 'text-stone-900'}`}>
      {title}
    </h2>
    <div className={`h-[1px] w-24 bg-kakatiya-gold mt-6 ${align === 'center' ? 'mx-auto' : ''}`}></div>
  </div>
);

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div className="animate-fade-in opacity-0 fill-mode-forwards" style={{ animationDelay: `${delay}ms` }}>
    {children}
  </div>
);
