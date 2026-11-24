# Affärsleads

Svensk webbplats för Affärsleads: kontaktlistor, copy, e-postutskick och uppföljning för B2B-företag.

## Teknik

HTML, CSS och JavaScript utan byggsteg eller externa frontendberoenden. Nodemailer är versionslåst för serverns SMTP-utskick. En Vercel Node-funktion i `api/contact.mjs` tar emot kontaktförfrågningar. `vercel.json` anger publicering och säkerhetshuvuden. Webbplatsen publiceras på Vercel från GitHub.

## Logotyp

Den godkända logotypen med ett handslag av två pratbubblor finns i `assets/affarsleads-logo.png`. Originalbilden har transparent bakgrund och används oförändrad i sidhuvud, sidfot och illustrationen. CSS visar logotypen genom ett anpassat utsnitt så att bildens transparenta marginaler inte tar plats i layouten.

## Erbjudande och avsändare

Bas: 10 e-postkonton och cirka 3 000 unika bearbetade kontakter per månad. Tillväxt: 30 konton och cirka 9 000 kontakter. Premium: anpassat upplägg. Volymerna är indikativa och påverkas av uppvärmning, utskickstakt, uppföljningar och målgrupp. Inga priser är fastställda på sidan.

Peter Berg presenteras som grundare med det senast uppladdade porträttet i `assets/peter-profile.png` och den mindre visningsstorleken. Erfarenhetsbeskrivningen bygger på Peters uppgifter: tidigare Head Lead Gen Expert på en av Storbritanniens största mötesbokningssajter. Verksamheten drivs av SMEDJAN KREATIV MEDIA.

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

JavaScript-syntax kontrolleras med `node --check script.js`. Kör backendtesterna med `node --test tests/*.test.mjs`. De täcker validering, avvisad origin, saknad konfiguration, fel hos mottagaren, utebliven lagringskvittens, lyckad lagring och försöksgränsen. En statisk server visar layouten; `/api/contact` kräver en Vercel Functions-miljö.

## Uppläggskalkylator

`guide.js` driver en kalkylator där alla val är synliga samtidigt: målgrupp, frivillig bransch, marknad, kontaktvolym och antal uppföljningar. Paketförslag och maxscenario för planerade mejl uppdateras direkt. Volymreglaget har snabbval och inställningarna kan återställas. Kontaktformuläret finns intill sammanställningen, utan separata steg eller låst resultat.

`guide-model.mjs` mappar upp till 3 000 kontakter till Bas, upp till 9 000 till Tillväxt och högre volym till Premium. Okänd omfattning ger ett gemensamt startförslag. `estimateWorkload` beräknar kontaktvolym × (ett första mejl + 0–4 uppföljningar). Detta är ett maxscenario om alla kontakter får alla planerade mejl, ingen leverans- eller resultatprognos. Paketförslaget baseras på kontaktvolym; faktisk kapacitet och pris fastställs i offert. Inga priser eller garanterade affärsresultat beräknas.

Kalkylatorns kontaktformulär och snabbformuläret använder samma validerade `/api/contact`, med separat felstatus och idempotens-ID. Alla val, inklusive uppföljningar och maxscenario, sammanställs i meddelandet och följer med till Supabase och mejlnotisen. Inga val skickas före förfrågan.

Kör `node --test tests/guide-model.test.mjs` för paketgränser, maxscenario och meddelandets innehåll.

## Integritet och cookies

`integritet.html` beskriver webbplatsbesök och inkommande förfrågningar; den omfattar inte kontaktlistor i kunduppdrag. Länkar finns vid båda formulären och i sidfoten. Inga analys- eller annonsskript, cookies eller webbläsarlagring har lagts till. Samtycke till integritetspolicyn är inte ett obligatoriskt formulärfält; hanteringen av inkommande B2B-frågor grundas på berättigat intresse.

Lagringen beskrivs genom kriterier (pågående handläggning och relevant affärsdialog), inte en automatisk tidsgräns. Peter behöver göra manuell gallringsbedömning när dialogen avslutas och följa upp kvarvarande förfrågningar. Gallringen ska omfatta Supabase-förfrågan och dess notifieringskö samt kopior i avsändarens och mottagarens e-post, inklusive relevanta papperskorgar. Inga befintliga uppgifter raderas av den här webbändringen. Respektera eventuella skyldigheter att bevara särskilda underlag och dokumentera skälet. Vid begäran om rättigheter: verifiera avsändarens identitet i proportion till risken, sök i både databas och e-post och hantera begäran enligt GDPR:s tidsfrister.

Uppdatera informationen när leverantörer, ansvar, ändamål eller lagringsrutiner ändras. Om statistik- eller marknadsföringsteknik införs ska dess faktiska samtyckesbehov bedömas innan aktivering; en banner i sig blockerar inga skript. Leverantörernas publicerade överföringsskydd är länkade på sidan; sidan gör inget påstående om att alla kunduppdrag eller alla avtal därmed har granskats.
