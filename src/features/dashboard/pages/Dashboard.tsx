import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Target,
  CheckSquare,
  TrendingUp,
  Zap,
  Flame,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Sparkles,
  Repeat,
  Star,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [tasksDone, setTasksDone] = useState(0);
  const [tasksPending, setTasksPending] = useState(0);
  const [habitsToday, setHabitsToday] = useState(0);
  const [totalHabits, setTotalHabits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [invested, setInvested] = useState(0);
  const [goalsActive, setGoalsActive] = useState(0);
  const [goalsCompleted, setGoalsCompleted] = useState(0);
  const [mainGoal, setMainGoal] = useState<any>(null);
  const [achievements, setAchievements] = useState(0);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const startMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    const fetchAll = async () => {
      const [
        profileRes,
        tasksDoneRes,
        tasksPendRes,
        habitsRes,
        logsRes,
        txRes,
        invRes,
        goalsRes,
        mainGoalRes,
        achieveRes,
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase
          .from("tasks")
          .select("id", { count: "exact" })
          .eq("user_id", user.id)
          .eq("status", "done"),
        supabase
          .from("tasks")
          .select("id", { count: "exact" })
          .eq("user_id", user.id)
          .neq("status", "done"),
        supabase
          .from("habits")
          .select("id, streak", { count: "exact" })
          .eq("user_id", user.id)
          .eq("is_active", true),
        supabase
          .from("habit_logs")
          .select("id", { count: "exact" })
          .eq("user_id", user.id)
          .eq("completed_at", today),
        supabase
          .from("transactions")
          .select("type, amount")
          .eq("user_id", user.id)
          .gte("transaction_date", startMonth),
        supabase
          .from("investments")
          .select("quantity, current_price")
          .eq("user_id", user.id),
        supabase.from("goals").select("status").eq("user_id", user.id),
        supabase
          .from("goals")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_main", true)
          .single(),
        supabase
          .from("achievements")
          .select("id", { count: "exact" })
          .eq("user_id", user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      setTasksDone(tasksDoneRes.count || 0);
      setTasksPending(tasksPendRes.count || 0);
      if (habitsRes.data) {
        setTotalHabits(habitsRes.data.length);
        setStreak(
          habitsRes.data.reduce((max, h) => Math.max(max, h.streak || 0), 0),
        );
      }
      setHabitsToday(logsRes.count || 0);
      if (txRes.data) {
        setIncome(
          txRes.data
            .filter((t) => t.type === "income")
            .reduce((a, t) => a + Number(t.amount), 0),
        );
        setExpenses(
          txRes.data
            .filter((t) => t.type === "expense")
            .reduce((a, t) => a + Number(t.amount), 0),
        );
      }
      if (invRes.data)
        setInvested(
          invRes.data.reduce(
            (a, i) => a + Number(i.quantity) * Number(i.current_price),
            0,
          ),
        );
      if (goalsRes.data) {
        setGoalsActive(
          goalsRes.data.filter((g) => g.status === "active").length,
        );
        setGoalsCompleted(
          goalsRes.data.filter((g) => g.status === "completed").length,
        );
      }
      if (mainGoalRes.data) setMainGoal(mainGoalRes.data);
      setAchievements(achieveRes.count || 0);
    };
    fetchAll();
  }, [user]);

  const xp = profile?.xp || 0;
  const xpTotal = profile?.xp_total || 0;
  const level = profile?.level || 1;
  const nextLevelXP = level * 100;
  const xpProgress = Math.min(Math.max((xp / nextLevelXP) * 100, 0), 100);

  const balance = income - expenses;
  const savingsRate =
    income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  const savingsRateDisplay = Math.max(savingsRate, 0);
  const isNegativeBalance = balance < 0;
  const isNegativeSavings = savingsRate < 0;

  const fmt = (v: number) =>
    `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  const habitsProgress =
    totalHabits > 0 ? Math.round((habitsToday / totalHabits) * 100) : 0;
  const name =
    profile?.full_name || user?.user_metadata?.full_name || "Usuário";

  // Valor mínimo de 5 para evitar colapso visual do shape no radar
  const MIN_RADAR = 5;
  const clamp = (v: number) => Math.min(Math.max(v, MIN_RADAR), 100);

  const radarData = [
    {
      attr: "Foco",
      raw: Math.min(Math.max(tasksDone * 5, 0), 100),
      value: clamp(tasksDone * 5),
      fullMark: 100,
    },
    {
      attr: "Disciplina",
      raw: Math.min(Math.max(habitsToday * 20, 0), 100),
      value: clamp(habitsToday * 20),
      fullMark: 100,
    },
    {
      attr: "Financeiro",
      raw: income > 0 ? Math.max(Math.min(savingsRateDisplay, 100), 0) : 0,
      value: income > 0 ? clamp(savingsRateDisplay) : MIN_RADAR,
      fullMark: 100,
    },
    {
      attr: "Produtividade",
      raw: Math.min(Math.max((tasksDone + habitsToday) * 5, 0), 100),
      value: clamp((tasksDone + habitsToday) * 5),
      fullMark: 100,
    },
    {
      attr: "Consistência",
      raw: Math.min(Math.max(streak * 5, 0), 100),
      value: clamp(streak * 5),
      fullMark: 100,
    },
    {
      attr: "Mental",
      raw: Math.min(Math.max((goalsActive + goalsCompleted) * 10, 0), 100),
      value: clamp((goalsActive + goalsCompleted) * 10),
      fullMark: 100,
    },
  ];

  const overallScore = Math.round(
    radarData.reduce((a, d) => a + d.raw, 0) / radarData.length,
  );

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{greeting()},</p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-0.5">
              <span className="text-primary">
                {name.split(" ").slice(0, 2).join(" ")}
              </span>
              , continue crescendo 🚀
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-secondary/80 rounded-xl border border-border px-4 py-2.5">
              <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center border-2 border-primary/30">
                <span className="text-primary font-bold text-sm">{level}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Nível
                </p>
                <div className="flex items-center gap-2">
                  <Progress value={xpProgress} className="h-1.5 w-20" />
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {xp}/{nextLevelXP}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-secondary/80 rounded-xl border border-border px-4 py-2.5">
              <Zap className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  XP Total
                </p>
                <p className="font-bold text-foreground font-mono text-sm">
                  {xpTotal.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-secondary/80 rounded-xl border border-border px-4 py-2.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Score
                </p>
                <p className="font-bold text-foreground font-mono text-sm">
                  {overallScore}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            icon: <Wallet className="h-4 w-4" />,
            label: "Saldo do Mês",
            value: fmt(balance),
            trend: isNegativeBalance ? "Negativo" : "Positivo",
            trendUp: !isNegativeBalance,
            iconColor: isNegativeBalance ? "text-destructive" : "text-primary",
            bg: isNegativeBalance ? "bg-destructive/10" : "bg-primary/10",
            onClick: () => navigate("/finances"),
          },
          {
            icon: <TrendingUp className="h-4 w-4" />,
            label: "Investimentos",
            value: fmt(invested),
            trend: invested > 0 ? "Ativo" : "Sem posição",
            trendUp: invested > 0,
            iconColor: "text-primary",
            bg: "bg-primary/10",
            onClick: () => navigate("/investments"),
          },
          {
            icon: <CheckSquare className="h-4 w-4" />,
            label: "Tarefas Concluídas",
            value: `${tasksDone}`,
            trend:
              tasksPending > 0
                ? `${tasksPending} pendente${tasksPending > 1 ? "s" : ""}`
                : "Tudo em dia!",
            trendUp: tasksPending === 0,
            iconColor: "text-primary",
            bg: "bg-primary/10",
            onClick: () => navigate("/tasks"),
          },
          {
            icon: <Flame className="h-4 w-4" />,
            label: "Streak",
            value: `${streak}d`,
            trend: `${habitsToday}/${totalHabits} hábitos hoje`,
            trendUp: streak > 0,
            iconColor: "text-orange-400",
            bg: "bg-orange-400/10",
            onClick: () => navigate("/habits"),
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.04 }}
            onClick={s.onClick}
            className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn("p-2 rounded-lg", s.bg)}>
                <span className={s.iconColor}>{s.icon}</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p className="text-xl font-bold text-foreground font-mono mt-0.5 leading-tight">
              {s.value}
            </p>
            <p
              className={cn(
                "text-[10px] mt-1 flex items-center gap-1",
                s.trendUp ? "text-primary" : "text-destructive",
              )}
            >
              {s.trendUp ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {s.trend}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Radar de Atributos
            </h3>
            <Badge variant="outline" className="text-[10px] font-mono">
              {overallScore}% geral
            </Badge>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="flex-1 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={radarData}
                  cx="50%"
                  cy="50%"
                  outerRadius="72%"
                >
                  <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.6} />
                  <PolarAngleAxis
                    dataKey="attr"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.18}
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="hidden md:flex flex-col gap-2.5 w-44">
              {radarData.map((d, i) => {
                // Sidebar mostra valor real (raw), financeiro pode ser negativo
                const displayVal =
                  d.attr === "Financeiro" ? savingsRate : d.raw;
                const isNeg = displayVal < 0;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground w-24 truncate">
                      {d.attr}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-12 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            isNeg ? "bg-destructive" : "bg-primary",
                          )}
                          style={{ width: `${d.raw}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-mono w-8 text-right tabular-nums",
                          isNeg ? "text-destructive" : "text-foreground",
                        )}
                      >
                        {isNeg ? displayVal : d.raw}
                      </span>
                    </div>
                  </div>
                );
              })}
              {isNegativeSavings && (
                <p className="text-[10px] text-destructive/80 mt-1 leading-tight">
                  ⚠ Saldo negativo afeta seu score financeiro
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Habits */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate("/habits")}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Repeat className="h-4 w-4 text-primary" /> Hábitos de Hoje
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                {habitsToday}/{totalHabits}
              </span>
            </div>
            {totalHabits === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nenhum hábito ativo. Adicione hábitos para começar!
              </p>
            ) : (
              <>
                <Progress value={habitsProgress} className="h-2 mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {habitsProgress}% concluído
                  </span>
                  {habitsProgress === 100 && (
                    <span className="text-[10px] text-primary font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3" /> Dia perfeito!
                    </span>
                  )}
                </div>
              </>
            )}
          </motion.div>

          {/* Main Goal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            onClick={() => navigate("/goals")}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-all cursor-pointer"
          >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />{" "}
              {mainGoal ? mainGoal.name : "Meta Principal"}
            </h3>
            {mainGoal ? (
              <>
                <Progress
                  value={
                    mainGoal.target_value > 0
                      ? Math.min(
                          (mainGoal.current_value / mainGoal.target_value) *
                            100,
                          100,
                        )
                      : 0
                  }
                  className="h-2 mb-2"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {mainGoal.target_value > 0
                      ? Math.round(
                          (mainGoal.current_value / mainGoal.target_value) *
                            100,
                        )
                      : 0}
                    % concluído
                  </span>
                  {mainGoal.target_value > 0 && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {mainGoal.current_value}/{mainGoal.target_value}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Defina uma meta principal em Metas
              </p>
            )}
          </motion.div>

          {/* Conquistas */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate("/ranking")}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-all cursor-pointer"
          >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-400" /> Conquistas
            </h3>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-foreground">
                {achievements}
              </span>
              <span className="text-[10px] text-muted-foreground">
                desbloqueada{achievements !== 1 ? "s" : ""}
              </span>
            </div>
            {achievements === 0 && (
              <p className="text-[10px] text-muted-foreground mt-1">
                Complete tarefas e hábitos para ganhar conquistas
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Financial Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-xl border border-border bg-card overflow-hidden"
      >
        <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" /> Resumo Financeiro do Mês
          </h3>
          {isNegativeBalance && (
            <Badge variant="destructive" className="text-[10px]">
              Saldo negativo
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/30">
          {[
            {
              label: "Receitas",
              value: fmt(income),
              color: "text-primary",
              icon: <ArrowUpRight className="h-3.5 w-3.5" />,
              subtext: income === 0 ? "Nenhuma receita" : null,
            },
            {
              label: "Despesas",
              value: fmt(expenses),
              color: "text-destructive",
              icon: <ArrowDownRight className="h-3.5 w-3.5" />,
              subtext: expenses === 0 ? "Nenhuma despesa" : null,
            },
            {
              label: "Economia",
              value: `${savingsRate}%`,
              color: savingsRate >= 0 ? "text-primary" : "text-destructive",
              icon:
                savingsRate >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                ),
              subtext: isNegativeSavings ? "Gastos > Receitas" : null,
            },
            {
              label: "Investido",
              value: fmt(invested),
              color: "text-foreground",
              icon: <BarChart3 className="h-3.5 w-3.5" />,
              subtext: invested === 0 ? "Sem posição" : null,
            },
          ].map((item, i) => (
            <div key={i} className="p-5 text-center">
              <div
                className={cn(
                  "flex items-center justify-center gap-1 mb-1",
                  item.color,
                )}
              >
                {item.icon}
              </div>
              <p
                className={cn(
                  "text-lg md:text-xl font-bold font-mono",
                  item.color,
                )}
              >
                {item.value}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                {item.label}
              </p>
              {item.subtext && (
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                  {item.subtext}
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
