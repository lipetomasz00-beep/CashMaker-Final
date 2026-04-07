require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/oferta', async (req, res) => {
    const { kwota, okres, zrodlo, bik, category } = req.body;
    console.log(`\n🔔 CEL: ${category.toUpperCase()} | BIK: ${bik} | Kwota: ${kwota}`);
    
    // PEŁNE MAPOWANIE PODSTRON MONEY2MONEY
    let path = '/kredyty-gotowkowe'; 
    switch(category) {
        case 'gotowka': path = (bik === 'negatywny' || kwota <= 5000) ? '/chwilowki' : '/kredyty-gotowkowe'; break;
        case 'konsolidacja': path = '/kredyty-konsolidacyjne'; break;
        case 'firma': path = '/produkty-dla-firm'; break;
        case 'konta-firmowe': path = '/konta-firmowe'; break;
        case 'hipoteka': path = '/kredyty-hipoteczne'; break;
        case 'karty': path = '/karty-kredytowe'; break;
        case 'ubezpieczenia': path = '/ubezpieczenia'; break;
        case 'premia': path = '/konta-osobiste'; break;
        default: path = '/kredyty-gotowkowe';
    }

    const urlDocelowy = `https://toomasz-money.oferty-kredytowe.pl${path}`;
    console.log(`⚡ ROBOT UDERZA W: ${urlDocelowy}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(urlDocelowy, { waitUntil: 'networkidle' });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1200);
        await page.waitForSelector('.product__button', { timeout: 5000 });
        const wszystkie = await page.evaluate(() => Array.from(document.querySelectorAll('.product__button')).map(btn => btn.getAttribute('data-href') || btn.href));
        const idx = (Math.floor(kwota / 100) * 17 + okres * 23) % wszystkie.length;
        res.status(200).json({ status: "SUKCES", link_docelowy: wszystkie[idx] });
    } catch (e) { res.status(500).json({ error: "Błąd" }); } finally { await browser.close(); }
});
app.listen(3000, () => console.log(`🚀 MÓZG ODPALONY`));
