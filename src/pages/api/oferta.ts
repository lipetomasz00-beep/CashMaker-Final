import type { NextApiRequest, NextApiResponse } from 'next';

const OFFERS_REGISTRY = [
  { id: "3112", name: "mBank - Kredyt Gotówkowy Premium", minAmt: 5000, maxAmt: 150000, minBik: "czysty", cat: "gotowka", weight: 90 },
  { id: "1520", name: "Smartney - Gwarantowana Gotówka Online", minAmt: 1000, maxAmt: 60000, minBik: "negatywny", cat: "gotowka", weight: 100 },
  { id: "4201", name: "Alior Bank - Konsolidacja", minAmt: 20000, maxAmt: 200000, minBik: "czysty", cat: "konsolidacja", weight: 85 },
  { id: "1102", name: "Provident - Pożyczka Samoobsługowa", minAmt: 500, maxAmt: 20000, minBik: "negatywny", cat: "pozyczka", weight: 95 }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metoda niedozwolona.' });
  }

  try {
    const { amount, months, income, bik, category, excludedBanks, epi } = req.body;
    const partnerId = "388900"; 

    let availableOffers = OFFERS_REGISTRY.filter(off => {
      const matchAmount = amount >= off.minAmt && amount <= off.maxAmt;
      const matchBik = bik?.toLowerCase() === 'negatywny' ? off.minBik === 'negatywny' : true;
      const matchCat = category ? off.cat === category : true;
      const matchExcluded = excludedBanks ? !excludedBanks.includes(off.id) : true;

      return matchAmount && matchBik && matchCat && matchExcluded;
    });

    if (income && income.toLowerCase().includes('brak')) {
        availableOffers = availableOffers.filter(off => off.minBik === 'negatywny');
    }

    let winner;
    if (availableOffers.length > 0) {
        winner = availableOffers.sort((a, b) => b.weight - a.weight)[0];
    } else {
        winner = OFFERS_REGISTRY.find(o => o.id === "1520"); 
    }

    if (!winner) {
        winner = { id: "1520", name: "Awaryjna Linia Finansowa", weight: 100 };
    }

    const link_docelowy = `https://tmlead.pl/redirect/${partnerId}_${winner.id}${epi ? `?epi=${epi}` : ''}`;

    return res.status(200).json({
      status: 'APPROVED',
      link_docelowy,
      offerDetails: {
        offerName: winner.name,
        offerId: winner.id,
        score: winner.weight
      }
    });

  } catch (error) {
    console.error("Błąd silnika DSR:", error);
    return res.status(200).json({ 
        status: 'OFFLINE_MODE', 
        link_docelowy: "https://tmlead.pl/redirect/388900_1520",
        offerDetails: {
            offerName: "Gwarantowana Gotówka Online",
            offerId: "1520",
            score: 100
        }
    });
  }
}
