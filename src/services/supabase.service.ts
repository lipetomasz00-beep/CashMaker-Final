import { createClient } from '@supabase/supabase-js'

// Pobieramy dane z pliku .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Inicjalizujemy połączenie
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
Krok 4: Operacja – Zapisywanie Leada

W komponencie kalkulatora (np. LoanCalculator.tsx), w funkcji obsługującej kliknięcie przycisku "Generuj Raport", wstaw następujący fragment kodu:
const handleGenerate = async () => {
  // 1. Natychmiastowy zapis do Supabase (zanim klient mrugnie)
  const { error } = await supabase
    .from('leads')
    .insert([
      {   
        session_id: Date.now().toString(), // prosty ID sesji
        target_product: 'kredyt_gotowkowy',
        status: 'wygenerowano_raport'
      }
    ]);
