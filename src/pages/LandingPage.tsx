import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  CheckSquare,
  Target,
  Wallet,
  TrendingUp,
  Flame,
  Trophy,
  BarChart3,
  ArrowRight,
  Star,
  Sparkles,
  Shield,
  Smartphone,
  Users,
  Calendar,
  Layout,
  Rocket,
  Eye,
  Lock,
  Clock,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const modules = [
  {
    icon: Layout,
    title: "Dashboard Inteligente",
    desc: "Visão 360° com radar de atributos, score de performance, saldo, streaks e metas — tudo em uma tela.",
    tag: "Core",
  },
  {
    icon: CheckSquare,
    title: "Tarefas & Kanban",
    desc: "Board Kanban com prioridades, subtarefas, XP por conclusão, visão semanal e mensal integrada.",
    tag: "Produtividade",
  },
  {
    icon: Flame,
    title: "Hábitos & Streaks",
    desc: "Crie hábitos com dias personalizados, acompanhe sequências e evolua seus atributos pessoais.",
    tag: "Consistência",
  },
  {
    icon: Target,
    title: "Metas Gamificadas",
    desc: "Defina metas com marcos, medalhas, projeções inteligentes e destaque para sua meta principal.",
    tag: "Foco",
  },
  {
    icon: Wallet,
    title: "Controle Financeiro",
    desc: "Receitas, despesas, cartões de crédito, orçamentos por categoria e gráficos detalhados.",
    tag: "Finanças",
  },
  {
    icon: TrendingUp,
    title: "Investimentos",
    desc: "Portfólio completo com alocação por tipo, simulador de aportes e histórico de transações.",
    tag: "Patrimônio",
  },
  {
    icon: Sparkles,
    title: "Sonhos",
    desc: "Visualize e planeje seus sonhos com metas financeiras, progresso visual e priorização.",
    tag: "Motivação",
  },
  {
    icon: BarChart3,
    title: "Relatórios",
    desc: "Radar de atributos, análise de produtividade, evolução financeira e exportação PDF.",
    tag: "Análise",
  },
  {
    icon: Trophy,
    title: "Ranking & Conquistas",
    desc: "Desbloqueie medalhas, suba no ranking e compare sua evolução com outros usuários.",
    tag: "Competição",
  },
];

const gamificationFeatures = [
  {
    icon: "⚡",
    title: "XP & Níveis",
    desc: "Cada tarefa, hábito e meta concluída te dá XP. Suba de nível e desbloqueie conquistas.",
  },
  {
    icon: "🔥",
    title: "Streaks",
    desc: "Mantenha sequências diárias nos hábitos. Quanto maior o streak, mais XP bônus você ganha.",
  },
  {
    icon: "🏆",
    title: "Conquistas",
    desc: "Medalhas de bronze, prata e ouro por marcos atingidos em cada módulo do sistema.",
  },
  {
    icon: "📊",
    title: "Radar de Atributos",
    desc: "Foco, Disciplina, Mental, Financeiro, Produtividade e Consistência — visualize sua evolução.",
  },
  {
    icon: "🎯",
    title: "Score de Performance",
    desc: "Um número que resume todo seu progresso diário, semanal e mensal em uma métrica clara.",
  },
  {
    icon: "👑",
    title: "Ranking Global",
    desc: "Compare seu nível e XP com outros usuários e dispute as primeiras posições.",
  },
];

const testimonials = [
  {
    name: "Lucas M.",
    role: "Desenvolvedor",
    text: "Nunca fui tão produtivo. O sistema de XP me motiva a completar tudo.",
    avatar: "LM",
  },
  {
    name: "Ana C.",
    role: "Designer",
    text: "Finalmente consigo controlar finanças e hábitos no mesmo lugar. Incrível.",
    avatar: "AC",
  },
  {
    name: "Pedro S.",
    role: "Empreendedor",
    text: "O radar de atributos me mostrou onde eu estava falhando. Mudou minha vida.",
    avatar: "PS",
  },
];

interface PlanFeature {
  text: string;
  included: boolean;
}
interface Plan {
  name: string;
  badge?: string;
  desc: string;
  monthlyPrice: number;
  annualPrice: number;
  features: PlanFeature[];
  cta: string;
  highlight: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    desc: "Para começar sua jornada",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Começar Grátis",
    highlight: false,
    features: [
      { text: "5 tarefas ativas", included: true },
      { text: "3 hábitos", included: true },
      { text: "2 metas", included: true },
      { text: "50 transações/mês", included: true },
      { text: "5 investimentos", included: true },
      { text: "Dashboard completo", included: true },
      { text: "Conquistas básicas", included: true },
      { text: "Relatórios avançados", included: false },
      { text: "Exportação PDF/Excel", included: false },
      { text: "Ranking global", included: false },
      { text: "Suporte prioritário", included: false },
    ],
  },
  {
    name: "Pro",
    badge: "Mais popular",
    desc: "Para quem leva a sério",
    monthlyPrice: 19.9,
    annualPrice: 199.9,
    cta: "Assinar Pro",
    highlight: true,
    features: [
      { text: "20 tarefas ativas", included: true },
      { text: "10 hábitos", included: true },
      { text: "10 metas", included: true },
      { text: "200 transações/mês", included: true },
      { text: "20 investimentos", included: true },
      { text: "Dashboard completo", included: true },
      { text: "Todas as conquistas", included: true },
      { text: "Relatórios avançados", included: true },
      { text: "Exportação PDF/Excel", included: true },
      { text: "Ranking global", included: true },
      { text: "Suporte prioritário", included: false },
    ],
  },
  {
    name: "Ultimate",
    badge: "Sem limites",
    desc: "Para os que não aceitam limites",
    monthlyPrice: 39.9,
    annualPrice: 399.9,
    cta: "Assinar Ultimate",
    highlight: false,
    features: [
      { text: "Tarefas ilimitadas", included: true },
      { text: "Hábitos ilimitados", included: true },
      { text: "Metas ilimitadas", included: true },
      { text: "Transações ilimitadas", included: true },
      { text: "Investimentos ilimitados", included: true },
      { text: "Dashboard completo", included: true },
      { text: "Todas as conquistas", included: true },
      { text: "Relatórios avançados", included: true },
      { text: "Exportação PDF/Excel", included: true },
      { text: "Ranking global", included: true },
      { text: "Suporte prioritário", included: true },
    ],
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (p: Plan) =>
    p.monthlyPrice === 0
      ? "R$ 0"
      : `R$ ${(isAnnual ? p.annualPrice : p.monthlyPrice).toFixed(2).replace(".", ",")}`;
  const getPeriod = (p: Plan) =>
    p.monthlyPrice === 0 ? "/mês" : isAnnual ? "/ano" : "/mês";
  const getSaving = (p: Plan) =>
    p.monthlyPrice === 0
      ? null
      : `Economize R$ ${(p.monthlyPrice * 12 - p.annualPrice).toFixed(0)}`;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold gradient-text">TRILHA</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() =>
                document
                  .getElementById("modules")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Módulos
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("gamification")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Gamificação
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Planos
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Entrar
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/signup")}
              className="gap-1.5"
            >
              Começar <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-24 px-6 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6 text-xs font-medium px-3 py-1">
              <Rocket className="h-3 w-3 mr-1.5" /> Plataforma completa de
              evolução pessoal
            </Badge>
          </motion.div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight"
          >
            Sua vida como um <span className="neon-text">jogo de</span>
            <br />
            <span className="neon-text">evolução real</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-base md:text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Organize tarefas, construa hábitos, controle finanças, gerencie
            investimentos e conquiste metas — tudo em uma plataforma gamificada
            que te recompensa por cada passo.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
          >
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="gap-2 text-base px-8 h-12 font-semibold"
            >
              Começar Grátis <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("modules")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="gap-2 text-base px-8 h-12"
            >
              <Eye className="h-4 w-4" /> Ver todos os módulos
            </Button>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-2xl mx-auto"
          >
            {[
              { value: "9", label: "Módulos completos" },
              { value: "6", label: "Atributos de evolução" },
              { value: "∞", label: "Potencial de XP" },
              { value: "100%", label: "Gamificado" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold neon-text font-mono">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-6 px-6 border-y border-border bg-card/50">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: Shield, text: "Dados criptografados" },
            { icon: Smartphone, text: "100% responsivo" },
            { icon: Clock, text: "Atualizações semanais" },
            { icon: Lock, text: "Autenticação segura" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <item.icon className="h-4 w-4 text-primary/60" />
              <span className="text-xs font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 text-xs">
              Funcionalidades
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Tudo que você precisa para{" "}
              <span className="neon-text">evoluir</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              9 módulos integrados que trabalham juntos para transformar cada
              ação em progresso mensurável.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m, i) => (
              <motion.div
                key={m.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/15 transition-colors">
                    <m.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-border text-muted-foreground"
                  >
                    {m.tag}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-1.5 text-sm">
                  {m.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="gamification"
        className="py-24 px-6 border-t border-border relative"
      >
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 text-xs">
              Sistema de Gamificação
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Cada ação te faz <span className="neon-text">mais forte</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Um sistema completo de progressão que transforma disciplina em
              resultados visíveis.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamificationFeatures.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-all"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-semibold text-foreground mt-3 mb-1.5 text-sm">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 text-xs">
              Como funciona
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              3 passos para <span className="neon-text">começar</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Crie sua conta",
                desc: "Cadastro rápido e gratuito. Sem cartão de crédito.",
                icon: Users,
              },
              {
                step: "02",
                title: "Configure seus módulos",
                desc: "Adicione tarefas, hábitos, metas e controle financeiro.",
                icon: Calendar,
              },
              {
                step: "03",
                title: "Evolua diariamente",
                desc: "Ganhe XP, suba de nível e acompanhe seu progresso.",
                icon: Rocket,
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="block text-xs font-mono text-primary mb-2">
                  Passo {s.step}
                </span>
                <h3 className="font-semibold text-foreground mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 text-xs">
              Depoimentos
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Quem usa, <span className="neon-text">evolui</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex gap-0.5 mt-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-primary text-primary"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="py-24 px-6 border-t border-border relative"
      >
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-10"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 text-xs">
              Planos
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Escolha seu <span className="neon-text">caminho</span>
            </h2>
            <p className="text-muted-foreground mt-3">
              Comece grátis. Evolua quando quiser.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <span
              className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Mensal
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isAnnual ? "bg-primary" : "bg-muted"}`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${isAnnual ? "left-8" : "left-1"}`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
              >
                Anual
              </span>
              <Badge className="bg-primary/20 text-primary border-none text-[10px] px-2 py-0.5">
                2 meses grátis
              </Badge>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`rounded-xl border p-6 relative flex flex-col ${plan.highlight ? "border-primary/40 bg-primary/[0.03] shadow-lg shadow-primary/10" : "border-border bg-card"}`}
              >
                {plan.badge && (
                  <Badge
                    className={`absolute -top-2.5 left-4 text-[10px] px-2.5 ${plan.highlight ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"}`}
                  >
                    {plan.badge}
                  </Badge>
                )}
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.desc}
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground">
                      {getPrice(plan)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {getPeriod(plan)}
                    </span>
                  </div>
                  {isAnnual && plan.monthlyPrice !== 0 && (
                    <p className="text-xs text-primary mt-1 font-medium">
                      {getSaving(plan)} comparado ao mensal
                    </p>
                  )}
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f.text}
                      className={`text-sm flex items-center gap-2.5 ${f.included ? "text-foreground" : "text-muted-foreground line-through opacity-40"}`}
                    >
                      {f.included ? (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <X className="h-4 w-4 shrink-0" />
                      )}
                      {f.text}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlight ? "default" : "outline"}
                  size="lg"
                  onClick={() => navigate("/signup")}
                >
                  {plan.cta}
                </Button>
                {plan.monthlyPrice === 0 && (
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Sem cartão de crédito
                  </p>
                )}
              </motion.div>
            ))}
          </div>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={4}
            className="text-center text-xs text-muted-foreground mt-8 flex items-center justify-center gap-1.5"
          >
            <Shield className="h-3.5 w-3.5 text-primary/60" /> Cancele quando
            quiser · Sem taxas ocultas · Pagamento seguro via Stripe
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pronto para <span className="neon-text">evoluir</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Junte-se ao TRILHA e transforme cada dia em progresso real. Comece
              gratuitamente, sem compromisso.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="gap-2 text-base px-10 h-12 font-semibold"
            >
              Criar conta grátis <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Sem cartão de crédito · Cancele quando quiser
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col gap-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold gradient-text">TRILHA</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() =>
                  document
                    .getElementById("modules")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Módulos
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("gamification")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Gamificação
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Planos
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} TRILHA · VyteTech. Todos os direitos
              reservados.
            </p>
          </div>
          <div className="flex items-center justify-center gap-5 pt-4 border-t border-border/50">
            <Link
              to="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Termos de Uso
            </Link>
            <span className="text-muted-foreground/30">·</span>
            <Link
              to="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Política de Privacidade
            </Link>
            <span className="text-muted-foreground/30">·</span>
            <a
              href="mailto:trilhaapp@gmail.com"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              trilhaapp@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
