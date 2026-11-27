# Affärsleads

Svensk webbplats för Affärsleads: kontaktlistor, copy, e-postutskick och uppföljning för B2B-företag.

## Teknik

Next.js 16 App Router med React 19, Node 24 och officiella `@vercel/analytics/next`. Serverrenderade JSX-sidor och samma CSS, bilder och innehåll som tidigare. `app/components/site-interactions.jsx` startar menyn, formulären och kalkylatorn med återställningsbara eventlyssnare. `pages/api/contact.js` och `pages/api/notifications.js` exponerar de befintliga, testade serverfunktionerna. Supabase och SMTP fortsätter med samma servervariabler. Webbplatsen publiceras på Vercel från GitHub.

`proxy.js` ger varje sidförfrågan en egen CSP-nonce som Next.js använder för sina skript. Inga generella inline-skript tillåts. Bilder, favicon, robots och sitemap ligger i `public/`. `/integritet.html` finns kvar; `/index.html` omdirigeras permanent till startsidan.

## Logotyp

Den godkända logotypen med ett handslag av två pratbubblor finns i `public/assets/affarsleads-logo.png`. Originalbilden har transparent bakgrund och används oförändrad i sidhuvud, sidfot och illustrationen. CSS visar logotypen genom ett anpassat utsnitt så att bildens transparenta marginaler inte tar plats i layouten.

## Erbjudande och avsändare

Bas: upp till 2 000 nya unika kontakter, 11 990 kr/mån och 3 000 kr i uppstart. Tillväxt: 4 000 kontakter, 19 990 kr/mån och 5 000 kr i uppstart. Premium: 8 000 kontakter, 29 990 kr/mån och 7 500 kr i uppstart. Större volymer från 10 000 samt särskilt nischade målgrupper offereras. Uppföljningar ingår och räknas inte som nya kontakter. Alla priser är exklusive moms. Uppstart betalas vid månadsavtal; med tre månaders bindningstid slopas den. Månadskostnaden börjar när utskicken startar.

Peter Berg presenteras som grundare med det senast uppladdade porträttet i `public/assets/peter-profile.png` och den mindre visningsstorleken. Erfarenhetsbeskrivningen bygger på Peters uppgifter: tidigare Head Lead Gen Expert på en av Storbritanniens största mötesbokningssajter. Verksamheten drivs av SMEDJAN KREATIV MEDIA.

## Kontaktflöde

Toppsektionen behåller huvudbudskapet och illustrationen sida vid sida på dator, med ett kompakt kontaktformulär i ett gemensamt fält direkt under. På mobil följer formuläret efter introduktionen och före illustrationen. Det snabba formuläret finns i `#kontakt`. En separat uppläggsguide finns i `#upplagg`.

Besökaren skickar formuläret direkt från sidan till `/api/contact`. Vercel-funktionen validerar uppgifterna och anropar Supabase-funktionen `affarsleads-contact`, som sparar i `public.affarsleads_enquiries`. Ingen Make-anslutning behövs. Bekräftelse visas först när databasen kvitterat samma request-ID.

Vid fel eller timeout behålls formulärets innehåll. Ett återförsök med samma ID och identiska uppgifter ger samma kvittens utan ytterligare rad; samma ID med andra uppgifter avvisas. Honeypot, begränsad requeststorlek, servervalidering och origin-kontroll används. Vercel har en grundläggande per-instans-gräns på fem försök per tio minuter; databasen begränsar dessutom fem nya förfrågningar per klientidentifierare och tio minuter över alla instanser. Detta ersätter inte fullständig botkontroll.

Supabase-tabellen har RLS och en uttrycklig nekande policy samt inga tabellrättigheter för anonyma eller inloggade webbplatsbesökare. Endast Edge-funktionens serverroll får läsa och skriva. RPC-funktionen är security invoker och får bara anropas av service_role. Rå IP-adress sparas inte; en saltad hash används för försöksgränsen. Inga kontaktuppgifter eller nycklar skrivs till applikationens loggar.

Den separata mejllänken till `peter@affarsleads.se` finns kvar som alternativ. Varje ny förfrågan läggs i en skyddad utkorg i samma databastransaktion och mejlas från `peter@affarsleads.se` till **peterbetg12345@gmail.com**. Kundens adress sätts som Reply-To. Förfrågningar kan också läsas i Supabase Table Editor.

Mejlet innehåller namn, företag, e-postadress, valt paket, meddelande och mottagningstid. SMTP-uppgifterna och `NOTIFICATION_TOKEN` finns bara krypterade på Vercel. En hash av den interna token skyddar Supabase-funktionens administrativa köåtgärder. Utkorgen har RLS och inga besökarrättigheter.

En serverarbetare försöker skicka direkt efter lagring. Supabase Cron anropar dessutom `/api/notifications` var femte minut med en autentiseringstoken från Vault. Fel får exponentiell väntetid (högst 60 minuter); en femminuters lease hindrar samtidiga arbetare från att skicka samma post. Status och SMTP-kvittens sparas innan nästa försök. SMTP har inte exakt-en-gång-garantier: ett avbrott mellan accepterat mejl och databaskvittens kan ge ett dubbelt mejl. Förfrågan förblir sparad även vid mejlfel.

Tillämpa `supabase/notification-schema.sql` efter grundschemat. SMTP använder Google Workspace på `smtp.gmail.com:465` med det befintliga kontots applösenord. Avsändaren ligger i `SMTP_USER`, lösenordet i `SMTP_APP_PASSWORD`; inga lösenord finns i repot. Det schemalagda jobbet behöver `affarsleads_notification_token` i Vault.

### Driftsättning av direktformuläret

Supabase-projekt: **Affärsleads** (`mhsizfalezlahatayyre`), Stockholm, Free. Organisation: `pnwxmguxcwtuuxjlfaie` (AutonomiQs). Läs förfrågningarna i projektets Table Editor: https://supabase.com/dashboard/project/mhsizfalezlahatayyre/editor

Tabell, RPC och Edge-funktion finns publicerade. Vercel-variablerna är konfigurerade för preview och production. Följande beskriver konfigurationen för framtida driftsättning.

1. Inspektera målets befintliga databas. Tillämpa `supabase/contact-schema.sql` som en migration.
2. Publicera `supabase/functions/affarsleads-contact/index.ts` med `verify_jwt=false`: den inbyggda JWT-kontrollen stöder inte moderna API-nycklar. Funktionen kontrollerar i stället `apikey` mot `SUPABASE_PUBLISHABLE_KEYS.default` innan den gör något. Supabase tillhandahåller automatiskt `SUPABASE_SECRET_KEYS.default` för lagringen; den får inte kopieras till klientkod eller repot.
3. Sätt `SUPABASE_URL` och projektets moderna `SUPABASE_PUBLISHABLE_KEY` (namn `default`) som krypterade servervariabler på Vercel för preview och production. Den senare används bara för integrationen och läggs inte i webbläsaren. En publishable-nyckel är inte en hemlighet eller besökarinloggning; tjänsten exponerar bara validerad kontaktinlämning och ger aldrig möjlighet att läsa eller ändra andra poster.
4. Kör ett verkligt formulärtest, kontrollera raden, idempotenta återförsök och att anon/authenticated inte kan läsa eller skriva i tabellen eller anropa RPC-funktionen. Kontrollera säkerhetsrådgivningen.
5. Publicera genom main och kontrollera det publika formuläret. HTTPS- och POST-test ska kvitteras mot databasen.

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

Kör `npm ci`, `npm run build` och `npm test`. Testerna täcker paketgränser, kontaktinlämning, idempotens, SMTP-kvittens, avvisade anrop och statistikens integritetsskydd. Starta det byggda projektet med `npm start -- --port 3100` och kör `TEST_ORIGIN=http://127.0.0.1:3100 npm test` för DOM-kontroller av båda sidorna, kalkylatorns val, formulärpayload och hantering av återmontering. Testerna använder simulerad formulärleverans och skickar inga verkliga förfrågningar.

## Uppläggskalkylator

`app/components/calculator-client.mjs` driver en kalkylator där alla val är synliga samtidigt: målgrupp, frivillig bransch, marknad, kontaktvolym och antal uppföljningar. Paketförslag och maxscenario för planerade mejl uppdateras direkt. Volymreglaget har snabbval och inställningarna kan återställas. Kontaktformuläret finns intill sammanställningen, utan separata steg eller låst resultat.

`guide-model.mjs` mappar upp till 2 000 kontakter till Bas, upp till 4 000 till Tillväxt och upp till 8 000 till Premium. Högre eller okänd volym ger offert. `estimatePricing` visar månadspris, uppstart och första kampanjmånadens total utifrån avtalsvalet. `estimateWorkload` visar kontaktvolym × (ett första mejl + 0–4 uppföljningar), ett maxscenario utan löften om leverans eller resultat.

Kalkylatorns kontaktformulär och snabbformuläret använder samma validerade `/api/contact`, med separat felstatus och idempotens-ID. Alla val, inklusive uppföljningar och maxscenario, sammanställs i meddelandet och följer med till Supabase och mejlnotisen. Inga val skickas före förfrågan.

Kör `node --test tests/guide-model.test.mjs` för paketgränser, maxscenario och meddelandets innehåll.

## Integritet och cookies

`app/integritet.html/page.jsx` beskriver webbplatsbesök och inkommande förfrågningar; den omfattar inte kontaktlistor i kunduppdrag. Länkar finns vid båda formulären och i sidfoten. Inga annonsskript har lagts till. Besöksstatistik och den nödvändiga kakan för statistikvalet beskrivs nedan. Samtycke till integritetspolicyn är inte ett obligatoriskt formulärfält; hanteringen av inkommande B2B-frågor grundas på berättigat intresse.

Lagringen beskrivs genom kriterier (pågående handläggning och relevant affärsdialog), inte en automatisk tidsgräns. Peter behöver göra manuell gallringsbedömning när dialogen avslutas och följa upp kvarvarande förfrågningar. Gallringen ska omfatta Supabase-förfrågan och dess notifieringskö samt kopior i avsändarens och mottagarens e-post, inklusive relevanta papperskorgar. Inga befintliga uppgifter raderas av den här webbändringen. Respektera eventuella skyldigheter att bevara särskilda underlag och dokumentera skälet. Vid begäran om rättigheter: verifiera avsändarens identitet i proportion till risken, sök i både databas och e-post och hantera begäran enligt GDPR:s tidsfrister.

Uppdatera informationen när leverantörer, ansvar, ändamål eller lagringsrutiner ändras. Om statistik- eller marknadsföringsteknik införs ska dess faktiska samtyckesbehov bedömas innan aktivering; en banner i sig blockerar inga skript. Leverantörernas publicerade överföringsskydd är länkade på sidan; sidan gör inget påstående om att alla kunduppdrag eller alla avtal därmed har granskats.

## Besöksstatistik med frivilligt samtycke

`app/components/privacy-controls.jsx` monterar den officiella Next.js-komponenten för Vercel Web Analytics endast efter uttryckligt godkännande. Lika utformade knappar för att neka och godkänna. Ett uteblivet val ger ingen insamling. Statistikinställningar i sidfoten öppnar valet igen. Den nödvändiga preferenskakan `afl_stats_v1` innehåller yes/no och sparas i högst 180 dagar (Secure, SameSite=Lax, Path=/). Ingen annan egen webbläsarlagring används.

Vercels nuvarande klient innehåller lokal-lagringsfunktioner för attribution även om vi inte använder identifierings- eller gruppfunktionerna. Hela klienten hålls därför avstängd före samtycke. Återkallelse spärrar framtida anrop genom beforeSend-filtret. DNT/GPC har företräde och blockerar statistik även vid ett sparat ja.

Endast `affarsleads.se`, `www.affarsleads.se` och sidvägarna /, /index.html, /integritet.html tillåts. beforeSend godkänner enbart sidvisningar och tar bort query och fragment; inga formulärdata, egna händelser eller identifieringsanrop tillåts. Förhandsvisningar laddar inte statistiken. CSP använder en nonce och strict-dynamic så att Next.js och dess officiella statistikklient kan laddas utan unsafe-inline.

Analytics är aktiverat i det befintliga Vercel-projektet. Komponenten använder Vercels automatiska publika Next.js-konfiguration för skript- och mottagningsadresser. Ingen separat byggd SDK-kopia används. Connectorns statistik-API har svarat ”Web Analytics not found” även för Sportpuls där statistiken fungerar, så detta fel är inte bevis för utebliven aktivering. Mottagna sidvisningar måste bedömas i Analytics-panelen; bygg- och HTTP-kontroller visar inte i sig att ett verkligt besök har räknats. Ingen automatiserad webbläsare behöver öppnas för bygg-, API- och DOM-testerna.
