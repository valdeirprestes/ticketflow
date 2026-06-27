// proxy.ts (na raiz do projeto ou dentro de /src)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkloginMiddleware } from './app/middleware/checkloginMiddleware';

// 1. A função AGORA PRECISA se chamar "proxy" (Convenção Next.js 16)
export function proxy(request: NextRequest) {
  console.log("Entrou aqui no Proxy com sucesso!");
  
  const { pathname } = request.nextUrl;

  // 2. Corrigindo o match de texto: o pathname analisa strings reais.
  // Como o seu matcher é '/about/:path*', checamos se começa com '/about'
  if (pathname.startsWith('/')) {
    return checkloginMiddleware(request);
  }

  return NextResponse.next();
}

// 3. O objeto de configuração para determinar quais rotas o proxy intercepta
export const config = {
  matcher: '/',
};