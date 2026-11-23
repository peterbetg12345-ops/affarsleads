# Affärsleads

Svensk webbplats för Affärsleads: kontaktlistor, copy, e-postutskick och uppföljning för B2B-företag.

## Teknik

Statisk HTML, CSS och JavaScript utan byggsteg, externa typsnitt, analysverktyg eller tredjepartsskript. Ingen installation behövs. `vercel.json` anger statisk publicering och säkerhetshuvuden. Webbplatsen publiceras på Vercel från GitHub.

## Erbjudande och avsändare

Bas: 10 e-postkonton och cirka 3 000 unika bearbetade kontakter per månad. Tillväxt: 30 konton och cirka 9 000 kontakter. Premium: anpassat upplägg. Volymerna är indikativa och påverkas av uppvärmning, utskickstakt, uppföljningar och målgrupp. Inga priser är fastställda på sidan.

Peter presenteras som grundare, med det uppladdade porträttet i `assets/peter.png` och erfarenhetsbeskrivningen som Peter har lämnat. Verksamheten drivs av SMEDJAN KREATIV MEDIA.

## Kontaktflöde

Formuläret validerar namn, företag, e-post och meddelande och öppnar sedan ett förifyllt mejl till `peter@affarsleads.se`. Besökaren granskar och skickar det själv. Ett kopierbart textalternativ visas om inget e-postprogram öppnas. Webbplatsen skickar inte mejl själv och skriver ännu inte till Airtable.

Ingen förfrågan lagras i cookies eller lokal lagring. Uppgifterna förs över till besökarens e-postprogram när besökaren väljer att öppna mejlet.

## Publicering och DNS

- Offentlig webbplats: https://affarsleads.se/ (HTTPS 200 verifierat 2026-11-23).
- https://www.affarsleads.se/ omdirigerar till huvuddomänen med status 308.
- GitHub-repot är kopplat till Vercel-projektet `affarsleads` i teamet `edge-market-wire`; ändringar på main publiceras automatiskt.
- one.com är domänregistrator. Zapmail/ClouDNS sköter DNS via de befintliga namnservrarna. Vercel hostar webbplatsen. Inga filer behöver laddas upp hos one.com.
- Webbpekning i Zapmail: A för apex till `216.198.79.1`; CNAME för `www` till `412048446b3f2dcc.vercel-dns-017.com`. Dessa värden lästes från Vercel vid kopplingen; läs aktuell Vercel-konfiguration inför framtida ändringar.
- Domänerna är verifierade och DNS-konfigurationen godkänd i Vercel. Certifikat och HTTPS hanteras av Vercel.
- Befintliga NS-, MX-, SPF-, DKIM- och DMARC-poster är jämförda före/efter webbpekningen och oförändrade.
- Publiceringsversionen tillåter indexering och innehåller kanonisk URL samt sitemap för `https://affarsleads.se/`.
- Mottagaradressen `peter@affarsleads.se` är verifierad ACTIVE i Zapmail. Ett riktigt test av mejlmottagning återstår; webbformuläret förbereder ett mejl som besökaren själv skickar.

## Lokal kontroll

Öppna med en valfri statisk webbserver. JavaScript-syntax kan kontrolleras med `node --check script.js`. Sidan använder semantiska sektioner, tangentbordsnavigering, responsiv meny, inbyggd formulärvalidering och reducerad rörelse enligt besökarens inställning.
