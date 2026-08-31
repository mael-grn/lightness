// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['fr', 'en'];
const defaultLocale = 'fr';

function getLocale(request: NextRequest): string {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

    try {
        return match(languages, locales, defaultLocale);
    } catch {
        return defaultLocale;
    }
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Vérifie si le pathname contient déjà une langue supportée
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return NextResponse.next();

    // Détection de la langue du navigateur et redirection
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);

    return NextResponse.redirect(newUrl);
}

export const config = {
    // Ignore les routes API, les assets statiques et les fichiers système
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};