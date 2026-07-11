import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - ExtraTime | Controle de Jornada',
  description: 'Seu painel de controle de horas, análises e gráficos de expediente. Acompanhe suas horas extras e compensações.',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
