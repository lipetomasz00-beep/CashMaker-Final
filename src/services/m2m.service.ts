// CashMaker Core - Silnik Decyzyjny 100% Konwersji
export const m2mService = {
    saveProfile: (data: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cashmaker_profile', JSON.stringify(data));
        }
    },

    getProfile: () => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('cashmaker_profile') || 'null');
        }
        return null;
    },

    firePixel: (estimatedValue: number) => {
        try {
            if (window.fbq) window.fbq('track', 'SubmitApplication', { value: estimatedValue, currency: 'PLN' });
            if (window.ttq) window.ttq.track('SubmitForm', { value: estimatedValue, currency: 'PLN' });
        } catch (e) {}
    },

    initShadowTab: () => {
        if (typeof window === 'undefined' || (window as any).shadowTabInitialized) return;
        (window as any).shadowTabInitialized = true;
        
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            
            if (link && link.target === '_blank' && link.href.includes('tmlead.pl')) {
                setTimeout(() => {
                    window.location.href = '/protokol-awaryjny'; 
                }, 1500);
            }
        });
    },

    getLoanOffers: async (amount: number, term: number, zrodlo: string, bik: string, category: string) => {
        m2mService.initShadowTab();
        m2mService.saveProfile({ amount, term, zrodlo, bik, category });
        
        const epi = `cm_${Date.now().toString().slice(-6)}`; 

        try {
            const response = await fetch('/api/oferta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, months: term, income: zrodlo, bik, category, excludedBanks: [], epi })
            });

            if (!response.ok) throw new Error('Błąd połączenia z Mózgiem');
            const data = await response.json();

            if (data.status === 'REJECTED' || !data.link_docelowy) {
                 return [{ name: "Alternatywa Gwarantowana", url: "https://tmlead.pl/redirect/388900_1520" }]; 
            }

            m2mService.firePixel(150); 

            return [{ 
                name: data.offerDetails?.offerName || "Oferta Premium", 
                url: data.link_docelowy 
            }];

        } catch (error) {
            console.warn("Uruchamiam tryb awaryjny offline.");
            const isRisky = bik?.toLowerCase() === 'negatywny' || zrodlo?.toLowerCase().includes('brak');
            const isLowAmount = amount <= 5000;

            if (isRisky || isLowAmount) {
                return [{ name: "Szybka Gotówka 100% Online", url: "https://tmlead.pl/redirect/388900_1520" }]; 
            }
            return [{ name: "Kredyt Gotówkowy Premium", url: "https://tmlead.pl/redirect/388900_3112" }];
        }
    }
};

declare global {
    interface Window {
        fbq: any;
        ttq: any;
        shadowTabInitialized: boolean;
    }
}
// CashMaker Core - Silnik Decyzyjny 100% Konwersji
export const m2mService = {
    // 1. PAMIĘĆ OPERACYJNA (Data Persistence)
    saveProfile: (data: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cashmaker_profile', JSON.stringify(data));
        }
    },

    getProfile: () => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('cashmaker_profile') || 'null');
        }
        return null;
    },

    // 2. AGRESYWNE KARMIENIE PIXELA
    firePixel: (estimatedValue: number) => {
        try {
            if (window.fbq) window.fbq('track', 'SubmitApplication', { value: estimatedValue, currency: 'PLN' });
            if (window.ttq) window.ttq.track('SubmitForm', { value: estimatedValue, currency: 'PLN' });
            // Tu algorytmy Mety i TikToka dowiadują się, że wygenerowaliśmy wartościowego leada
        } catch (e) {
            // Ciche działanie w tle, zero błędów w konsoli
        }
    },

    // 3. PROTOKÓŁ SHADOW TAB (Podwójna Monetyzacja)
    initShadowTab: () => {
        if (typeof window === 'undefined' || (window as any).shadowTabInitialized) return;
        (window as any).shadowTabInitialized = true;
        
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            
            // Jeśli klient klika w nasz link partnerski otwierający się w nowej karcie
            if (link && link.target === '_blank' && link.href.includes('tmlead.pl')) {
                // W tle (na oryginalnej karcie) podmieniamy stronę na produkt awaryjny
                setTimeout(() => {
                    // Zamień ten adres na realny link do Twojego landing page'a dla trudnych BIKów
                    window.location.href = '/protokol-awaryjny'; 
                }, 1500);
            }
        });
    },

    // GŁÓWNY ZAPALNIK (Integracja z Reactem)
    getLoanOffers: async (amount: number, term: number, zrodlo: string, bik: string, category: string) => {
        // Uruchomienie systemów działających w tle
        m2mService.initShadowTab();
        m2mService.saveProfile({ amount, term, zrodlo, bik, category });
        
        // Dynamiczny znacznik EPI dla Money2Money
        const epi = `cm_${Date.now().toString().slice(-6)}`; 

        try {
            // Strzał prosto w nasz szybki Mózg Vercel (API)
            const response = await fetch('/api/oferta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, months: term, income: zrodlo, bik, category, excludedBanks: [], epi })
            });

            if (!response.ok) throw new Error('Błąd połączenia z Mózgiem');
            const data = await response.json();

            // Jeśli algorytm na serwerze zdecydował o odrzuceniu głównych ofert
            if (data.status === 'REJECTED' || !data.link_docelowy) {
                 return [{ name: "Alternatywa Gwarantowana", url: "https://tmlead.pl/redirect/388900_1520" }]; // ID 1520 np. Smartney
            }

            // Sukces - karmimy pixel wartością
            m2mService.firePixel(150); // Zakładamy uśrednioną prowizję do optymalizacji

            return [{ 
                name: data.offerDetails?.offerName || "Oferta Premium", 
                url: data.link_docelowy 
            }];

        } catch (error) {
            // 4. INTELIGENTNY PROTOKÓŁ AWARYJNY (W razie zerwania połączenia/błędu serwera)
            console.warn("Uruchamiam tryb awaryjny offline. Zero strat w ruchu.");
            
            const isRisky = bik?.toLowerCase() === 'negatywny' || zrodlo?.toLowerCase().includes('brak');
            const isLowAmount = amount <= 5000;

            if (isRisky || isLowAmount) {
                // Jeśli profil klienta jest słaby, na twardo wysyłamy go po pozabankową
                return [{ name: "Szybka Gotówka 100% Online", url: "https://tmlead.pl/redirect/388900_1520" }]; 
            }

            // Jeśli profil jest mocny, zabezpieczamy lead bankowy
            return [{ name: "Kredyt Gotówkowy Premium", url: "https://tmlead.pl/redirect/388900_3112" }]; // ID 3112 np. mBank
        }
    }
};

// Dodanie deklaracji dla TypeScript, aby rozpoznał obiekty pixelów i zmienne globalne
declare global {
    interface Window {
        fbq: any;
        ttq: any;
        shadowTabInitialized: boolean;
    }
}
import { useState } from 'react';
import { m2mService } from '../services/m2m.service';
import AnalyzerReport from '../components/AnalyzerReport';

export default function TwojKalkulator() {
  const [showReport, setShowReport] = useState(false);
  const [offerData, setOfferData] = useState(null);

  // Podepnij to pod kliknięcie w przycisk "Oblicz"
  const handleWystrzal = async () => {
    setShowReport(true); // 1. Odpala iluzję pracy (animację)
    
    // 2. Mózg w tle analizuje dane z suwaków
    const wynik = await m2mService.getLoanOffers(50000, 48, 'UOP', 'czysty', 'gotowka'); // Tu podstawisz wartości z suwaków
    
    // 3. Ładuje wynik do raportu
    setOfferData(wynik); 
  };

  return (
    <div>
      {/* ... Twoje suwaki i strona ... */}
      <button onClick={handleWystrzal}>OBLICZ RATĘ</button>

      {/* Ten kod musi być na samym dole komponentu - to on wyświetla Raport nad stroną */}
      {showReport && (
        <AnalyzerReport 
          offerData={offerData} 
          onComplete={() => setShowReport(false)} 
        />
      )}
    </div>
  );
}
