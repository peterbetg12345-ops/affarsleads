import {StatisticsButton} from './components/privacy-controls';
import SiteInteractions from './components/site-interactions';

export default function Page() {
return <>

  <a className="skip" href="#main">Hoppa till innehållet</a>
  <header className="header">
    <div className="wrap nav">
      <a className="brand" href="#" aria-label="Affärsleads startsida"><span className="brand-viewport"><img className="brand-logo" src="/assets/affarsleads-logo.png" alt="Affärsleads" width="2172" height="724" decoding="async" /></span></a>
      <button className="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation">Meny <span aria-hidden="true">☰</span></button>
      <nav id="navigation" aria-label="Huvudmeny">
        <a href="#tjansten">Tjänsten</a><a href="#upplagg">Kalkylator</a><a href="#paket">Paket</a><a href="#om-oss">Om oss</a><a className="button button-small" href="#kontakt">Prata med oss</a>
      </nav>
    </div>
  </header>
  <main id="main">
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">E-postprospektering för B2B</p>
          <h1>Vi startar samtalen.<br /><em>Ni gör affärerna.</em></h1>
          <p className="hero-intro">Det är trångt i flödena. Vi hjälper er att nå rätt beslutsfattare med relevanta mejl som de kan läsa när de har tid. Kontaktlistor, copy, utskick och uppföljning. Vi sköter hela arbetet.</p>
          <div className="hero-actions"><a className="button" href="#kontakt">Låt oss prata om er försäljning</a><a className="text-link" href="#upplagg">Bygg ert upplägg</a></div>
          <p className="hero-note">Ert budskap. Rätt mottagare. Utrymme att läsa och svara.</p>
        </div>
        <div className="hero-visual" aria-label="Illustration av ett prospekteringsflöde från rätt kontakt till ett relevant samtal">
          <div className="visual-top"><span className="mini-brand" aria-hidden="true"><img src="/assets/affarsleads-logo.png" alt="" width="2172" height="724" decoding="async" /></span><span>Från första kontakt till nästa steg</span></div>
          <div className="contact-example"><div className="avatar">AB</div><div><strong>Er nästa kund</strong><span>Rätt företag · Rätt beslutsfattare</span></div><span className="check" aria-hidden="true">✓</span></div>
          <div className="flow-stem"></div>
          <div className="mail-example"><div className="mail-label"><span className="mail-icon" aria-hidden="true">✉</span><span>Ett mejl med en anledning</span><span className="example-label">Exempel</span></div><p className="subject">En tanke om er försäljning</p><p>Hej Anna,</p><p>Jag såg att ni växer inom ert område. Hur arbetar ni med att hitta nya företagskunder idag?</p><div className="signature-lines"><span></span><span></span></div></div>
          <div className="follow-up"><span className="small-circle" aria-hidden="true">↻</span><span>Relevant uppföljning, i rätt tid.</span></div>
          <div className="reply-example"><span className="reply-icon" aria-hidden="true">✓</span><div><strong>Nu börjar samtalet.</strong><span>Ert team tar nästa steg.</span></div></div>
          <span className="illustration-note">Illustration av arbetssättet, inte ett kundresultat.</span>
        </div>
        <section className="hero-contact" id="kontakt" aria-labelledby="contact-title">
          <div className="contact-grid">
            <div className="contact-intro">
              <p className="eyebrow">Ta nästa steg</p>
              <h2 id="contact-title">Få ett förslag<br /><em>för ert företag.</em></h2>
              <p>Berätta vilka kunder ni vill nå. Vi återkommer med ett förslag på hur vi kan hjälpa er.</p>
              <div className="contact-person"><span className="person-avatar" aria-hidden="true">P</span><div><strong>Peter Berg</strong><span>Grundare · Affärsleads</span></div></div>
            </div>
            <form id="contact-form" data-enquiry-form="">
              <input type="hidden" name="package" defaultValue="" />
              <div className="form-trap" aria-hidden="true"><label htmlFor="website">Webbplats</label><input id="website" name="website" tabIndex="-1" autoComplete="off" /></div>
              <div className="contact-fields">
                <div className="contact-field"><label htmlFor="name">Ditt namn</label><input id="name" name="name" autoComplete="name" required={true} maxLength="120" placeholder="För- och efternamn" /></div>
                <div className="contact-field"><label htmlFor="company">Företag</label><input id="company" name="company" autoComplete="organization" required={true} maxLength="160" placeholder="Företagets namn" /></div>
                <div className="contact-field"><label htmlFor="email">Din e-postadress</label><input id="email" name="email" type="email" autoComplete="email" required={true} maxLength="254" placeholder="namn@foretag.se" /></div>
                <div className="contact-field contact-message"><label htmlFor="message">Vilka kunder vill ni nå?</label><textarea id="message" name="message" required={true} minLength="10" maxLength="3000" rows="2" placeholder="Berätta kort om ert erbjudande och vilka företag ni vill nå."></textarea></div>
                <div className="contact-submit"><button className="button" type="submit">Skicka förfrågan</button><p className="form-note">Vi använder uppgifterna för att besvara din förfrågan. <a href="/integritet.html">Läs om integritet och cookies</a>.</p></div>
              </div>
              <p id="form-status" data-form-status="" role="status" aria-live="polite" tabIndex="-1"></p>
              <p className="contact-alternative">Du kan också mejla <a href="mailto:peter@affarsleads.se">peter@affarsleads.se</a>.</p>
            </form>
          </div>
        </section>
      </div>
      <div className="wrap hero-bottom"><span>En sammanhängande process.</span><div><span>Målgrupp</span><span>Kontaktlista</span><span>Budskap</span><span>Uppföljning</span></div></div>
    </section>

    <section className="section why-email-section" id="varfor-epost" aria-labelledby="why-email-title">
      <div className="wrap fit-grid">
        <div>
          <p className="eyebrow">Dags att återupptäcka e-post</p>
          <h2 id="why-email-title">Allt går fort.<br /><em>Låt ert budskap få ta tid.</em></h2>
          <p className="section-intro">I sociala flöden, medier och tv tävlar budskapen om uppmärksamheten. Samtidigt har människorna ni vill nå fullt upp med att driva sina företag.</p>
          <p className="email-principle">Ett relevant mejl ger ert erbjudande utrymme att bli läst, förstått och besvarat när det passar mottagaren.</p>
        </div>
        <div className="email-reasons">
          <article><h3>Direkt till den ni vill nå</h3><p>Vi väljer företag och beslutsfattare utifrån ert erbjudande och skriver med en tydlig anledning till kontakten. Ni vet vilka ni försöker nå och varför.</p></article>
          <article><h3>Plats att läsa i lugn och ro</h3><p>Ett mejl kan sparas, läsas igen och delas med en kollega. Mottagaren kan ta del av erbjudandet och återkomma när det finns tid och intresse.</p></article>
          <article><h3>En fokuserad användning av budgeten</h3><p>Med en avgränsad målgrupp kan ni börja i liten skala, följa responsen och justera insatsen. Vi hjälper er att lägga arbetet på de kontakter som är relevanta för er affär.</p></article>
        </div>
      </div>
    </section>

    <section className="section intro-section" id="tjansten">
      <div className="wrap intro-grid"><p className="eyebrow">Er externa prospekteringspartner</p><div><h2>Ni behöver nästa kund.<br />Vi tar hand om vägen dit.</h2><p className="section-intro">Att få till bra säljsamtal kräver mer än en lista med e-postadresser. Målgruppen ska stämma, budskapet ska kännas relevant och uppföljningen ska fungera. Vi håller ihop arbetet.</p></div></div>
      <div className="wrap services">
        <article className="service"><div className="service-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><circle cx="13" cy="13" r="8" /><path d="m19 19 8 8M9 13h8m-4-4v8" /></svg></div><h3>Kontakterna</h3><p>Vi ringar in era idealkunder, hittar relevanta beslutsfattare och bygger kontaktlistor för just ert erbjudande.</p><span>Rätt person på rätt företag</span></article>
        <article className="service"><div className="service-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><rect x="5" y="7" width="22" height="18" rx="3" /><path d="m5 9 11 9L27 9" /></svg></div><h3>Orden</h3><p>Vi skriver ämnesrader, första mejl och uppföljningar som förklarar varför mottagaren ska bry sig.</p><span>Ett budskap värt att svara på</span></article>
        <article className="service"><div className="service-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M23 9a10 10 0 1 0 3 10M23 3v7h-7" /><path d="M16 10v7l4 3" /></svg></div><h3>Flödet</h3><p>Vi sätter upp utskick och uppföljning, följer responsen och justerar arbetet efter vad vi lär oss.</p><span>Från plan till genomförande</span></article>
      </div>
    </section>

    <section className="section guide-section calculator-section" id="upplagg" aria-labelledby="guide-title">
      <div className="wrap">
        <div className="calc-heading"><div><p className="eyebrow">Bygg ert upplägg</p><h2 id="guide-title">Rätt kontakter.<br /><em>Rätt upplägg.</em></h2><p>Välj vilka ni vill nå och justera omfattningen. Se ert upplägg ta form direkt.</p></div><div className="calc-heading-tools"><span className="calc-live"><span aria-hidden="true"></span>Uppdateras direkt</span><button id="calc-reset" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" /></svg>Återställ val</button></div></div>
        <p className="guide-fallback">Vi hjälper er hitta rätt omfattning. <a className="text-link" href="#kontakt">Prata med oss</a></p>
        <div className="guide-interactive" hidden={true}>
          <div className="calc-layout">
            <form id="guide-options" className="calc-controls">
              <div className="calc-card calc-volume">
                <div className="calc-card-heading"><div><p className="calc-kicker">Er räckvidd</p><h3>Hur många vill ni nå?</h3></div><span className="calc-icon calc-icon-large" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></svg></span></div>
                <div className="calc-volume-value"><output id="guide-volume-output" htmlFor="guide-volume">2 000</output><span>nya unika kontakter<br />per månad</span></div>
                <label className="calc-sr-only" htmlFor="guide-volume">Kontakter per månad</label><input className="calc-range" id="guide-volume" name="volume" type="range" min="2000" max="15000" step="1000" defaultValue="2000" />
                <div className="calc-presets" aria-label="Snabbval för kontaktvolym"><button type="button" data-volume="2000" aria-pressed="true">2 000</button><button type="button" data-volume="4000" aria-pressed="false">4 000</button><button type="button" data-volume="8000" aria-pressed="false">8 000</button><button type="button" data-volume="10000" aria-pressed="false">10 000</button><button type="button" data-volume="15000" aria-pressed="false">15 000</button></div>
                <label className="calc-volume-help"><input type="checkbox" name="helpVolume" defaultValue="yes" /><span>Hjälp mig välja kontaktvolym</span></label>
                <div className="calc-processing"><div><div className="calc-followup-heading"><label htmlFor="guide-followups">Antal uppföljningar</label><output id="guide-followup-output" htmlFor="guide-followups">2</output></div><input className="calc-range calc-range-small" id="guide-followups" name="followUps" type="range" min="0" max="4" step="1" defaultValue="2" /><div className="calc-range-ends" aria-hidden="true"><span>Inga</span><span>4 uppföljningar</span></div></div><details className="calc-explainer"><summary>Så räknar vi</summary><p>Nya unika kontakter × (första mejlet + valda uppföljningar). Uppföljningarna ingår i paketet och räknas inte som nya kontakter. Det visar ett maxscenario om alla får samtliga mejl i sekvensen. Vi stoppar uppföljning vid svar eller avregistrering. En sekvens kan löpa över ett månadsskifte.</p></details></div>
                <fieldset className="calc-agreement"><legend>Välj avtalsform</legend><div className="calc-agreement-options">
                  <label><input type="radio" name="agreement" defaultValue="monthly" defaultChecked={true} /><span><strong>Månadsvis</strong><small>Med uppstartsavgift</small></span></label>
                  <label><input type="radio" name="agreement" defaultValue="quarterly" /><span><strong>3 månader</strong><small>0 kr i uppstart</small></span></label>
                </div><p>Avtalsperioden börjar när utskicken startar.</p></fieldset>
              </div>
              <div className="calc-card calc-target">
                <fieldset><legend>Vilka vill ni nå?</legend><p className="calc-field-help">Välj den målgrupp som ligger närmast ert erbjudande.</p><div className="calc-audience-options">
                  <label className="calc-option"><input type="radio" name="audience" defaultValue="Företagsägare och VD" defaultChecked={true} /><span className="calc-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M9 7V4h6v3M4 12h16M10 12v3h4v-3" /></svg></span><span>Ägare &amp; VD</span></label>
                  <label className="calc-option"><input type="radio" name="audience" defaultValue="Ekonomichefer" /><span className="calc-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 20V10M12 20V4M19 20v-7M3 20h18" /></svg></span><span>Ekonomichefer</span></label>
                  <label className="calc-option"><input type="radio" name="audience" defaultValue="Inköpsansvariga" /><span className="calc-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 8h14l1 12H4L5 8ZM8 8V6a4 4 0 0 1 8 0v2" /></svg></span><span>Inköpsansvariga</span></label>
                  <label className="calc-option"><input type="radio" name="audience" defaultValue="Marknadschefer" /><span className="calc-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m4 10 14-5v14L4 14v-4ZM7 15l1 5h4l-2-5M21 9v6" /></svg></span><span>Marknadschefer</span></label>
                  <label className="calc-option"><input type="radio" name="audience" defaultValue="Annan målgrupp" /><span className="calc-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="3" /><path d="M3 20v-3a6 6 0 0 1 12 0v3M18 8v8M14 12h8" /></svg></span><span>Annan målgrupp</span></label>
                  <label className="calc-option"><input type="radio" name="audience" defaultValue="Hjälp mig välja målgrupp" /><span className="calc-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M9 9a3 3 0 1 1 5 2c-1 1-2 1-2 3M12 17h.01" /></svg></span><span>Hjälp mig välja</span></label>
                </div></fieldset>
                <div className="calc-extra" id="guide-other-audience" hidden={true}><label htmlFor="guide-audience-detail">Vilken målgrupp?</label><input id="guide-audience-detail" name="otherAudience" maxLength="120" placeholder="Till exempel HR-chefer" /></div>
                <div className="calc-target-bottom"><div><label htmlFor="guide-industry">Bransch <span>(frivilligt)</span></label><input id="guide-industry" name="industry" maxLength="120" placeholder="Till exempel IT eller bygg" /></div><fieldset className="calc-market"><legend>Marknad</legend><div className="calc-market-options"><label><input type="radio" name="market" defaultValue="Sverige" defaultChecked={true} /><span>Sverige</span></label><label><input type="radio" name="market" defaultValue="Norge" /><span>Norge</span></label><label><input type="radio" name="market" defaultValue="Hela Norden" /><span>Norden</span></label><label><input type="radio" name="market" defaultValue="Annan marknad" /><span>Annan</span></label></div></fieldset></div>
                <div className="calc-extra" id="guide-other-market" hidden={true}><label htmlFor="guide-market-detail">Vilken marknad?</label><input id="guide-market-detail" name="otherMarket" maxLength="120" placeholder="Till exempel Storbritannien" /></div>
              </div>
            </form>
            <aside className="calc-side" aria-label="Ert upplägg och kontaktuppgifter">
              <div className="calc-card calc-result" id="calc-result" data-package="Bas">
                <div className="calc-result-top"><p className="calc-kicker">Ert paketförslag</p><span className="calc-result-badge">Uppföljningar ingår</span></div>
                <h3 id="calc-package">Bas</h3>
                <div className="calc-pricing"><strong id="calc-price">11 990 kr / mån</strong><span id="calc-setup">3 000 kr i uppstart</span><p id="calc-first-month">Första kampanjmånaden: 14 990 kr inklusive uppstart.</p><small>Samtliga priser exklusive moms.</small></div>
                <div className="calc-metrics"><div><strong id="calc-contacts">2 000</strong><span>nya unika kontakter / mån</span></div><div><strong id="calc-messages">6 000</strong><span>mejl i sekvensen, max</span></div></div>
                <dl className="calc-selection"><div><dt>Målgrupp</dt><dd id="calc-audience">Företagsägare och VD</dd></div><div><dt>Marknad</dt><dd id="calc-market">Sverige</dd></div><div id="calc-industry-row" hidden={true}><dt>Bransch</dt><dd id="calc-industry"></dd></div><div><dt>Bearbetning</dt><dd id="calc-processing">Första mejlet + 2 uppföljningar</dd></div><div><dt>Avtal</dt><dd id="calc-agreement">Månadsvis med uppstart</dd></div></dl>
                <p className="calc-result-note" id="calc-capacity">Paketet omfattar upp till 2 000 nya unika kontakter per månad. Valda uppföljningar ingår.</p>
              </div>
              <form id="guide-contact-form" data-enquiry-form="" className="calc-card calc-lead"><h3>Gör upplägget till ert.</h3><p>Få ett personligt förslag från Peter. Era val följer med automatiskt.</p><input type="hidden" name="package" defaultValue="" /><input type="hidden" name="message" defaultValue="" /><div className="form-trap" aria-hidden="true"><label htmlFor="guide-website">Webbplats</label><input id="guide-website" name="website" tabIndex="-1" autoComplete="off" /></div><div className="calc-contact-names"><div><label htmlFor="guide-name">Ditt namn</label><input id="guide-name" name="name" autoComplete="name" required={true} maxLength="120" placeholder="För- och efternamn" /></div><div><label htmlFor="guide-company">Företag</label><input id="guide-company" name="company" autoComplete="organization" required={true} maxLength="160" placeholder="Företagsnamn" /></div></div><label htmlFor="guide-email">Din e-postadress</label><input id="guide-email" name="email" type="email" autoComplete="email" required={true} maxLength="254" placeholder="namn@foretag.se" /><details className="calc-notes"><summary>Lägg till ett meddelande <span>(frivilligt)</span></summary><label htmlFor="guide-notes" className="calc-sr-only">Mer om ert erbjudande</label><textarea id="guide-notes" name="notes" maxLength="1800" rows="3" placeholder="Berätta gärna mer om ert erbjudande."></textarea></details><button className="button" type="submit">Få ett förslag på mitt upplägg</button><p className="form-note">Vi använder uppgifterna för att besvara er förfrågan. <a href="/integritet.html">Läs om integritet och cookies</a>.</p><p id="guide-form-status" data-form-status="" role="status" aria-live="polite" tabIndex="-1"></p></form>
            </aside>
          </div>
          <span id="calc-announcement" className="calc-sr-only" aria-live="polite"></span>
        </div>
      </div>
    </section>

    <section className="section packages-section" id="paket" aria-labelledby="packages-title">
      <div className="wrap">
        <div className="packages-heading"><div><p className="eyebrow">Paket och priser</p><h2 id="packages-title">Rätt omfattning.<br /><em>För nästa steg i er affär.</em></h2></div><p className="section-intro">Vi sköter kontaktlistor, mejltexter, utskick och uppföljning. Välj hur många nya kontakter ni vill nå varje månad.</p></div>
        <div className="packages-grid">
          <article className="package-card" aria-labelledby="bas-title">
            <p className="package-kicker">En fokuserad start</p><h3 id="bas-title">Bas</h3><p className="package-description">För er som vill börja nå nya företagskunder med ett tydligt upplägg.</p>
            <div className="package-price"><strong>11 990</strong><span>kr / månad</span></div>
            <div className="package-volume"><strong>2 000</strong><span>nya unika kontakter / månad</span></div>
            <p className="package-setup"><strong>3 000 kr i uppstart</strong><span>Engångsavgift. Eller 0 kr med 3 månaders bindningstid.</span></p>
            <ul><li>Kontaktlistor för er målgrupp</li><li>Ämnesrader och mejltexter</li><li>Utskick och uppföljningar ingår</li><li>Hantering och överlämning av leads</li><li>Löpande avstämning</li></ul>
            <a className="button package-button" href="#kontakt" data-package="Bas">Prata med oss om Bas</a>
          </article>
          <article className="package-card package-featured" aria-labelledby="growth-title">
            <p className="package-kicker">Mer utrymme att växa</p><h3 id="growth-title">Tillväxt</h3><p className="package-description">För er som vill nå fler beslutsfattare och utveckla bearbetningen.</p>
            <div className="package-price"><strong>19 990</strong><span>kr / månad</span></div>
            <div className="package-volume"><strong>4 000</strong><span>nya unika kontakter / månad</span></div>
            <p className="package-setup"><strong>5 000 kr i uppstart</strong><span>Engångsavgift. Eller 0 kr med 3 månaders bindningstid.</span></p>
            <ul><li>Kontaktlistor för er målgrupp</li><li>Ämnesrader och mejltexter</li><li>Utskick och uppföljningar ingår</li><li>Hantering och överlämning av leads</li><li>Löpande avstämning</li></ul>
            <a className="button button-lime package-button" href="#kontakt" data-package="Tillväxt">Prata med oss om Tillväxt</a>
          </article>
          <article className="package-card" aria-labelledby="premium-title">
            <p className="package-kicker">En större satsning</p><h3 id="premium-title">Premium</h3><p className="package-description">För er som vill bearbeta en större marknad och skala upp arbetet.</p>
            <div className="package-price"><strong>29 990</strong><span>kr / månad</span></div>
            <div className="package-volume"><strong>8 000</strong><span>nya unika kontakter / månad</span></div>
            <p className="package-setup"><strong>7 500 kr i uppstart</strong><span>Engångsavgift. Eller 0 kr med 3 månaders bindningstid.</span></p>
            <ul><li>Kontaktlistor för er målgrupp</li><li>Ämnesrader och mejltexter</li><li>Utskick och uppföljningar ingår</li><li>Hantering och överlämning av leads</li><li>Löpande avstämning</li></ul>
            <a className="button package-button" href="#kontakt" data-package="Premium">Prata med oss om Premium</a>
          </article>
        </div>
        <article className="package-enterprise" aria-labelledby="custom-title"><div><p className="package-kicker">Ett upplägg för er</p><h3 id="custom-title">10 000+ kontakter per månad?</h3><p>Vi planerar volym, målgrupper och pris tillsammans. Uppföljningar ingår. Uppstartsavgift enligt offert, eller 0 kr med tre månaders bindningstid.</p></div><a className="button" href="#kontakt" data-package="" data-package-name="ett anpassat upplägg för 10 000+ nya unika kontakter per månad">Kontakta oss</a></article>
        <article className="package-enterprise package-niche" aria-labelledby="niche-title">
          <div><p className="package-kicker">För särskilda målgrupper</p><h3 id="niche-title">Har ni en särskilt nischad målgrupp?</h3><p>Vissa målgrupper är mindre och kräver mer arbete för att hitta rätt företag och rätt person att kontakta. Det hjälper vi också till med. Vi pratar igenom vilka ni vill nå och hur mycket bearbetning som behövs, och tar fram en separat offert för just ert upplägg.</p></div>
          <a className="button" href="#kontakt" data-package="" data-package-name="ett skräddarsytt upplägg för en särskilt nischad målgrupp, med separat offert">Prata om er målgrupp</a>
        </article>
        <div className="package-terms" aria-labelledby="terms-title"><h3 id="terms-title">Välj det som passar er.</h3><div className="package-term-grid">
          <div><h4>Månadsvis med uppstart</h4><p>Betala uppstartsavgiften och fortsätt månadsvis. Ingen bindningstid utöver påbörjad avtalsmånad.</p></div>
          <div><h4>3 månader utan uppstartsavgift</h4><p>Välj tre månaders bindningstid så bjuder vi på uppstartsavgiften. Därefter fortsätter avtalet månadsvis.</p></div>
        </div><p className="package-start">Uppstarten täcker förberedelserna. Månadsavgiften och eventuell tremånadersperiod börjar när utskicken startar. Säg upp avtalet före nästa avtalsmånad.</p></div>
        <p className="package-note">Samtliga priser är exklusive moms. Kontaktvolymen avser nya unika kontakter per kampanjmånad. Uppföljningar ingår i det överenskomna upplägget och räknas inte som nya kontakter. Utskicken trappas upp efter uppvärmning och målgruppens förutsättningar. Vi stämmer av leveransplanen före start.</p>
      </div>
    </section>

    <section className="section process-section" id="sa-fungerar-det"><div className="wrap process-grid"><div className="process-heading"><p className="eyebrow light">Så arbetar vi</p><h2>En tydlig plan.<br />Ett löpande arbete.</h2><p>Vi lär känna er affär innan vi tar kontakt med någon annan.</p><a className="button button-lime" href="#kontakt">Berätta om ert företag</a></div><div className="steps">
      <article className="step"><span className="step-number">1</span><div><h3>Vi hittar fokus</h3><p>Tillsammans går vi igenom ert erbjudande, vilka kunder ni vill nå och vad ett bra nästa steg innebär.</p></div></article>
      <article className="step"><span className="step-number">2</span><div><h3>Vi bygger kampanjen</h3><p>Vi tar fram kontaktlistan, skriver budskapen och sätter upp flödet. Ni får granska upplägget innan starten.</p></div></article>
      <article className="step"><span className="step-number">3</span><div><h3>Vi sköter utskicken</h3><p>Vi genomför prospekteringen och följer upp. Hanteringen av svar och överlämningen till er bestämmer vi tillsammans.</p></div></article>
      <article className="step"><span className="step-number">4</span><div><h3>Vi lär oss och förbättrar</h3><p>Vi ser över svaren, justerar målgrupp och copy och stämmer av vad arbetet faktiskt leder till.</p></div></article>
    </div></div></section>



    <section className="section fit-section"><div className="wrap fit-grid"><div><p className="eyebrow">För företag som säljer till företag</p><h2>En bra affär börjar<br />med rätt matchning.</h2><p className="section-intro">Har ni ett tydligt erbjudande och kapacitet att ta hand om nya affärsdialoger? Då kan riktad e-postprospektering vara nästa steg.</p></div><div className="fit-list"><div><span aria-hidden="true">✓</span><p>Ni vill nå nya företag och beslutsfattare.</p></div><div><span aria-hidden="true">✓</span><p>Ni vill lämna över research, copy och utskick.</p></div><div><span aria-hidden="true">✓</span><p>Ni har någon som kan ta samtalet vidare.</p></div><div><span aria-hidden="true">✓</span><p>Ni vill arbeta löpande med att förbättra prospekteringen.</p></div></div></div></section>

    <section className="section about-section" id="om-oss" aria-labelledby="founder-title"><div className="wrap about-grid"><figure className="founder-portrait"><img src="/assets/peter-profile.png" alt="Peter Berg, grundare av Affärsleads" width="1254" height="1254" loading="lazy" /><figcaption><strong>Peter Berg</strong><span>Grundare, Affärsleads</span></figcaption></figure><div><p className="eyebrow">Erfarenhet bakom varje utskick</p><h2 id="founder-title">Hej, jag heter Peter Berg.<br /><em>Grundare av Affärsleads.</em></h2><p className="section-intro">Jag har många års erfarenhet av e-postmarknadsföring och har tidigare arbetat som <strong>Head Lead Gen Expert</strong> på en av Storbritanniens största mötesbokningssajter.</p><p>Nu testar jag vingarna här med Affärsleads och tar med mig den erfarenheten för att hjälpa svenska B2B-företag att nå rätt människor och starta nya affärssamtal.</p><p className="operator-line">Drivs av <strong>SMEDJAN KREATIV MEDIA</strong></p><a className="text-link" href="#kontakt">Prata med oss om ert upplägg</a></div></div></section>

    <section className="section faq-section" id="fragor"><div className="wrap faq-grid"><div><p className="eyebrow">Bra att veta</p><h2>Frågor före<br />första samtalet.</h2></div><div className="faqs">
      <details><summary>Vad ingår i tjänsten?</summary><div>Vi hjälper till med målgrupp, kontaktlistor, ämnesrader, mejlcopy, utskick och uppföljning. Exakt omfattning och ansvar för svar bestämmer vi i ert upplägg.</div></details>
      <details><summary>Behöver vi ha en egen kontaktlista?</summary><div>Nej. Vi kan bygga en lista utifrån målgruppen vi kommer överens om. Har ni redan ett underlag går vi igenom hur det kan användas.</div></details>
      <details><summary>Varför e-post för B2B?</summary><div>E-post gör det möjligt att rikta ett relevant erbjudande till en utvald person och låta mottagaren läsa och svara när det passar. Utfallet beror på målgruppen, budskapet och hur väl erbjudandet möter ett behov. Vi arbetar med hela den kedjan.</div></details>
      <details><summary>Vad skiljer Bas, Tillväxt och Premium?</summary><div>Bas omfattar 2 000 nya unika kontakter per månad, Tillväxt 4 000 och Premium 8 000. För 10 000 eller fler tar vi fram ett anpassat upplägg. Kontaktlistor, mejltexter, utskick och uppföljningar ingår i alla paket. En uppföljning till samma person räknas inte som en ny kontakt.</div></details>
      <details><summary>Passar tjänsten en liten eller nischad målgrupp?</summary><div>Ja. Om målgruppen kräver mer research och bearbetning för att hitta rätt kontakter tar vi fram en separat offert. Vi går igenom vilka ni vill nå och vilket arbete som behövs. Ni behöver inte välja ett volympaket som är större än er målgrupp.</div></details>
      <details><summary>Vad kostar det?</summary><div>Bas kostar 11 990 kr per månad, Tillväxt 19 990 kr och Premium 29 990 kr. Uppstarten kostar 3 000 kr, 5 000 kr respektive 7 500 kr som engångsavgift. Välj tre månaders bindningstid så ingår uppstarten utan avgift. Alla priser är exklusive moms. Större upplägg offereras.</div></details>
      <details><summary>Har ni bindningstid?</summary><div>Med uppstartsavgift löper avtalet månadsvis, utan bindningstid utöver påbörjad avtalsmånad. Om ni väljer att slippa uppstartsavgiften är bindningstiden tre månader, därefter månadsvis. Säg upp före nästa avtalsmånad. Månadsavgiften och eventuell tremånadersperiod börjar när utskicken startar.</div></details>
      <details><summary>Kan ni garantera möten eller försäljning?</summary><div>Nej. Resultatet påverkas bland annat av erbjudandet, målgruppen och hur ni tar hand om dialogerna. Vi kommer överens om vad vi ska följa upp och utvecklar arbetet utifrån responsen.</div></details>
      <details><summary>Vad händer när någon svarar?</summary><div>Vi bestämmer en tydlig rutin för svar och överlämning innan kampanjen startar. Intresserade kontakter behöver kunna tas vidare av rätt person hos er.</div></details>
      <details><summary>Kan vi granska mejlen innan de skickas?</summary><div>Ja. Ni får granska målgrupp, budskap och upplägg innan vi startar. Vi stämmer även av hur förändringar under samarbetet ska hanteras.</div></details>
    </div></div></section>


  </main>
  
  <footer><div className="wrap footer-inner"><a className="brand" href="#"><span className="brand-viewport"><img className="brand-logo" src="/assets/affarsleads-logo.png" alt="Affärsleads" width="2172" height="724" decoding="async" /></span></a><p>Drivs av <strong>SMEDJAN KREATIV MEDIA</strong></p><div className="footer-meta"><StatisticsButton /><a href="/integritet.html">Integritet och cookies</a><span>© <span id="year">2026</span> Affärsleads</span></div></div></footer>

<SiteInteractions calculator={true} />
</>;
}
