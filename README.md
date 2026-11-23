# Affärsleads

Svensk webbplats för Affärsleads: kontaktlistor, copy, e-postutskick och uppföljning för B2B-företag.

## Teknik

HTML, CSS och JavaScript utan byggsteg eller externa frontendberoenden. En Vercel Node-funktion i `api/contact.mjs` tar emot kontaktförfrågningar. `vercel.json` anger publicering och säkerhetshuvuden. Webbplatsen publiceras på Vercel från GitHub.

## Erbjudande och avsändare

Bas: 10 e-postkonton och cirka 3 000 unika bearbetade kontakter per månad. Tillväxt: 30 konton och cirka 9 000 kontakter. Premium: anpassat upplägg. Volymerna är indikativa och påverkas av uppvärmning, utskickstakt, uppföljningar och målgrupp. Inga priser är fastställda på sidan.

Peter presenteras som grundare, med det uppladdade porträttet i `assets/peter.png` och erfarenhetsbeskrivningen som Peter har lämnat. Verksamheten drivs av SMEDJAN KREATIV MEDIA.

## Kontaktflöde

Besökaren skickar formuläret direkt från sidan till `/api/contact`. Funktionen validerar uppgifterna och vidarebefordrar dem till Make, som sparar i tabellen **Förfrågningar** i Airtable-basen **Affärsleads.se**. Webbplatsen visar en lyckad bekräftelse först när Make svarar med ett sparat Airtable-record-ID. Ett standardiserat "Accepted" från webhooken räknas inte som kvittens.

Vid fel eller timeout behålls formulärets innehåll och besökaren får ett felmeddelande. Knappen spärras under pågående anrop. Honeypot, begränsad requeststorlek, servervalidering, origin-kontroll och en grundläggande per-instans-gräns på fem försök per tio minuter används. Den senare är en enkel spärr och inte distribuerad botkontroll.

Den separata mejllänken till `peter@affarsleads.se` finns kvar som alternativ. Kontaktflödet skickar inga notifieringsmejl.

### Driftsättning av direktformuläret

- Vercel-variabeln `CONTACT_WEBHOOK_URL` sätts krypterat på servern. Inga hemligheter får läggas i klientkod eller GitHub.
- Make-scenario 8764044 finns skapat men är ännu inaktivt. Webhookens payload har verifierats genom ett tekniskt test i inlärningsläge.
- Ny Airtable-anslutning i Make inväntar Peters godkännande för basen Affärsleads.se. Befintlig anslutning har inte åtkomst till basen.
- Anslut Airtable-modulen, kvittera först efter lagring, aktivera scenariot och testa ett verkligt formuläranrop före sammanslagning/publicering av denna ändring.

## Publicering och DNS

- Offentlig webbplats: https://affarsleads.se/ (HTTPS 200 verifierat 2026-11-23).
- https://www.affarsleads.se/ omdirigerar till huvuddomänen med status 308.
- GitHub-repot är kopplat till Vercel-projektet `affarsleads` i teamet `edge-market-wire`; ändringar på main publiceras automatiskt.
- one.com är domänregistrator. Zapmail/ClouDNS sköter DNS via de befintliga namnservrarna. Vercel hostar webbplatsen. Inga filer behöver laddas upp hos one.com.
- Webbpekning i Zapmail: A för apex till `216.198.79.1`; CNAME för `www` till `412048446b3f2dcc.vercel-dns-017.com`. Dessa värden lästes från Vercel vid kopplingen; läs aktuell Vercel-konfiguration inför framtida ändringar.
- Domänerna är verifierade och DNS-konfigurationen godkänd i Vercel. Certifikat och HTTPS hanteras av Vercel.
- Befintliga NS-, MX-, SPF-, DKIM- och DMARC-poster är jämförda före/efter webbpekningen och oförändrade.
- Publiceringsversionen tillåter indexering och innehåller kanonisk URL samt sitemap för `https://affarsleads.se/`.
- Mottagaradressen `peter@affarsleads.se` är verifierad ACTIVE i Zapmail. Ett riktigt test av mejlmottagning återstår.

## Lokal kontroll

JavaScript-syntax kontrolleras med `node --check script.js`. Kör backendtesterna med `node --test tests/contact.test.mjs`. De täcker validering, avvisad origin, saknad konfiguration, fel hos mottagaren, utebliven lagringskvittens, lyckad lagring och försöksgränsen. En statisk server visar layouten; `/api/contact` kräver en Vercel Functions-miljö.
