import {headers} from 'next/headers';
import PrivacyControls from './components/privacy-controls';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://affarsleads.se'),
  title: 'Affärsleads — Vi startar samtalen. Ni gör affärerna.',
  description: 'Nå rätt beslutsfattare med ett relevant mejl som kan läsas när tiden finns. Affärsleads sköter kontaktlistor, copy, utskick och uppföljning för B2B.',
  alternates: {canonical: '/'},
  icons: {icon: '/favicon.svg'},
  openGraph: {
    title: 'Affärsleads — Vi startar samtalen. Ni gör affärerna.',
    description: 'Ert budskap till rätt person, med utrymme att läsa och svara när det passar. Vi sköter hela er e-postprospektering.',
    type: 'website', url: 'https://affarsleads.se/', locale: 'sv_SE'
  }
};
export const viewport = {themeColor: '#294b3d'};
export default async function RootLayout({children}) {
  // Request-time rendering allows Next.js to nonce all framework scripts.
  await headers();
  return <html lang="sv"><body><PrivacyControls>{children}</PrivacyControls></body></html>;
}
