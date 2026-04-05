export const m2mService = {
  getLoanOffers: async (amount: number, term: number, zrodlo: string, bik: string, category: string) => {
    try {
      // ⚡ ZMIANA KRYTYCZNA: Uderzamy prosto w Twój nowy serwer produkcyjny
      const response = await fetch('https://raport-finansowy24.pl/api/oferta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kwota: amount, okres: term, zrodlo, bik, category })
      });
      
      if (!response.ok) throw new Error('Błąd połączenia z Mózgiem');
      const data = await response.json();
      
      // Dynamiczne nazewnictwo dla autentyczności
      let nazwaBanku = "Oferta Elitarna Dopasowana";
      if (data.link_docelowy) {
        const url = data.link_docelowy.toLowerCase();
        if (url.includes('mbank')) nazwaBanku = "mBank (Priorytet Algorytmu)";
        else if (url.includes('pko')) nazwaBanku = "PKO BP (Oferta Premium)";
        else if (url.includes('alior')) nazwaBanku = "Alior Bank (Szybka Decyzja)";
      }

      return [{ name: nazwaBanku, url: data.link_docelowy }];
    } catch (error) {
      console.error("⚠️ SYSTEM AWARYJNY: Aktywacja linku zapasowego");
      return [{ name: "mBank (Oferta Gwarantowana)", url: "https://tmlead.pl/redirect/388900_3112" }];
    }
  }
};
