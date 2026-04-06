require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/oferta', async (req, res) => {
    // Dodano bezpieczne dekodowanie parametrów
    const { kwota, okres, zrodlo, bik, category = 'gotowka' } = req.body;

    // Walidacja podstawowych parametrów
    if (!kwota || !okres || !zrodlo || !bik) {
        return res.status(400).json({
            error: "Brak wymaganych parametrów: kwota, okres, zrodlo, bik"
        });
    }
    const kwotaNum = Number(kwota);
    const okresNum = Number(okres);
    if (isNaN(kwotaNum) || isNaN(okresNum)) {
        return res.status(400).json({
            error: "kwota i okres muszą być liczbami"
        });
    }

    console.log(`\n🔔 LEAD: ${kwotaNum}PLN / ${okresNum}msc / BIK: ${String(bik).toUpperCase()} / Dochód: ${String(zrodlo).toUpperCase()}`);
    
    // Wybór kategorii - w całości przepisane aby nie było niezgodności
    let path = '/kredyty-gotowkowe';
    switch(category) {
        case 'gotowka':
            path = (bik === 'negatywny' || kwotaNum <= 5000) ? '/chwilowki' : '/kredyty-gotowkowe'; break;
        case 'konsolidacja': path = '/kredyty-konsolidacyjne'; break;
        case 'firma': path = '/produkty-dla-firm'; break;
        case 'konta-firmowe': path = '/konta-firmowe'; break;
        case 'hipoteka': path = '/kredyty-hipoteczne'; break;
        case 'karty': path = '/karty-kredytowe'; break;
        case 'ubezpieczenia': path = '/ubezpieczenia'; break;
        case 'premia': path = '/konta-osobiste'; break;
        default: path = '/kredyty-gotowkowe';
    }

    // Poprawka: korzystamy ze zmiennej path
    const urlDocelowy = `https://toomasz-money.oferty-kredytowe.pl${path}`;
    console.log(`⚡ KIERUJĘ SKANERY NA: ${urlDocelowy}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(urlDocelowy, { waitUntil: 'networkidle', timeout: 30000 });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);
        await page.waitForSelector('.product__button', { timeout: 5000 });

        const wszystkieLinki = await page.evaluate(() => {
            const przyciski = document.querySelectorAll('.product__button');
            return Array.from(przyciski).map(btn => btn.getAttribute('data-href') || btn.href);
        });

        if (wszystkieLinki.length === 0) throw new Error("Brak linków w tej podkategorii");

        const bazaKwoty = Math.floor(kwotaNum / 100) + 1;
        const hash = (bazaKwoty * 17) + (okresNum * 23) + (bik === 'czysty' ? 11 : 3) + (zrodlo === 'uop' ? 5 : 13);
        const indexOferty = hash % wszystkieLinki.length;
        
        const precyzyjnyLink = wszystkieLinki[indexOferty];
        console.log(`✅ ZNALEZIONO OFERT: ${wszystkieLinki.length}. WYBRANO LINK NR: ${indexOferty}`);
        
        res.status(200).json({ status: "SUKCES", link_docelowy: precyzyjnyLink });

    } catch (*

