import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Zap, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabase/client";

interface LeaderboardUser {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  xp_total: number; // ← XP total acumulado, nunca reseta
}

const PODIUM_STYLES = [
  {
    bg: "bg-yellow-500/10 border-yellow-500/30",
    icon: <Crown className="h-5 w-5 text-yellow-500" />,
    medal: "🥇",
    ring: "ring-yellow-500/40",
  },
  {
    bg: "bg-gray-300/10 border-gray-400/30",
    icon: <Medal className="h-5 w-5 text-gray-400" />,
    medal: "🥈",
    ring: "ring-gray-400/40",
  },
  {
    bg: "bg-amber-700/10 border-amber-700/30",
    icon: <Medal className="h-5 w-5 text-amber-700" />,
    medal: "🥉",
    ring: "ring-amber-700/40",
  },
];

export default function GlobalLeaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, level, xp, xp_total")
        // Ordenar por xp_total DESC — é o único critério justo para ranking global
        .order("xp_total", { ascending: false })
        .limit(50);

      if (data) {
        setLeaders(data);
        if (user) {
          const idx = data.findIndex((u) => u.user_id === user.id);
          setUserRank(idx >= 0 ? idx + 1 : null);
        }
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-secondary/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (leaders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p>Nenhum jogador no ranking ainda.</p>
      </div>
    );
  }

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="space-y-6">
      {/* Banner da posição do usuário */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm text-foreground">
              Sua posição no ranking global
            </span>
          </div>
          <Badge className="bg-primary/20 text-primary border-none text-lg px-3 py-1">
            #{userRank}
          </Badge>
        </motion.div>
      )}

      {/* Top 3 Pódio */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 0, 2].map((idx) => {
          const p = top3[idx];
          if (!p) return <div key={idx} />;
          const style = PODIUM_STYLES[idx];
          const isMe = p.user_id === user?.id;
          return (
            <motion.div
              key={p.user_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-xl border ${style.bg} p-4 flex flex-col items-center text-center ${idx === 0 ? "md:-mt-4" : ""} ${isMe ? "ring-2 " + style.ring : ""}`}
            >
              <span className="text-3xl mb-2">{style.medal}</span>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <span className="text-lg font-bold text-primary">
                  {p.full_name?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <p className="font-semibold text-foreground text-sm truncate w-full">
                {p.full_name || "Anônimo"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Nível {p.level}
                </span>
              </div>
              {/* Exibe xp_total — nunca reseta, é o score real do ranking */}
              <span className="text-xs font-mono font-semibold text-primary mt-0.5">
                {(p.xp_total ?? 0).toLocaleString("pt-BR")} XP
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Restante do leaderboard */}
      {rest.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-3 border-b border-border bg-secondary/30">
            <div className="grid grid-cols-12 text-xs text-muted-foreground font-medium">
              <span className="col-span-1">#</span>
              <span className="col-span-7">Jogador</span>
              <span className="col-span-2 text-center">Nível</span>
              <span className="col-span-2 text-right">XP Total</span>
            </div>
          </div>
          {rest.map((p, i) => {
            const rank = i + 4;
            const isMe = p.user_id === user?.id;
            return (
              <motion.div
                key={p.user_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={`grid grid-cols-12 items-center p-3 border-b border-border/50 last:border-0 ${isMe ? "bg-primary/5" : "hover:bg-secondary/30"} transition-colors`}
              >
                <span className="col-span-1 text-sm font-mono text-muted-foreground">
                  {rank}
                </span>
                <div className="col-span-7 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {p.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <span
                    className={`text-sm truncate ${isMe ? "font-semibold text-primary" : "text-foreground"}`}
                  >
                    {p.full_name || "Anônimo"} {isMe && "(Você)"}
                  </span>
                </div>
                <span className="col-span-2 text-center text-sm font-medium text-foreground">
                  {p.level}
                </span>
                {/* xp_total — critério real do ranking */}
                <span className="col-span-2 text-right text-sm font-mono text-muted-foreground">
                  {(p.xp_total ?? 0).toLocaleString("pt-BR")}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
