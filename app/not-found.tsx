'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { colors, spacing, rounded } from '@/styles/design-tokens';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.canvas,
        padding: spacing.md,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '42rem' }}>
        <div style={{ marginBottom: spacing.lg }}>
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: colors['product-vault'],
              marginBottom: spacing.md,
              lineHeight: 1,
            }}
          >
            404
          </h1>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: colors.ink,
              marginBottom: spacing.md,
            }}
          >
            Página não encontrada
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: colors['ink-muted'],
              marginBottom: spacing.lg,
            }}
          >
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, justifyContent: 'center' }}>
          <style>{`
            @media (min-width: 640px) {
              .button-container {
                flex-direction: row !important;
              }
            }
          `}</style>
          <div className="button-container" style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.md} ${spacing.md}`,
                backgroundColor: colors['product-vault'],
                color: colors.canvas,
                fontWeight: 'bold',
                borderRadius: rounded.md,
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6b81f')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors['product-vault'])}
            >
              <Home className="w-5 h-5" />
              Ir para Home
            </Link>
            <button
              onClick={() => window.history.back()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.md} ${spacing.md}`,
                border: `2px solid ${colors['product-terraform']}`,
                color: colors['product-terraform'],
                backgroundColor: 'transparent',
                fontWeight: 'bold',
                borderRadius: rounded.md,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${colors['product-terraform']}20`)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: spacing.xxl,
            padding: spacing.md,
            backgroundColor: colors['surface-1'],
            borderRadius: rounded.md,
            border: `1px solid ${colors['hairline-soft']}`,
          }}
        >
          <p style={{ color: colors['ink-muted'] }}>
            Se acredita que isto é um erro, entre em contato conosco através das{' '}
            <a
              href="#"
              style={{
                color: colors['product-terraform'],
                fontWeight: 'bold',
                textDecoration: 'none',
                borderBottom: `1px solid ${colors['product-terraform']}`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              redes sociais
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
