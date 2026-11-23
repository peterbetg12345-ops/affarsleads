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

- Aktivera och testa mottagaradressen `peter@affarsleads.se`. Den var endast ett adressförslag i den dokumenterade planen när sidan skapades.
- Fastställ och lägg till firmans juridiska namn, organisationsnummer, kontaktuppgifter och relevant integritetsinformation.
- Bekräfta texter, erbjudande och att Peter ska vara kontaktperson.
- GitHub-repot är kopplat till Vercel-projektet `affarsleads` i teamet `edge-market-wire`; ändringar på main publiceras automatiskt.
- Välj hosting för den kommersiella webbplatsen. Vercel Hobby är avsett för personligt, icke-kommersiellt bruk. Kontrollera Pro-villkor eller använd befintlig one.com-hosting.
- Koppla `affarsleads.se` och vid behov `www.affarsleads.se` enligt hostingens aktuella DNS-instruktioner. Behåll befintliga MX-, SPF-, DKIM- och DMARC-poster för Zapmail.
- `robots.txt` blockerar indexering under arbetet. Tillåt indexering och lägg till kanonisk URL och sitemap vid lansering.

## Lokal kontroll

Öppna med en valfri statisk webbserver. JavaScript-syntax kan kontrolleras med `node --check script.js`. Sidan använder semantiska sektioner, tangentbordsnavigering, responsiv meny, inbyggd formulärvalidering och reducerad rörelse enligt besökarens inställning.
