export const m2mService = {
  async getLoanOffers(amount: number, term: number, zrodlo: string, bik: string, category: string) {
    console.log(`CashMaker: Analiza - ${amount}PLN, ${term}msc, BIK: ${bik}, Źródło: ${zrodlo}`);

    // Symulacja skanowania M2M (1.2 sekundy)
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Zwracamy idealnie skrojoną TABLICĘ z linkami do Twojego panelu
    return [
      { 
        name: "mBank - Wybór Eksperta #CashMaker", 
        url: "https://toomasz-money.oferty-kredytowe.pl" 
      },
      { 
        name: "VeloBank - Gwarancja Decyzji", 
        url: "https://toomasz-money.oferty-kredytowe.pl" 
      }
    ];
  }
};
