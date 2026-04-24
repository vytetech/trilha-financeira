import {
  LayoutDashboard,
  CheckSquare,
  Repeat,
  Target,
  Wallet,
  TrendingUp,
  BarChart3,
  Trophy,
  Settings,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, getPlanFamily } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import logoTrilha from "@/assets/logo-trilha.x.png";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Tarefas", url: "/tasks", icon: CheckSquare },
  { title: "Hábitos", url: "/habits", icon: Repeat },
  { title: "Metas", url: "/goals", icon: Target },
  { title: "Financeiro", url: "/finances", icon: Wallet },
  { title: "Investimentos", url: "/investments", icon: TrendingUp },
  { title: "Sonhos", url: "/dreams", icon: Sparkles },
  { title: "Relatórios", url: "/reports", icon: BarChart3 },
  { title: "Ranking", url: "/ranking", icon: Trophy },
  { title: "Configurações", url: "/settings", icon: Settings },
];

// Configurações visuais por plano
const PLAN_CONFIG = {
  free: {
    label: "Free",
    color: "text-muted-foreground",
    bg: "bg-muted/60",
    border: "border-border",
    ring: "hsl(220 10% 50%)",
  },
  pro: {
    label: "Pro",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    ring: "hsl(153 100% 50%)",
  },
  ultimate: {
    label: "Ultimate",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    ring: "hsl(270 80% 70%)",
  },
};

// Ring SVG de progresso de XP em volta do avatar
function XPRing({
  progress,
  planFamily,
  size = 44,
}: {
  progress: number;
  planFamily: "free" | "pro" | "ultimate";
  size?: number;
}) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  const color = PLAN_CONFIG[planFamily].ring;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth={2}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        opacity={0.8}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { signOut, user } = useAuth();
  const { plan } = useSubscription();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [profileName, setProfileName] = useState<string>("");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const planFamily = getPlanFamily(plan) as "free" | "pro" | "ultimate";
  const planCfg = PLAN_CONFIG[planFamily];

  // XP e nível mudam junto com o plano em tempo real
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("profile-sidebar")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const d = payload.new as any;
          if (d.full_name) setProfileName(d.full_name);
          if (d.xp !== undefined) setXp(d.xp);
          if (d.level !== undefined) setLevel(d.level);
        },
      )
      .subscribe();

    supabase
      .from("profiles")
      .select("full_name, xp, level")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        if (data.full_name) setProfileName(data.full_name);
        if (data.xp !== undefined) setXp(data.xp);
        if (data.level !== undefined) setLevel(data.level);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const fullName = profileName || user?.user_metadata?.full_name || "Usuário";
  const email = user?.email || "";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const nextLevelXP = level * 100;
  const xpProgress = Math.min((xp / nextLevelXP) * 100, 100);

  // Card de perfil expandido
  const ProfileExpanded = () => (
    <div
      className={`rounded-xl border ${planCfg.border} bg-sidebar-accent/40 p-3 space-y-3 transition-colors duration-300`}
    >
      {/* Linha superior: avatar + nome + badge plano */}
      <div className="flex items-center gap-2.5">
        {/* Avatar com ring de XP */}
        <div className="relative shrink-0" style={{ width: 38, height: 38 }}>
          <XPRing progress={xpProgress} planFamily={planFamily} size={38} />
          <div
            className="absolute inset-[3px] rounded-full flex items-center justify-center text-xs font-semibold"
            style={{
              background: `hsl(var(--sidebar-accent))`,
              border: `1px solid ${planCfg.ring}30`,
              color: planCfg.ring,
            }}
          >
            {initials}
          </div>
        </div>

        {/* Nome e email */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate leading-tight">
            {fullName.split(" ").slice(0, 2).join(" ")}
          </p>
          <p className="text-[10px] text-muted-foreground truncate">{email}</p>
        </div>

        {/* Badge de plano */}
        <span
          className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${planCfg.bg} ${planCfg.color} ${planCfg.border}`}
        >
          {planCfg.label}
        </span>
      </div>

      {/* Linha de XP */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-medium">
            Nível {level}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {xp} / {nextLevelXP} XP
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${xpProgress}%`,
              background: planCfg.ring,
              opacity: 0.85,
            }}
          />
        </div>
      </div>
    </div>
  );

  // Avatar colapsado com tooltip completo
  const ProfileCollapsed = () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex justify-center cursor-default">
          <div className="relative" style={{ width: 38, height: 38 }}>
            <XPRing progress={xpProgress} planFamily={planFamily} size={38} />
            <div
              className="absolute inset-[3px] rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                background: `hsl(var(--sidebar-accent))`,
                border: `1px solid ${planCfg.ring}30`,
                color: planCfg.ring,
              }}
            >
              {initials}
            </div>
            {/* Mini badge de plano no canto */}
            <div
              className={`absolute -bottom-1 -right-1 text-[8px] font-bold px-1 rounded-full border ${planCfg.bg} ${planCfg.color} ${planCfg.border} leading-4`}
            >
              {planCfg.label[0]}
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex flex-col gap-0.5">
        <span className="font-semibold">
          {fullName.split(" ").slice(0, 2).join(" ")}
        </span>
        <span className="text-xs text-muted-foreground">{email}</span>
        <span className={`text-xs font-medium mt-0.5 ${planCfg.color}`}>
          Plano {planCfg.label} · Nível {level}
        </span>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <aside
      className={`
        relative flex flex-col h-full border-r border-border bg-sidebar
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? "w-[64px]" : "w-[240px]"}
      `}
    >
      {/* Botão de colapsar */}
      <button
        onClick={onToggle}
        className="
          absolute -right-3 top-[60px] z-20
          h-6 w-6 rounded-full
          bg-sidebar border border-border
          flex items-center justify-center
          text-muted-foreground hover:text-foreground
          hover:border-primary/50 hover:shadow-[0_0_8px_hsl(153_100%_50%/0.3)]
          transition-all duration-200
        "
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Logo */}
      <div
        className={`
          flex items-center border-b border-border shrink-0
          transition-all duration-300
          ${collapsed ? "justify-center px-0 py-4" : "gap-3 px-5 py-4"}
        `}
      >
        <img
          src={logoTrilha}
          alt="TRILHA.X"
          className="h-10 w-10 rounded-lg object-cover border border-primary/40 shadow-[0_0_8px_rgba(34,197,94,0.25)] shrink-0"
        />
        {!collapsed && (
          <span className="text-xl font-black gradient-text tracking-tighter uppercase whitespace-nowrap overflow-hidden">
            TRILHA.X
          </span>
        )}
      </div>

      {/* Perfil */}
      <div className="px-2 pt-4 pb-2 shrink-0">
        {collapsed ? <ProfileCollapsed /> : <ProfileExpanded />}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {menuItems.map((item) =>
          collapsed ? (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <div>
                  <NavLink
                    to={item.url}
                    end={item.url === "/dashboard"}
                    className="flex items-center justify-center h-10 w-10 mx-auto rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                    activeClassName="bg-primary/10 text-primary"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                  </NavLink>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
          ) : (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/dashboard"}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap overflow-hidden">
                {item.title}
              </span>
            </NavLink>
          ),
        )}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-4 pt-2 border-t border-border space-y-0.5 shrink-0">
        {/* Toggle de tema */}
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-center h-10 w-10 mx-auto rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Sun className="h-4 w-4 shrink-0" />
              ) : (
                <Moon className="h-4 w-4 shrink-0" />
              )}
              <span>{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>
            </div>
            <div
              className={`w-8 h-4 rounded-full transition-colors duration-300 relative ${
                theme === "dark" ? "bg-muted" : "bg-primary"
              }`}
            >
              <div
                className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all duration-300 ${
                  theme === "dark" ? "left-0.5" : "left-4"
                }`}
              />
            </div>
          </button>
        )}

        {/* Botão sair */}
        <AlertDialog>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center justify-center h-10 w-10 mx-auto rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <LogOut className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Sair</TooltipContent>
            </Tooltip>
          ) : (
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full">
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Sair</span>
              </button>
            </AlertDialogTrigger>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
              <AlertDialogDescription>
                Você será desconectado e redirecionado para a tela de login.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sair
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
