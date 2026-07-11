import Link from 'next/link';
import { Clock, BarChart3, Lock, Smartphone, Zap, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">ExtraTime</span>
          </div>
          <Link
            href="/dashboard/"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Acessar App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Controle Suas{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Horas Extras
            </span>{' '}
            com Facilidade
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            ExtraTime é o aplicativo gratuito para <strong>controle de jornada</strong> e{' '}
            <strong>gestão de expediente</strong>. Rastreie suas horas de trabalho, calcule{' '}
            <strong>overtime</strong>, analise compensações e folgas em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/"
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Começar Grátis
            </Link>
            <button className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 text-lg font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
              Saber Mais
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Por Que Usar ExtraTime?
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar seu <strong>controle de horas extras</strong> de forma prática e segura.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
              <div className="mb-4 inline-block p-3 bg-indigo-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Rastreamento em Tempo Real
              </h3>
              <p className="text-gray-700">
                Registre suas chegadas e saídas instantaneamente. Acompanhe seu{' '}
                <strong>controle de jornada</strong> com precisão.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="mb-4 inline-block p-3 bg-emerald-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Análise de Overtime
              </h3>
              <p className="text-gray-700">
                Calcule suas <strong>horas extras</strong> automaticamente. Visualize relatórios detalhados de{' '}
                <strong>expediente</strong> e compensações.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <div className="mb-4 inline-block p-3 bg-purple-600 rounded-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Seus Dados, Sua Privacidade
              </h3>
              <p className="text-gray-700">
                Todos os dados ficam armazenados no seu navegador. Nenhuma informação é enviada para servidores.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
              <div className="mb-4 inline-block p-3 bg-orange-600 rounded-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Acesso de Qualquer Lugar
              </h3>
              <p className="text-gray-700">
                Funciona em desktop, tablet e celular. Sincronize seu <strong>controle de horas</strong> entre dispositivos.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
              <div className="mb-4 inline-block p-3 bg-cyan-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Rápido e Leve
              </h3>
              <p className="text-gray-700">
                Interface intuitiva e responsiva. Gerencie seu <strong>overtime</strong> sem complicações.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
              <div className="mb-4 inline-block p-3 bg-indigo-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                Gráficos e Estatísticas
              </h3>
              <p className="text-gray-700">
                Visualize tendências de <strong>jornada</strong> e <strong>folgas</strong> com gráficos inteligentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
            Para Quem é ExtraTime?
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border-l-4 border-indigo-600 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Profissionais que Trabalham com Jornada Flexível
              </h3>
              <p className="text-gray-700">
                Controle suas horas com precisão e garanta o direito a compensações por{' '}
                <strong>horas extras</strong>.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border-l-4 border-emerald-600 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Gestores de Equipes
              </h3>
              <p className="text-gray-700">
                Acompanhe o <strong>expediente</strong> da sua equipe, calcule compensações e identifique tendências.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border-l-4 border-purple-600 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Autônomos e Freelancers
              </h3>
              <p className="text-gray-700">
                Registre seus projetos e carga de trabalho. Demonstre sua dedicação e cumpra seus compromissos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Comece a Controlar Suas Horas Hoje Mesmo
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            ExtraTime é 100% gratuito. Sem cartão de crédito, sem inscrições. Apenas comece a usar.
          </p>
          <Link
            href="/dashboard/"
            className="inline-block px-10 py-4 bg-white text-indigo-600 text-lg font-bold rounded-lg hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-xl"
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
