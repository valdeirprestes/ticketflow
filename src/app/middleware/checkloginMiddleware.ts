// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function checkloginMiddleware(request: NextRequest) {
  // 1. Busca o token de autenticação nos cookies
  const token = request.cookies.get('auth_token')?.value

  // 2. Define as rotas que são estritamente públicas (ex: login e cadastro)
  const isPublicRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/cadastro'

  // Caso 1: O usuário NÃO está logado e tenta acessar uma rota protegida
  if (!token && !isPublicRoute) {
    // Redireciona para a página de login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Caso 2: O usuário JÁ está logado e tenta acessar a página de login
  if (token && isPublicRoute) {
    // Redireciona para a dashboard ou home
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Se estiver tudo certo, a navegação segue normalmente
  return NextResponse.next()
}

// 3. Configura em quais rotas o middleware deve rodar
export const config = {
  matcher: [
    /*
     * Aplica o middleware a todas as rotas, exceto:
     * - api (rotas de API internas)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, imagens, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}