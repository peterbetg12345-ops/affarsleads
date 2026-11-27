import {NextResponse} from 'next/server';
export function proxy(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const dev = process.env.NODE_ENV !== 'production';
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob:", "font-src 'self'",
    `connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com${dev ? ' ws: wss:' : ''}`,
    "base-uri 'self'", "object-src 'none'", "frame-ancestors 'none'", "form-action 'none'"
  ].join('; ');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  const response = NextResponse.next({request: {headers: requestHeaders}});
  response.headers.set('Content-Security-Policy', csp);
  return response;
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.svg|robots.txt|sitemap.xml|1e279276fd498bfa|_vercel).*)']
};
