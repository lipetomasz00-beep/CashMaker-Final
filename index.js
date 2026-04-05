require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
app.use(cors());
app.use(express.json());

console.log("------------------------------------");
console.log("🚀 CASHMAKER API: INICJALIZACJA...");
console.log("------------------------------------");

app.post('/api/oferta', async (req, res) => {
    const { kwota, okres, zrodlo, bik } = req.body;
    console.log(`\n🔔 LEAD: ${kwota}PLN / ${okres}msc / BIK: ${bik.toUpperCase()} / Dochód: ${zrodlo.toUpperCase()}`);
    
    // Twarda logika algorytmu
    let kategoria = '/kredyty-gotowkowe'; 
    
    if (bik === 'negatywny') {
        // Klient z opóźnieniami - omijamy banki, uderzamy w sektor pozabankowy
        kategoria = '/chwilowki';
    } else if (kwota <= 5000) {
        kategoria = '/chwilowki';
    } else if (kwota > 5000 && kwota <= 20000) {
        kategoria = '/pozyczki';
    }

    const urlDocelowy = `https://toomasz-money.oferty-kredytowe.pl${kategoria}`;
    console.log(`⚡ KIERUJĘ SKANERY NA: ${urlDocelowy}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(urlDocelowy, { waitUntil: 'networkidle' });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);
        await page.waitForSelector('.product__button', { timeout: 5000 });

        const wszystkieLinki = await page.evaluate(() => {
            const przyciski = document.querySelectorAll('.product__button');
            return Array.from(przyciski).map(btn => btn.getAttribute('data-href') || btn.href);
        });

        if (wszystkieLinki.length === 0) throw new Error("Brak linków w tej podkategorii");

        const bazaKwoty = Math.floor(kwota / 100) + 1;
        const hash = (bazaKwoty * 17) + (okres * 23) + (bik === 'czysty' ? 11 : 3) + (zrodlo === 'uop' ? 5 : 13);
        const indexOferty = hash % wszystkieLinki.length;
        
        const precyzyjnyLink = wszystkieLinki[indexOferty];

        console.log(`✅ ZNALEZIONO OFERT: ${wszystkieLinki.length}. WYBRANO LINK NR: ${indexOferty}`);
        
        res.status(200).json({ status: "SUKCES", link_docelowy: precyzyjnyLink });

    } catch (error) {
        console.log("❌ BŁĄD: " + error.message);
        res.status(500).json({ error: "Błąd analizy ofert M2M" });
    } finally {
        await browser.close();
    }
});

app.listen(3000, () => console.log(`✅ SYSTEM GOTOWY. Nasłuchuję na porcie: 3000`));
