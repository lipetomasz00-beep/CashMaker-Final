export class M2mService {
  private readonly API_URL = 'http://localhost:3000/api/oferta'; 

  async getLoanOffers(amount: number, term: number, interestRate: number): Promise<any> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kwota: amount, okres: term })
      });

      if (!response.ok) return null;
      const data = await response.json();
      
      if (data.status === 'SUKCES') {
        return [{
          name: data.rekomendacja,
          url: data.link_docelowy,
          category: 'Rekomendacja Premium'
        }];
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
export const m2mService = new M2mService();
