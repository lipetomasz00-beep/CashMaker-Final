import type { NextApiRequest, NextApiResponse } from 'next';

// MATRYCA PEŁNEGO SPEKTRUM (Baza paliwa z podziałem na kategorie)
// Uzupełnij 'id' swoimi kampaniami z toomasz-money.oferty-kredytowe.pl
const OFFERS_REGISTRY = [
  // --- KATEGORIA 1: KREDYTY GOTÓWKOWE (Bankowe) ---
  { id: "3112", name: "mBank Gotówka", minAmt: 1000, maxAmt: 150000, minBik: "czysty", cat: "kredyt", subCat: "gotowka", reqIncome: true, weight: 100 },
  { id: "XXXX", name: "VeloBank Gotówka", minAmt: 5000, maxAmt: 200000, minBik: "czysty", cat: "kredyt", subCat: "gotowka", reqIncome: true, weight: 90 },

  // --- KATEGORIA 2: KREDYTY KONSOLIDACYJNE ---
  { id: "4201", name: "Alior Konsolidacja", minAmt: 10000, maxAmt: 300000, minBik: "czysty", cat: "kredyt", subCat: "konsolidacja", reqIncome: true, weight: 95 },
  
  // --- KATEGORIA 3: POZABANKOWE RATALNE (Średni BIK) ---
  { id: "1520", name: "Smartney", minAmt: 1000, maxAmt: 60000, minBik: "sredni", cat: "pozabankowe", subCat: "ratalne", reqIncome: false, weight: 100 },
  { id: "YYYY", name: "Wonga", minAmt: 500, maxAmt: 20000, minBik: "sredni", cat: "pozabankowe", subCat: "ratalne", reqIncome: false, weight: 85 },

  // --- KATEGORIA 4: CHWILÓWKI (Negatywny BIK, Puste bazy) ---
  { id: "ZZZZ", name: "Vivus", minAmt: 100, maxAmt: 3000, minBik: "negatywny", cat: "pozabankowe", subCat: "chwilowka", reqIncome: false, weight: 100 },
  { id: "1102", name: "Provident Samoobsługowa", minAmt: 300, maxAmt: 4000, minBik: "negatywny", cat: "pozabankowe", subCat: "chwilowka", reqIncome: false, weight: 90 },

  // --- KATEGORIA 5: FINANSOWANIE FIRM (B2B, Działalność) ---
  { id: "FFFF", name: "Nest Bank Firmowy", minAmt: 10000, maxAmt: 500000, minBik: "czysty", cat: "firma", subCat: "kredyt_firmowy", reqIncome: true, weight: 100 },
  { id: "WWWW", name: "Wealthon (Firma bez BIK)", minAmt: 5000, maxAmt: 50000, minBik: "negatywny", cat: "firma", subCat: "pozyczka_firmowa", reqIncome: false, weight: 80 },

  // --- KATEGORIA 6: KONTA OSOBISTE I FIRMOWE (Ruch niskokwotowy / brak zdolności) ---
  { id: "KKKK", name: "Konto Millennium", minAmt: 0, maxAmt: 0, minBik: "negatywny", cat: "konta", subCat: "osobiste", reqIncome: false, weight: 100 },
  { id: "BBBB", name: "Konto Firmowe mBank", minAmt: 0, maxAmt: 0, minBik: "negatywny", cat: "konta", subCat: "firmowe", reqIncome: false, weight: 100 }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).send('Metoda niedozwolona');

  try {
    const { amount, months, income, bik, category, subcategory, isCompany, epi } = req.body;
    const partnerId = "388900"; 

    // 1. DYNAMICZNA FILTRACJA Z KASKADĄ
    let availableOffers = OFFERS_REGISTRY.filter(off => {
      // Jeśli klient szuka konta, ignorujemy kwoty
      if (off.cat === 'konta') return category === 'konta';

      const matchAmount = amount >= off.minAmt && amount <= off.maxAmt;
      const matchBik = (bik === 'negatywny' && off.minBik === 'czysty') ? false : true;
      const matchIncome = (income.includes('brak') && off.reqIncome) ? false : true;
      const matchCat = category ? off.cat === category : true;
      const matchSubCat = subcategory ? off.subCat === subcategory : true;
      const matchCompany = isCompany ? off.cat === 'firma' || off.cat === 'konta' : off.cat !== 'firma';

      return matchAmount && matchBik && matchIncome && matchCat && matchSubCat && matchCompany;
    });

    // 2. KASKADA AWARYJNA (Zapobiega wyciekowi 100% konwersji)
    let winner;
    if (availableOffers.length > 0) {
      winner = availableOffers.sort((a, b) => b.weight - a.weight)[0];
    } else {
      // PROTOKÓŁ DOWNSELL (Gdy filtry wycięły wszystko)
      if (isCompany) {
        winner = OFFERS_REGISTRY.find(o => o.subCat === "firmowe"); // Daj mu konto firmowe
      } else if (amount <= 3000) {
        winner = OFFERS_REGISTRY.find(o => o.subCat === "chwilowka"); // Mała kwota -> Chwilówka
      } else {
        winner = OFFERS_REGISTRY.find(o => o.id === "1520"); // Fallback na Smartney
      }
    }

    const link_docelowy = `https://tmlead.pl/redirect/${partnerId}_${winner.id}${epi ? `?epi=${epi}` : ''}`;

    return res.status(200).json({
      status: 'APPROVED',
      link_docelowy,
      offerDetails: {
        offerName: winner.name,
        category: winner.cat,
        subCategory: winner.subCat
      }
    });

  } catch (error) {
    return res.status(200).json({ 
        status: 'OFFLINE_MODE', 
        link_docelowy: "https://tmlead.pl/redirect/388900_1520" 
    });
  }
}
