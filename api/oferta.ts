import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { kwota, okres, zrodlo, bik, category } = req.body;

  // Tutaj ląduje Twoja logika Mózgu. 
  // Na ten moment Twój identyfikator partnera: 388900
  const link_docelowy = "https://tmlead.pl/redirect/388900_3112"; 

  return res.status(200).json({ link_docelowy });
}
