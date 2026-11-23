# Affärsleads

Svensk webbplats för Affärsleads: kontaktlistor, copy, e-postutskick och uppföljning för B2B-företag.

## Teknik

Statisk HTML, CSS och JavaScript utan byggsteg, externa typsnitt, analysverktyg eller tredjepartsskript. Ingen installation behövs. `vercel.json` anger statisk publicering och säkerhetshuvuden. Samma webbplats kan hostas hos one.com genom att ladda upp `index.html`, `styles.css`, `script.js`, `favicon.svg`, `robots.txt` och katalogen `assets/` i webbrot.

## Erbjudande och avsändare

Bas: 10 e-postkonton och cirka 3 000 unika bearbetade kontakter per månad. Tillväxt: 30 konton och cirka 9 000 kontakter. Premium: anpassat upplägg. Volymerna är indikativa och påverkas av uppvärmning, utskickstakt, uppföljningar och målgrupp. Inga priser är fastställda på sidan.

Peter presenteras som grundare, med det uppladdade porträttet i `assets/peter.png` och erfarenhetsbeskrivningen som Peter har lämnat. Verksamheten drivs av SMEDJAN KREATIV MEDIA.

## Kontaktflöde

Formuläret validerar namn, företag, e-post och meddelande och öppnar sedan ett förifyllt mejl till `peter@affarsleads.se`. Besökaren granskar och skickar det själv. Ett kopierbart textalternativ visas om inget e-postprogram öppnas. Webbplatsen skickar inte mejl själv och skriver ännu inte till Airtable.

Ingen förfrågan lagras i cookies eller lokal lagring. Uppgifterna förs över till besökarens e-postprogram när besökaren väljer att öppna mejlet.

## Inför offentlig lansering

- Mottagaradressen `peter@affarsleads.se` är verifierad ACTIVE i Zapmail 2026-11-23. Ett riktigt test av mottagning återstår.
- Fastställ och lägg till firmans juridiska namn, organisationsnummer, kontaktuppgifter och relevant integritetsinformation.
- Bekräfta texter, erbjudande och att Peter ska vara kontaktperson.
- GitHub-repot är kopplat till Vercel-projektet `affarsleads` i teamet `edge-market-wire`; ändringar på main publiceras automatiskt.
- Peter valde befintlig hosting hos one.com för den kommersiella webbplatsen 2026-11-23. Vercel finns kvar som utvecklingsmiljö; GitHub innehåller källkoden.
- Koppla `affarsleads.se` och vid behov `www.affarsleads.se` enligt hostingens aktuella DNS-instruktioner. Behåll befintliga MX-, SPF-, DKIM- och DMARC-poster för Zapmail.
- Publiceringsversionen tillåter indexering och innehåller kanonisk URL samt sitemap för `https://affarsleads.se/`.

## Publicering hos one.com

1. Säkerställ att affarsleads.se är kopplad till den lediga hostingplatsen hos one.com.
2. Öppna File Manager för just den domänen. Lägg `index.html`, `styles.css`, `script.js`, `favicon.svg`, `robots.txt`, `sitemap.xml`, `.htaccess` och mappen `assets/` direkt i webbrot. Bevara eventuella befintliga filer genom backup först.
3. Domänen använder Zapmails namnservrar. Lägg därför webbpekningen i Zapmail: A för apex till den IP-adress one.com anger för denna hostingplats, samt www enligt one.coms anvisningar. Byt inte namnservrar och ändra inte MX/SPF/DKIM/DMARC.
4. Verifiera SSL för domänen hos one.com. På deras äldre hostingplattform med externa namnservrar kan `_acme-challenge` CNAME till `affarsleads.se.acme.service.one.com` behövas; använd anvisningen för den faktiska plattformen.
5. Kontrollera https://affarsleads.se/, www, CSS, JavaScript, porträtt, robots.txt, sitemap.xml och kontaktvägen efter publicering. Aktivera önskad HTTPS-omdirigering först när certifikatet fungerar.

DNS och uppladdning hos one.com är ännu inte utförda. Webbhotellets IP-adress inväntas och den anslutna webbläsaren tillät inte åtkomst till one.com vid förberedelsen.

## Lokal kontroll

Öppna med en valfri statisk webbserver. JavaScript-syntax kan kontrolleras med `node --check script.js`. Sidan använder semantiska sektioner, tangentbordsnavigering, responsiv meny, inbyggd formulärvalidering och reducerad rörelse enligt besökarens inställning.
