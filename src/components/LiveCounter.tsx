import React, { useState, useEffect } from 'react';

export function LiveCounter() {
  const [count, setCount] = useState(() => Math.floor(Math.random() * (187 - 134 + 1)) + 134);

  useEffect(() => {
    const updateCounter = () => {
      setCount(prev => {
        const change = Math.floor(Math.random() * 5) - 1;
        const next = prev + change;
        return next < 0 ? 0 : next;
      });
      setTimeout(updateCounter, Math.floor(Math.random() * 5000) + 3000);
    };
    updateCounter();
  }, []);

  return (
    <div className="mx-auto mt-2 mb-1 bg-[#0A0A0A] border border-[#DC143C]/40 rounded-md p-2 max-w-[160px] shadow-[0_0_10px_rgba(220,20,60,0.15)] relative overflow-hidden">
      <div className="absolute top-1 right-1.5 flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-[#FF0000] rounded-full animate-pulse"></div>
        <span className="text-[#FF0000] text-[6px] font-bold tracking-widest">LIVE</span>
      </div>
      <div className="text-2xl font-mono font-bold text-[#DC143C] tracking-widest leading-none text-center">{count}</div>
      <div className="text-[7px] text-white/60 uppercase tracking-widest mt-1 font-semibold text-center leading-tight">
        Generowane raporty
      </div>
    </div>
  );
}

