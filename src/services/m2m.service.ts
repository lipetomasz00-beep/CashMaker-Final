getLoanOffers: async (amount: number, term: number, zrodlo: string, bik: string, category: string) => {
    try {
      console.log(`🚀 Start analizy: ${category} | ${amount} PLN`);
      
      const response = await fetch('https://raport-finansowy24.pl/api/oferta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kwota: amount, okres: term, zrodlo, bik, category })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      console.log("✅ Dane odebrane z Mózgu");

      // Logika mapowania - sprawiamy, że raport nie wygląda jak "link z automatu"
      let brand = "System CashMaker VIP";
      if (data.link_docelowy?.includes('mbank')) brand = "mBank (Rekomendacja Eksperta)";
      if (data.link_docelowy?.includes('alior')) brand = "Alior Bank (Decyzja w 60s)";
      
      return [{ 
        name: brand, 
        url: data.link_docelowy || "https://tmlead.pl/redirect/388900_3112" 
      }];

    } catch (error: any) {
      console.error("❌ BŁĄD KRYTYCZNY:", error.message);
      // Zwracamy błąd w nazwie, żebyś widział na ekranie, co się dzieje
      return [{ 
        name: `⚠️ BŁĄD: ${error.message}`, 
        url: "#" 
      }];
    }
  }
