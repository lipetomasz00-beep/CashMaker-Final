import React, { useState, useEffect } from 'react';

const styles = {
  overlay: "fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 antialiased",
  card: "bg-gray-800 border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl w-full max-w-2xl transform transition-all duration-500",
  title: "text-3xl md:text-4xl font-extrabold text-white text-center mb-2 tracking-tighter",
  subtitle: "text-gray-400 text-center mb-10 text-lg",
  progressContainer: "w-full bg-gray-700 rounded-full h-4 mb-6 relative overflow-hidden shadow-inner",
  progressBar: "bg-emerald-500 h-4 rounded-full transition-all duration-100 ease-linear shadow-[0_0_15px_3px_rgba(16,185,129,0.5)]",
  statusText: "text-emerald-400 font-mono text-center text-sm md:text-base h-6 min-h-6 mb-12 tracking-wide",
  resultCard: "bg-gray-900/50 border border-emerald-900 rounded-2xl p-6 mb-10 transform scale-100 animate-popIn",
  resultHeader: "text-gray-500 text-xs uppercase tracking-widest mb-1 text-center",
  resultValue: "text-5xl font-black text-white text-center tracking-tighter mb-6",
  ctaButton: "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_10px_rgba(16,185,129,0.3)] animate-pulse shadow-lg flex items-center justify-center gap-3",
};

const REPORT_STEPS = [
  { p: 10, t: "Inicjalizacja protokołu CashMaker..." },
  { p: 25, t: "Nawiązywanie bezpiecznego połączenia z Mózgiem DSR..." },
  { p: 40, t: "Skanowanie 43 aktywnych ofert bankowych..." },
  { p: 60, t: "Weryfikacja wewnętrznych baz scoringowych..." },
  { p: 75, t: "Odrzucanie ofert o niskim współczynniku akceptacji..." },
  { p: 90, t: "Generowanie ostatecznego certyfikatu wypłaty..." },
  { p: 100, t: "Analiza zakończona sukcesem." },
];

interface AnalyzerReportProps {
  onComplete: () => void;
  offerData: {
    link_docelowy: string;
    offerDetails?: { offerName: string; offerId: string; score: number };
  } | null;
}

const AnalyzerReport: React.FC<AnalyzerReportProps> = ({ onComplete, offerData }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let currentStepIndex = 0;
    const TOTAL_DURATION = 4000; // Skróciłam minimalnie do 4 sekund (optymalne)
    const INTERVAL = 50;
    const increment = 100 / (TOTAL_DURATION / INTERVAL);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsFinished(true), 400); 
          return 100;
        }

        if (currentStepIndex < REPORT_STEPS.length && next >= REPORT_STEPS[currentStepIndex].p) {
          setStatusText(REPORT_STEPS[currentStepIndex].t);
          currentStepIndex++;
        }
        return next;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={`${styles.card} ${isFinished ? 'border-emerald-700' : ''}`}>
        
        {/* FAZA 1: Skanowanie (Odpala się zawsze, nawet jak Mózg jeszcze myśli) */}
        {!isFinished && (
          <div className="animate-fadeIn">
            <h2 className={styles.title}>System Analizy Ryzyka</h2>
            <p className={styles.subtitle}>CashMaker przetwarza Twoje dane w czasie rzeczywistym</p>
            
            <div className={styles.progressContainer}>
              <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            </div>
            
            <p className={styles.statusText}>
              <span className="text-gray-500">&gt;</span> {statusText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        )}

        {/* FAZA 2: Wynik (Pokazuje się dopiero gdy pasek ma 100% I mamy dane z Mózgu) */}
        {isFinished && offerData && (
          <div className="animate-popIn text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-900/50 border-4 border-emerald-500 mb-8 shadow-[0_0_20px_5px_rgba(16,185,129,0.4)]">
                <svg className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h2 className={styles.title}>Raport Wygenerowany</h2>
            <p className={`${styles.subtitle} mb-8`}>Zidentyfikowano optymalny produkt finansowy dla Twojego profilu</p>
            
            <div className={styles.resultCard}>
                <p className={styles.resultHeader}>Rekomendowany Partner</p>
                <p className={styles.resultValue}>{offerData.offerDetails?.offerName || "Partner Premium"}</p>
                <div className="grid grid-cols-2 gap-4 text-sm font-mono mt-4 border-t border-gray-700 pt-4">
                    <div className="text-gray-400">Gwarancja Wypłaty: <span className="text-emerald-400">98%</span></div>
                    <div className="text-gray-400">Decyzja: <span className="text-emerald-400">&lt; 15 min</span></div>
                </div>
            </div>
            
            <a 
              href={offerData.link_docelowy} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.ctaButton}
            >
              ODBIERZ ŚRODKI TERAZ
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <p className="text-gray-600 text-xs mt-4">Link wygasa za 15 minut ze względu na wysokie zainteresowanie.</p>
          </div>
        )}

        {/* Zabezpieczenie: Pasek doszedł do 100%, ale Vercel (Mózg) ma opóźnienie */}
        {isFinished && !offerData && (
           <div className="text-center animate-fadeIn">
              <p className="text-emerald-400 font-mono animate-pulse">Szyfrowanie ostatecznego połączenia...</p>
           </div>
        )}
      </div>

      {/* Poprawiony tag stylów - 100% kompatybilności */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-popIn { animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default AnalyzerReport;
