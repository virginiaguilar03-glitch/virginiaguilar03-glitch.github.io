import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Users,
  Shield,
  Building2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">UBS SaaS</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Comecar Agora</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Gestao completa para sua
            <span className="block text-primary">Unidade de Saude</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Simplifique o agendamento de consultas, gerencie medicos e pacientes,
            e tenha controle total da sua clinica ou UBS em uma unica plataforma.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="gap-2">
                Criar Conta Gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">
            Tudo que voce precisa em um so lugar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Recursos completos para modernizar a gestao da sua unidade de saude
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Calendar}
              title="Agendamento Inteligente"
              description="Sistema completo de agendamento com horarios disponiveis, confirmacao automatica e lembretes."
            />
            <FeatureCard
              icon={Users}
              title="Gestao de Pacientes"
              description="Cadastro completo de pacientes com historico de consultas e prontuario eletronico."
            />
            <FeatureCard
              icon={Shield}
              title="Multi-Tenant Seguro"
              description="Cada organizacao tem seus dados isolados com seguranca em nivel de linha (RLS)."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold">
                Por que escolher o UBS SaaS?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Nossa plataforma foi desenvolvida pensando nas necessidades reais
                de clinicas e unidades basicas de saude.
              </p>
              <ul className="mt-8 space-y-4">
                <BenefitItem text="Configuracao rapida em menos de 5 minutos" />
                <BenefitItem text="Suporte a multiplas unidades e filiais" />
                <BenefitItem text="Controle de acesso por perfil (admin, recepcao, medico)" />
                <BenefitItem text="Relatorios e metricas em tempo real" />
                <BenefitItem text="Integracao com sistemas externos via API" />
              </ul>
            </div>
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary">100%</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Baseado na Nuvem
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <StatCard value="99.9%" label="Uptime Garantido" />
                <StatCard value="24/7" label="Monitoramento" />
                <StatCard value="SSL" label="Criptografia" />
                <StatCard value="LGPD" label="Conformidade" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">
            Pronto para modernizar sua gestao?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Junte-se a centenas de unidades de saude que ja utilizam nossa
            plataforma para otimizar seus processos.
          </p>
          <div className="mt-8">
            <Link href="/auth/sign-up">
              <Button size="lg" variant="secondary" className="gap-2">
                Comecar Gratuitamente
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 UBS SaaS. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
      <span>{text}</span>
    </li>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg bg-muted p-4 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
