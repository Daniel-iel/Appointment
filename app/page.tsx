'use client';

import Link from 'next/link';
import { Clock, BarChart3, Lock, Smartphone, Zap, Shield } from 'lucide-react';
import { colors, spacing, rounded, typography } from '@/styles/design-tokens';

export default function LandingPage() {
  return (
    <main style={{ backgroundColor: colors.canvas, minHeight: '100vh' }}>
      {/* Navigation */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          backgroundColor: colors['surface-1'],
          borderBottom: `1px solid ${colors['hairline-soft']}`,
          zIndex: 50,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: colors['product-vault'],
              }}
            >
              ExtraTime
            </span>
          </div>
          <Link
            href="/dashboard/"
            className="transition-all"
            style={{
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingTop: '8px',
              paddingBottom: '8px',
              backgroundColor: colors['product-terraform'],
              color: colors.ink,
              borderRadius: rounded.md,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Acessar App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          paddingTop: '128px',
          paddingBottom: '80px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: colors.ink,
              marginBottom: '24px',
              lineHeight: 1.18,
              letterSpacing: '-1.6px',
            }}
            className="md:text-6xl leading-tight"
          >
            Controle Suas{' '}
            <span style={{ color: colors['product-vault'] }}>Horas Extras</span>{' '}
            com Facilidade
          </h1>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: colors['ink-muted'],
              marginBottom: '32px',
              maxWidth: '48rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.69,
            }}
          >
            ExtraTime é o aplicativo gratuito para <strong>controle de jornada</strong> e{' '}
            <strong>gestão de expediente</strong>. Rastreie suas horas de trabalho, calcule{' '}
            <strong>overtime</strong>, analise compensações e folgas em um só lugar.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              justifyContent: 'center',
            }}
            className="sm:flex-row"
          >
            <Link
              href="/dashboard/"
              style={{
                paddingLeft: '32px',
                paddingRight: '32px',
                paddingTop: '16px',
                paddingBottom: '16px',
                backgroundColor: colors['product-vault'],
                color: colors.canvas,
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: rounded.md,
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Começar Grátis
            </Link>
            <button
              style={{
                paddingLeft: '32px',
                paddingRight: '32px',
                paddingTop: '16px',
                paddingBottom: '16px',
                border: `2px solid ${colors['product-terraform']}`,
                color: colors['product-terraform'],
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: rounded.md,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors['surface-1'];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Saber Mais
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          paddingTop: '80px',
          paddingBottom: '80px',
          paddingLeft: '16px',
          paddingRight: '16px',
          backgroundColor: colors.canvas,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 600,
              textAlign: 'center',
              marginBottom: '16px',
              color: colors.ink,
              lineHeight: 1.19,
              letterSpacing: '-1.0px',
            }}
          >
            Por Que Usar ExtraTime?
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: colors['ink-muted'],
              marginBottom: '64px',
              maxWidth: '32rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            Tudo que você precisa para gerenciar seu <strong>controle de horas extras</strong> de forma prática e segura.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Feature 1 - Terraform Purple */}
            <div
              style={{
                padding: '32px',
                borderRadius: rounded.lg,
                backgroundColor: colors['surface-1'],
                border: `1px solid ${colors['hairline-soft']}`,
              }}
            >
              <div
                style={{
                  marginBottom: '16px',
                  display: 'inline-block',
                  padding: '12px',
                  backgroundColor: colors['product-terraform'],
                  borderRadius: rounded.md,
                }}
              >
                <Clock className="w-6 h-6" style={{ color: colors.ink }} />
              </div>
              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: colors.ink,
                  lineHeight: 1.18,
                  letterSpacing: '-0.4px',
                }}
              >
                Rastreamento em Tempo Real
              </h3>
              <p
                style={{
                  color: colors['ink-muted'],
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Registre suas chegadas e saídas instantaneamente. Acompanhe seu{' '}
                <strong>controle de jornada</strong> com precisão.
              </p>
            </div>

            {/* Feature 2 - Nomad Green */}
            <div
              style={{
                padding: '32px',
                borderRadius: rounded.lg,
                backgroundColor: colors['surface-1'],
                border: `1px solid ${colors['hairline-soft']}`,
              }}
            >
              <div
                style={{
                  marginBottom: '16px',
                  display: 'inline-block',
                  padding: '12px',
                  backgroundColor: colors['product-nomad'],
                  borderRadius: rounded.md,
                }}
              >
                <BarChart3 className="w-6 h-6" style={{ color: colors.ink }} />
              </div>
              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: colors.ink,
                  lineHeight: 1.18,
                  letterSpacing: '-0.4px',
                }}
              >
                Análise de Overtime
              </h3>
              <p
                style={{
                  color: colors['ink-muted'],
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Calcule suas <strong>horas extras</strong> automaticamente. Visualize relatórios detalhados de{' '}
                <strong>expediente</strong> e compensações.
              </p>
            </div>

            {/* Feature 3 - Boundary Red */}
            <div
              style={{
                padding: '32px',
                borderRadius: rounded.lg,
                backgroundColor: colors['surface-1'],
                border: `1px solid ${colors['hairline-soft']}`,
              }}
            >
              <div
                style={{
                  marginBottom: '16px',
                  display: 'inline-block',
                  padding: '12px',
                  backgroundColor: colors['product-boundary'],
                  borderRadius: rounded.md,
                }}
              >
                <Lock className="w-6 h-6" style={{ color: colors.ink }} />
              </div>
              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: colors.ink,
                  lineHeight: 1.18,
                  letterSpacing: '-0.4px',
                }}
              >
                Seus Dados, Sua Privacidade
              </h3>
              <p
                style={{
                  color: colors['ink-muted'],
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Todos os dados ficam armazenados no seu navegador. Nenhuma informação é enviada para servidores.
              </p>
            </div>

            {/* Feature 4 - Waypoint Cyan */}
            <div
              style={{
                padding: '32px',
                borderRadius: rounded.lg,
                backgroundColor: colors['surface-1'],
                border: `1px solid ${colors['hairline-soft']}`,
              }}
            >
              <div
                style={{
                  marginBottom: '16px',
                  display: 'inline-block',
                  padding: '12px',
                  backgroundColor: colors['product-waypoint'],
                  borderRadius: rounded.md,
                }}
              >
                <Smartphone className="w-6 h-6" style={{ color: colors.ink }} />
              </div>
              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: colors.ink,
                  lineHeight: 1.18,
                  letterSpacing: '-0.4px',
                }}
              >
                Acesso de Qualquer Lugar
              </h3>
              <p
                style={{
                  color: colors['ink-muted'],
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Funciona em desktop, tablet e celular. Sincronize seu <strong>controle de horas</strong> entre dispositivos.
              </p>
            </div>

            {/* Feature 5 - Vault Yellow */}
            <div
              style={{
                padding: '32px',
                borderRadius: rounded.lg,
                backgroundColor: colors['surface-1'],
                border: `1px solid ${colors['hairline-soft']}`,
              }}
            >
              <div
                style={{
                  marginBottom: '16px',
                  display: 'inline-block',
                  padding: '12px',
                  backgroundColor: colors['product-vault'],
                  borderRadius: rounded.md,
                }}
              >
                <Zap className="w-6 h-6" style={{ color: colors.canvas }} />
              </div>
              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: colors.ink,
                  lineHeight: 1.18,
                  letterSpacing: '-0.4px',
                }}
              >
                Rápido e Leve
              </h3>
              <p
                style={{
                  color: colors['ink-muted'],
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Interface intuitiva e responsiva. Gerencie seu <strong>overtime</strong> sem complicações.
              </p>
            </div>

            {/* Feature 6 - Consul Red */}
            <div
              style={{
                padding: '32px',
                borderRadius: rounded.lg,
                backgroundColor: colors['surface-1'],
                border: `1px solid ${colors['hairline-soft']}`,
              }}
            >
              <div
                style={{
                  marginBottom: '16px',
                  display: 'inline-block',
                  padding: '12px',
                  backgroundColor: colors['product-consul'],
                  borderRadius: rounded.md,
                }}
              >
                <Shield className="w-6 h-6" style={{ color: colors.ink }} />
              </div>
              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: colors.ink,
                  lineHeight: 1.18,
                  letterSpacing: '-0.4px',
                }}
              >
                Gráficos e Estatísticas
              </h3>
              <p
                style={{
                  color: colors['ink-muted'],
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Visualize tendências de <strong>jornada</strong> e <strong>folgas</strong> com gráficos inteligentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section
        style={{
          paddingTop: '80px',
          paddingBottom: '80px',
          paddingLeft: '16px',
          paddingRight: '16px',
          backgroundColor: colors.canvas,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 600,
              marginBottom: '48px',
              textAlign: 'center',
              color: colors.ink,
              lineHeight: 1.19,
              letterSpacing: '-1.0px',
            }}
          >
            Para Quem é ExtraTime?
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <div
              style={{
                padding: '24px',
                backgroundColor: colors['surface-1'],
                borderRadius: rounded.lg,
                borderLeft: `4px solid ${colors['product-terraform']}`,
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: colors.ink,
                  marginBottom: '8px',
                  lineHeight: 1.35,
                }}
              >
                Profissionais que Trabalham com Jornada Flexível
              </h3>
              <p
                style={{
                  color: colors['ink-muted'],
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Controle suas horas com precisão e garanta o direito a compensações por{' '}
                <strong>horas extras</strong>.
              </p>
            </div>

            <div
              style={{
                padding: '24px',
                backgroundColor: colors['surface-1'],
                borderRadius: rounded.lg,
                borderLeft: `4px solid ${colors['product-nomad']}`,
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: colors.ink,
                  marginBottom: '8px',
                  lineHeight: 1.35,
                }}
              >
                Gestores de Equipes
              </h3>
              <p
                style={{
                  color: colors['ink-muted'],
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Acompanhe o <strong>expediente</strong> da sua equipe, calcule compensações e identifique tendências.
              </p>
            </div>

            <div
              style={{
                padding: '24px',
                backgroundColor: colors['surface-1'],
                borderRadius: rounded.lg,
                borderLeft: `4px solid ${colors['product-waypoint']}`,
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: colors.ink,
                  marginBottom: '8px',
                  lineHeight: 1.35,
                }}
              >
                Autônomos e Freelancers
              </h3>
              <p
                style={{
                  color: colors['ink-muted'],
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Registre seus projetos e carga de trabalho. Demonstre sua dedicação e cumpra seus compromissos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          paddingTop: '80px',
          paddingBottom: '80px',
          paddingLeft: '16px',
          paddingRight: '16px',
          background: `linear-gradient(135deg, ${colors['product-terraform']} 0%, ${colors['product-vault']} 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 600,
              color: colors.ink,
              marginBottom: '24px',
              lineHeight: 1.19,
              letterSpacing: '-1.0px',
            }}
          >
            Comece a Controlar Suas Horas Hoje Mesmo
          </h2>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: colors['ink-subtle'],
              marginBottom: '32px',
            }}
          >
            ExtraTime é 100% gratuito. Sem cartão de crédito, sem inscrições. Apenas comece a usar.
          </p>
          <Link
            href="/dashboard/"
            style={{
              display: 'inline-block',
              paddingLeft: '40px',
              paddingRight: '40px',
              paddingTop: '16px',
              paddingBottom: '16px',
              backgroundColor: colors.ink,
              color: colors['product-terraform'],
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: rounded.md,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Acessar ExtraTime Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">ExtraTime</h4>
              <p className="text-sm">
                Controle de jornada e hora extra de forma fácil e segura.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Produto</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/dashboard/" className="hover:text-white transition">
                    Aplicativo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Termos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Redes Sociais</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>
              &copy; 2024 ExtraTime. Todos os direitos reservados. | Rastreador de jornada,
              controle de hora extra e gestão de expediente.
            </p>
          </div>
        </div>
      </footer>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'ExtraTime',
            description:
              'Controle de jornada, hora extra e gestão de expediente. Aplicativo gratuito para rastreamento.',
            url: 'https://extratime-app.com',
            applicationCategory: 'ProductivityApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'BRL',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '150',
            },
            softwareVersion: '1.0.0',
          }),
        }}
      />
    </main>
  );
}
