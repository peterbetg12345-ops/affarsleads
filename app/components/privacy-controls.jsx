'use client';
import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Analytics} from '@vercel/analytics/next';
import {filterPageview, isPublicPage, privacyBlocked, readChoice, rememberChoice} from './privacy-model.mjs';

const PrivacyContext = createContext(null);
export function StatisticsButton() {
  const state = useContext(PrivacyContext);
  return <button className="analytics-settings" type="button" aria-controls="analytics-consent" aria-expanded={state?.open ?? false} hidden={!state?.ready} onClick={state?.show}>Statistikinställningar</button>;
}
export default function PrivacyControls({children}) {
  const [choice, setChoice] = useState(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const permitted = useRef(false);
  const restoreFocus = useRef(false);
  const denyButton = useRef(null);
  useEffect(() => {
    const stored = readChoice(document);
    const browserBlocked = privacyBlocked(navigator);
    const publicPage = isPublicPage(window.location);
    setChoice(stored); setBlocked(browserBlocked); setEligible(publicPage);
    setOpen(!stored && publicPage); setReady(true);
    permitted.current = stored === 'yes' && publicPage && !browserBlocked;
    return () => {permitted.current = false;};
  }, []);
  const show = useCallback(() => {restoreFocus.current = true; setOpen(true);}, []);
  useEffect(() => {if (open && restoreFocus.current) denyButton.current?.focus();}, [open]);
  const decide = value => {
    permitted.current = value === 'yes' && eligible && !blocked;
    setChoice(rememberChoice(document, value)); setOpen(false);
    if (restoreFocus.current) {
      document.querySelector('.analytics-settings')?.focus();
      restoreFocus.current = false;
    }
  };
  const beforeSend = useCallback(event => filterPageview(event, permitted.current), []);
  return <PrivacyContext.Provider value={{ready, open, show}}>
    {children}
    {ready && eligible && choice === 'yes' && !blocked && <Analytics beforeSend={beforeSend} />}
    <section id="analytics-consent" className="analytics-consent" aria-labelledby="analytics-consent-title" hidden={!open}>
      <div className="analytics-consent-copy"><h2 id="analytics-consent-title">Får vi mäta besöken?</h2><p>Vi använder Vercel Web Analytics för besöksstatistik om sidor, trafikkällor och enheter. Statistikskriptet laddas bara om du godkänner. <a href="/integritet.html#statistik">Läs mer om statistiken</a>.</p><p hidden={!blocked}>Din webbläsare signalerar att spårning ska undvikas. Vi respekterar det även om du godkänner här.</p></div>
      <div className="analytics-consent-actions"><button ref={denyButton} type="button" onClick={() => decide('no')}>Neka statistik</button><button type="button" onClick={() => decide('yes')}>Godkänn statistik</button><a href="/integritet.html#cookies">Du kan ändra ditt val i sidfoten.</a></div>
    </section>
  </PrivacyContext.Provider>;
}
