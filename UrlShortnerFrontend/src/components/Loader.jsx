import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = '', size = 24, text = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 
        size={size} 
        className="animate-spin text-indigo-600" 
      />
      {text && <span className="mt-2 text-sm text-slate-500 font-medium animate-pulse">{text}</span>}
    </div>
  );
};

export default Loader;
