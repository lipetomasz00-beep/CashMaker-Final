import React, { useState, useEffect } from 'react';
import { m2mService } from '../services/m2m.service';

export const LoanCalculator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [liveReports, setLiveReports] = useState(156);

  const categories = [
    { id: 'gotowka', label: 'Szybka Gotówka', icon: '⚡' },
    { id: 'premia', label: 'Premia od Banku', icon: '🎁' },
    { id: 'firma', label: 'Dla Firm', icon: '💼' },
    { id: 'konsolidacja', label: 'Konsolidacja', icon: '🛡️' },
    { id: 'karty', label: 'Karty Kredytowe', icon: '💳' },
    { id: 'ubezpieczenia', label: 'Ubezpieczenia', icon: '🛡️' }, // Zmieniłam ikonę na tarczę jak na screenie
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveReports(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (id: string) => {
    setCategory(id);
    // setStep(2); // Odkomentujemy to w następnym kroku
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 flex flex-col items-center font-sans antialiased">
      
      <div className="text-center mt-8 mb-8 w-full max-w-[320px] flex flex-col items-center">
        <div className="w-8 h-8 border border-zinc-700 rounded-full flex items-center justify-center text-[9px] font-black mb-4 text-zinc-500">FF</div>
        <h1 className="text-2xl font-black tracking-widest uppercase mb-1">
          FINANCIAL FREEDOM
        </h1>
        <p className="text-[#DC143C] font-black uppercase text-[8px] tracking-[0.2em] mb-4">
          MY TO TWÓJ FINANSOWY SUKCES
        </p>
        <p className="text-zinc-500 text-[10px] leading-relaxed px-2 font-medium">
          Poznaj oferty dzięki którym zyskasz Ty. Nie jak dotychczas tylko bank.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-[320px] mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="aspect-[4/3] bg-transparent rounded-2xl flex flex-col items-center justify-center
                       border-[1.5px] border-[#DC143C] 
                       hover:bg-[#DC143C]/10 active:scale-95 transition-all group"
          >
            <span className="text-2xl mb-2 text-white">
              {cat.icon}
            </span>
            <span className="text-[10px] font-bold tracking-wide text-white text-center leading-tight px-2">
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      <div className="w-full max-w-[320px] border-[1.5px] border-[#DC143C] rounded-2xl p-6 flex flex-col items-center justify-center relative bg-transparent mb-12 shadow-[0_0_30px_rgba(220,20,60,0.15)]">
        <div className="absolute top-4 right-4 flex items-center space-x-1.5">
          <div className="w-2 h-2 bg-[#DC143C] rounded-full animate-pulse shadow-[0_0_8px_#DC143C]"></div>
          <span className="text-[#DC143C] text-[9px] font-black uppercase tracking-wider">LIVE</span>
        </div>
        <span className="text-5xl font-light text-[#DC143C] mb-1 tracking-tighter">{liveReports}</span>
        <span className="text-[9px] font-bold tracking-widest text-white uppercase">
          OBECNIE GENEROWANE RAPORTY
        </span>
      </div>

      <div className="text-center w-full max-w-[320px]">
        <button className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors flex items-center justify-center mx-auto space-x-1">
          <span>? POKAŻ FAQ</span>
        </button>
      </div>
    </div>
  );
};
