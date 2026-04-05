import React, { useState } from 'react';
import { Zap, Gift, Briefcase, ShieldPlus, CreditCard, Shield, X, HelpCircle } from 'lucide-react';
import { LiveCounter } from './LiveCounter';
import { Timer } from './Timer';
import { m2mService } from '../services/m2m.service';

export function LoanCalculator() {
  const [step, setStep] = useState(0);
  const [funnelType, setFunnelType] = useState<string | null>(null);
  const [funnelPath, setFunnelPath] = useState<string | null>(null);
  
  const [cardLimit, setCardLimit] = useState(5000);
  const [debtAmount, setDebtAmount] = useState(50000);
  const [inputValue, setInputValue] = useState(10000);
  const [monthsValue, setMonthsValue] = useState(48);
  
  const [loadingText, setLoadingText] = useState('Analiza danych...');
  const [bestOffer, setBestOffer] = useState<any | null>(null);
  const [allOffers, setAllOffers] = useState<any[]>([]);
  const [showAllOffers, setShowAllOffers] = useState(false);

  const initFunnel = (type: string) => {
    setFunnelType(type);
    setStep(1);
    if (type === 'GOTÓWKA' || type === 'KONSOLIDACJA') setFunnelPath('A');
    else if (type === 'PREMIA' || type === 'KARTA') setFunnelPath('B');
    else if (type === 'FIRMA' || type === 'UBEZPIECZENIE') setFunnelPath('C');
  };

  const reset = () => {
    setStep(0);
    setFunnelType(null);
    setFunnelPath(null);
    setBestOffer(null);
    setAllOffers([]);
  };

  const startAnalysis = async () => {
    setStep(2);
    setLoadingText('Łączenie z bazą ofert...');
    
    let amount = inputValue;
    if (funnelType === 'KONSOLIDACJA') amount = debtAmount;
    if (funnelType === 'KARTA') amount = cardLimit;

    setTimeout(async () => {
      setLoadingText('Analiza scoringu i komunikacja z Money2Money...');
      
      try {
        const offersData = await m2mService.getLoanOffers(amount, monthsValue, 9.9);

        if (offersData && Array.isArray(offersData) && offersData.length > 0) {
          setBestOffer(offersData[0]);
          setAllOffers(offersData);
          setStep(3);
        } else if (offersData && typeof offersData === 'object' && !Array.isArray(offersData)) {
          if (offersData.status === 'downsell') {
            setStep(4);
          } else {
            setBestOffer(offersData);
            setAllOffers([offersData]);
            setStep(3);
          }
        } else {
          setBestOffer(null);
          setAllOffers([]);
          setStep(3);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania ofert:', error);
        setBestOffer(null);
        setAllOffers([]);
        setStep(3);
      }
    }, 1500);
  };

  const getEpi = () => 'react_app';

  const renderResultsStep = () => {
    if (!bestOffer && allOffers.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-500">
          <HelpCircle className="w-12 h-12 text-white/20 mb-2" />
          <h3 className="text-lg font-bold text-white uppercase">Brak dostępnych ofert</h3>
          <p className="text-white/60 text-sm">W tej chwili webhook Make.com nie zwrócił danych. Sprawdź integrację M2M.</p>
          <button onClick={reset} className="w-full py-4 bg-[#DC143C] text-white font-bold rounded-xl uppercase tracking-widest mt-4">
            Spróbuj ponownie
          </button>
        </div>
      );
    }

    return (
      <div className="flex-1 w-full max-w-md mx-auto space-y-4 animate-in zoom-in duration-500 p-4 pb-20 overflow-y-auto">
        <div className="bg-white/5 border border-[#DC143C]/30 rounded-2xl p-4 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <Shield className="w-5 h-5 text-[#DC143C] opacity-50" />
          </div>
          <h3 className="text-[#DC143C] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
            Status Analizy: Certyfikowany
          </h3>
          <p className="text-white text-lg font-bold leading-tight">
            System ProtocooL X dopasował elitarną ofertę dla Twojego profilu.
          </p>
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-[10px] text-white/60 font-medium uppercase tracking-widest">
              <span>Prawdopodobieństwo akceptacji</span>
              <span className="text-[#DC143C] animate-pulse">98.4%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#DC143C] shadow-[0_0_10px_#DC143C] w-[98.4%] transition-all duration-1000"></div>
            </div>
          </div>
        </div>

        <Timer start={step === 3 || step === 5} />

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#DC143C] to-[#8B0000] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] bg-white/10 text-white/60 px-2 py-1 rounded-md uppercase tracking-widest mb-2 inline-block">
                  {bestOffer?.category || 'Rekomendacja Ekspercka'}
                </span>
                <h4 className="text-xl font-black text-white uppercase italic">{bestOffer?.name || 'Oferta Premium'}</h4>
              </div>
              <Zap className="w-6 h-6 text-[#DC143C] fill-[#DC143C] icon-glow" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Prowizja / RRSO</p>
                <p className="text-lg font-bold text-white">Sprawdź</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Decyzja w</p>
                <p className="text-lg font-bold text-white">15 min</p>
              </div>
            </div>

            <a
              href={bestOffer?.url || bestOffer?.link || `https://toomasz-money.oferty-kredytowe.pl?epi=${getEpi()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-[#DC143C] hover:bg-[#FF0000] text-white text-center font-black text-lg rounded-xl shadow-[0_10px_20px_rgba(220,20,60,0.4)] transform hover:-translate-y-1 transition-all uppercase tracking-[0.1em]"
            >
              Odbierz Pieniądze Teraz
            </a>
          </div>
        </div>

        <button onClick={reset} className="w-full text-white/20 text-[9px] uppercase font-bold mt-4 tracking-widest hover:text-white transition-colors">
          ← Resetuj i przeprowadź nową analizę
        </button>
      </div>
    );
  };

  const tileClass = "flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] border border-[#DC143C]/40 shadow-inner shadow-[#DC143C]/5 aspect-square hover:scale-105 hover:border-[#DC143C] hover:shadow-[0_0_20px_rgba(220,20,60,0.25)] transition-all";

  return (
    <div className="w-full h-full flex flex-col items-center justify-between font-sans relative overflow-hidden px-2 pb-2 min-h-screen bg-[#0A0A0A]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#DC143C]/10 blur-[80px] pointer-events-none"></div>

      <div className="text-center pt-6 pb-2 w-full flex-shrink-0">
        {step === 0 ? (
          <>
            <h1 className="flex flex-col gap-0.5 mb-2 tracking-tight">
              <span className="text-xl sm:text-2xl font-light text-white/90 uppercase tracking-[0.15em] leading-none">FINANCIAL FREEDOM</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#DC143C] tracking-widest uppercase leading-none mt-1">My to Twój Finansowy Sukces</span>
            </h1>
            <LiveCounter />
            <p className="text-white/40 text-[9px] max-w-[240px] mx-auto leading-tight mt-3 font-light uppercase">
              Poznaj oferty dzięki którym zyskasz Ty. Nie bank.
            </p>
          </>
        ) : (
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight mt-2 uppercase">
            {step === 2 ? 'Analiza Twojego Profilu' : 'Skalibruj system pod swój profil'}
          </h2>
        )}
      </div>

      {step === 0 && (
        <div className="flex-1 w-full flex flex-col justify-start mt-4 min-h-0">
          <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-500 w-full max-w-[320px] mx-auto">
            <button onClick={() => initFunnel('GOTÓWKA')} className={tileClass}>
              <Zap className="w-6 h-6 text-white mb-2" />
              <span className="font-semibold text-[10px] text-white text-center leading-tight uppercase">Szybka Gotówka</span>
            </button>
            <button onClick={() => initFunnel('PREMIA')} className={tileClass}>
              <Gift className="w-6 h-6 text-white mb-2" />
              <span className="font-semibold text-[10px] text-white text-center leading-tight uppercase">Premia od Banku</span>
            </button>
            <button onClick={() => initFunnel('FIRMA')} className={tileClass}>
              <Briefcase className="w-6 h-6 text-white mb-2" />
              <span className="font-semibold text-[10px] text-white text-center leading-tight uppercase">Dla Firm</span>
            </button>
            <button onClick={() => initFunnel('KONSOLIDACJA')} className={tileClass}>
              <ShieldPlus className="w-6 h-6 text-white mb-2" />
              <span className="font-semibold text-[10px] text-white text-center leading-tight uppercase">Konsolidacja</span>
            </button>
            <button onClick={() => initFunnel('KARTA')} className={tileClass}>
              <CreditCard className="w-6 h-6 text-white mb-2" />
              <span className="font-semibold text-[10px] text-white text-center leading-tight uppercase">Karty Kredytowe</span>
            </button>
            <button onClick={() => initFunnel('UBEZPIECZENIE')} className={tileClass}>
              <Shield className="w-6 h-6 text-white mb-2" />
              <span className="font-semibold text-[10px] text-white text-center leading-tight uppercase">Ubezpieczenia</span>
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 w-full max-w-md mx-auto space-y-4 animate-in slide-in-from-right duration-500 overflow-y-auto p-4">
          <div className="bg-gradient-to-b from-[#151515] to-[#0A0A0A] border border-[#DC143C]/30 rounded-3xl p-6 backdrop-blur-lg">
            <Timer />
            <h2 className="text-xl font-black mt-6 mb-8 text-center text-white uppercase tracking-widest italic">Tryb: {funnelType}</h2>

            <div className="space-y-6">
              {funnelType === 'KONSOLIDACJA' ? (
                <div className="space-y-4">
                  <label className="flex justify-between text-[10px] uppercase font-bold text-white/50 tracking-widest">
                    Zadłużenie: <span className="text-[#DC143C] text-sm">{debtAmount.toLocaleString()} PLN</span>
                  </label>
                  <input type="range" min="10000" max="250000" step="5000" value={debtAmount} onChange={(e) => setDebtAmount(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-[#DC143C]" />
                </div>
              ) : funnelType === 'KARTA' ? (
                <div className="space-y-4">
                  <label className="flex justify-between text-[10px] uppercase font-bold text-white/50 tracking-widest">
                    Limit: <span className="text-[#DC143C] text-sm">{cardLimit.toLocaleString()} PLN</span>
                  </label>
                  <input type="range" min="1000" max="50000" step="1000" value={cardLimit} onChange={(e) => setCardLimit(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-[#DC143C]" />
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="flex justify-between text-[10px] uppercase font-bold text-white/50 tracking-widest">
                    Kwota: <span className="text-[#DC143C] text-sm">{inputValue.toLocaleString()} PLN</span>
                  </label>
                  <input type="range" min="1000" max="150000" step="1000" value={inputValue} onChange={(e) => setInputValue(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-[#DC143C]" />
                </div>
              )}

              <div className="space-y-4">
                <label className="flex justify-between text-[10px] uppercase font-bold text-white/50 tracking-widest">
                  Okres spłaty: <span className="text-[#DC143C] text-sm">{monthsValue} m-cy</span>
                </label>
                <input type="range" min="3" max="120" step="1" value={monthsValue} onChange={(e) => setMonthsValue(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-[#DC143C]" />
              </div>

              <button onClick={startAnalysis} className="w-full py-5 mt-4 bg-[#DC143C] hover:bg-[#FF0000] text-white font-black rounded-2xl shadow-[0_10px_20px_rgba(220,20,60,0.3)] transition-all uppercase tracking-widest">
                GENERUJ RAPORT EKSPERCKI
              </button>
              <button onClick={reset} className="w-full text-center text-[9px] text-white/20 font-bold uppercase tracking-widest hover:text-white transition-colors mt-4">
                ← Powrót do wyboru
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 border-4 border-[#DC143C]/20 border-t-[#DC143C] rounded-full animate-spin"></div>
          <p className="text-white font-medium animate-pulse text-center uppercase tracking-widest text-[10px]">{loadingText}</p>
        </div>
      )}

      {(step === 3 || step === 5) && renderResultsStep()}
    </div>
  );
}
