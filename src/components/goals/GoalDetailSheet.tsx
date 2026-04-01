import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trophy, Clock, TrendingUp, Target, Flame, BookOpen,
  Briefcase, Heart, Zap, Calendar
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  description: string | null;
  category: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  deadline: string | null;
  priority: string;
  status: string;
  xp_reward: number;
  is_main: boolean;
}

const catConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  financial: { label: "Financeira", icon: <TrendingUp className="h-4 w-4" />, color: "text-yellow-400" },
  professional: { label: "Profissional", icon: <Briefcase className="h-4 w-4" />, color: "text-blue-400" },
  health: { label: "Saúde", icon: <Heart className="h-4 w-4" />, color: "text-red-400" },
  personal: { label: "Pessoal", icon: <Target className="h-4 w-4" />, color: "text-primary" },
  studies: { label: "Estudos", icon: <BookOpen className="h-4 w-4" />, color: "text-purple-400" },
};

const typeConfig: Record<string, { label: string; unit: string; format: (v: number) => string }> = {
  financial: {
    label: "Financeira",
    unit: "R$",
    format: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
  },
  habit: {
    label: "Hábito",
    unit: "dias",
    format: (v) => `${v} dias`,
  },
  task: {
    label: "Tarefas",
    unit: "tarefas",
    format: (v) => `${v} tarefas`,
  },
  custom: {
    label: "Personalizada",
    unit: "unidades",
    format: (v) => `${v}`,
  },
};

const priorityLabels: Record<string, { label: string; color: string }> = {
  low: { label: "Baixa", color: "bg-muted text-muted-foreground" },
  medium: { label: "Média", color: "bg-yellow-500/20 text-yellow-400" },
  high: { label: "Alta", color: "bg-orange-500/20 text-orange-400" },
  urgent: { label: "Urgente", color: "bg-destructive/20 text-destructive" },
};

interface GoalDetailSheetProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddValue: (id: string, amount: number, current: number, target: number) => void;
}

export default function GoalDetailSheet({ goal, open, onOpenChange, onAddValue }: GoalDetailSheetProps) {
  const [addAmount, setAddAmount] = useState("");

  if (!goal) return null;

  const type = typeConfig[goal.goal_type] || typeConfig.custom;
  const cat = catConfig[goal.category] || catConfig.personal;
  const priority = priorityLabels[goal.priority] || priorityLabels.medium;
  const pct = goal.target_value > 0 ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100)) : 0;
  const remaining = Math.max(0, goal.target_value - goal.current_value);

  const daysLeft = goal.deadline
    ? Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleAdd = () => {
    const val = Number(addAmount);
    if (val > 0) {
      onAddValue(goal.id, val, goal.current_value, goal.target_value);
      setAddAmount("");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-2">
            {goal.is_main && <Trophy className="h-5 w-5 text-primary" />}
            <SheetTitle className="text-foreground">{goal.name}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <span className={cat.color}>{cat.icon}</span> {cat.label}
            </Badge>
            <Badge variant="outline">{type.label}</Badge>
            <Badge className={priority.color}>{priority.label}</Badge>
            <Badge className={
              goal.status === "completed" ? "bg-green-500/20 text-green-400" :
              goal.status === "delayed" ? "bg-orange-500/20 text-orange-400" :
              "bg-primary/20 text-primary"
            }>
              {goal.status === "active" ? "Ativa" : goal.status === "completed" ? "Concluída" : "Atrasada"}
            </Badge>
          </div>

          {/* Description */}
          {goal.description && (
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="text-sm text-muted-foreground">{goal.description}</p>
            </div>
          )}

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Progresso</span>
              <span className="text-2xl font-bold text-primary">{pct}%</span>
            </div>
            <Progress value={pct} className="h-4" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Atual: {type.format(goal.current_value)}</span>
              <span>Meta: {type.format(goal.target_value)}</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Falta</p>
              <p className="font-bold text-sm text-foreground">{type.format(remaining)}</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
              <Zap className="h-4 w-4 mx-auto mb-1 text-yellow-400" />
              <p className="text-xs text-muted-foreground">Recompensa</p>
              <p className="font-bold text-sm text-foreground">{goal.xp_reward} XP</p>
            </div>
            {daysLeft !== null && (
              <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                <Clock className="h-4 w-4 mx-auto mb-1 text-orange-400" />
                <p className="text-xs text-muted-foreground">Dias restantes</p>
                <p className="font-bold text-sm text-foreground">{daysLeft}d</p>
              </div>
            )}
            {goal.deadline && (
              <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Prazo</p>
                <p className="font-bold text-sm text-foreground">{new Date(goal.deadline).toLocaleDateString("pt-BR")}</p>
              </div>
            )}
          </div>

          {/* Add value */}
          {goal.status !== "completed" && (
            <div className="space-y-2 rounded-lg border border-border bg-secondary/30 p-4">
              <Label className="text-sm font-semibold">Adicionar progresso</Label>
              <p className="text-xs text-muted-foreground mb-2">
                {goal.goal_type === "financial" ? "Insira o valor em reais" :
                 goal.goal_type === "habit" ? "Insira a quantidade de dias" :
                 goal.goal_type === "task" ? "Insira a quantidade de tarefas concluídas" :
                 "Insira o valor a adicionar"}
              </p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`Ex: ${goal.goal_type === "financial" ? "500" : "5"}`}
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  className="bg-secondary border-border"
                />
                <Button onClick={handleAdd} className="shrink-0">Adicionar</Button>
              </div>
            </div>
          )}

          {/* Completion message */}
          {goal.status === "completed" && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <p className="font-semibold text-green-400">Meta Concluída! 🎉</p>
              <p className="text-xs text-muted-foreground mt-1">Você ganhou {goal.xp_reward} XP</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
