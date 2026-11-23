# Affärsleads

Svensk webbplats för Affärsleads: kontaktlistor, copy, e-postutskick och uppföljning för B2B-företag.

## Teknik

HTML, CSS och JavaScript utan byggsteg eller externa frontendberoenden. En Vercel Node-funktion i `api/contact.mjs` tar emot kontaktförfrågningar. `vercel.json` anger publicering och säkerhetshuvuden. Webbplatsen publiceras på Vercel från GitHub.

## Erbjudande och avsändare

Bas: 10 e-postkonton och cirka 3 000 unika bearbetade kontakter per månad. Tillväxt: 30 konton och cirka 9 000 kontakter. Premium: anpassat upplägg. Volymerna är indikativa och påverkas av uppvärmning, utskickstakt, uppföljningar och målgrupp. Inga priser är fastställda på sidan.

Peter presenteras som grundare, med det uppladdade porträttet i `assets/peter.png` och erfarenhetsbeskrivningen som Peter har lämnat. Verksamheten drivs av SMEDJAN KREATIV MEDIA.

## Kontaktflöde

Besökaren skickar formuläret direkt från sidan till `/api/contact`. Vercel-funktionen validerar uppgifterna och anropar Supabase-funktionen `affarsleads-contact`, som sparar i `public.affarsleads_enquiries`. Ingen Make-anslutning behövs. Bekräftelse visas först när databasen kvitterat samma request-ID.

Vid fel eller timeout behålls formulärets innehåll. Ett återförsök med samma ID och identiska uppgifter ger samma kvittens utan ytterligare rad; samma ID med andra uppgifter avvisas. Honeypot, begränsad requeststorlek, servervalidering och origin-kontroll används. Vercel har en grundläggande per-instans-gräns på fem försök per tio minuter; databasen begränsar dessutom fem nya förfrågningar per klientidentifierare och tio minuter över alla instanser. Detta ersätter inte fullständig botkontroll.

Supabase-tabellen har RLS och inga rättigheter för anonyma eller inloggade webbplatsbesökare. Endast Edge-funktionens serverroll får läsa och skriva. RPC-funktionen är security invoker och får bara anropas av service_role. Rå IP-adress sparas inte; en saltad hash används för försöksgränsen. Inga kontaktuppgifter eller nycklar skrivs till applikationens loggar.

Den separata mejllänken till `peter@affarsleads.se` finns kvar som alternativ. Kontaktflödet skickar inga notifieringsmejl. Förfrågningar läses i Supabase Table Editor.

### Driftsättning av direktformuläret

Den här ändringen är förberedd, men **inte aktiverad på den offentliga sidan**. Val av Supabase-projekt inväntas. Ingen databas har ändrats för kontaktformuläret.

1. Välj projekt utan ny kostnad och inspektera befintlig databas. Tillämpa `supabase/contact-schema.sql` som en migration.
2. Publicera `supabase/functions/affarsleads-contact/index.ts` med `verify_jwt=false`: den inbyggda JWT-kontrollen stöder inte moderna API-nycklar. Funktionen kontrollerar i stället `apikey` mot `SUPABASE_PUBLISHABLE_KEYS.default` innan den gör något. Supabase tillhandahåller automatiskt `SUPABASE_SECRET_KEYS.default` för lagringen; den får inte kopieras till klientkod eller repot.
3. Sätt `SUPABASE_URL` och projektets moderna `SUPABASE_PUBLISHABLE_KEY` (namn `default`) som krypterade servervariabler på Vercel för preview och production. Den senare används bara för integrationen och läggs inte i webbläsaren. En publishable-nyckel är inte en hemlighet eller besökarinloggning; tjänsten exponerar bara validerad kontaktinlämning och ger aldrig möjlighet att läsa eller ändra andra poster.
4. Kör ett verkligt formulärtest, kontrollera raden, idempotenta återförsök och att anon/authenticated inte kan läsa eller skriva i tabellen eller anropa RPC-funktionen. Kontrollera säkerhetsrådgivningen.
5. Slå samman ändringen först efter verifierad koppling och kontrollera det publika formuläret.

Gratisplanens gränser gäller. Supabase Free kan pausas efter en veckas inaktivitet; formuläret visar då fel och behåller uppgifterna. Ingen automatisk uppgradering eller betald plan har beställts. Den tidigare Make-lösningen har inte aktiverats och används inte av denna kod.

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

JavaScript-syntax kontrolleras med `node --check script.js`. Kör backendtesterna med `node --test tests/*.test.mjs`. De täcker validering, avvisad origin, saknad konfiguration, fel hos mottagaren, utebliven lagringskvittens, lyckad lagring och försöksgränsen. En statisk server visar layouten; `/api/contact` kräver en Vercel Functions-miljö.
