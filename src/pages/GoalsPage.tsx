import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Trash2, Trophy, Clock, TrendingUp, Pencil, Briefcase, Heart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PlanLimitBanner from "@/components/PlanLimitBanner";
import GoalDetailSheet from "@/components/goals/GoalDetailSheet";

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

const typeConfig: Record<string, { label: string; format: (v: number) => string }> = {
  financial: { label: "Financeira", format: (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
  habit: { label: "Hábito", format: (v) => `${v} dias` },
  task: { label: "Tarefas", format: (v) => `${v} tarefas` },
  custom: { label: "Personalizada", format: (v) => `${v}` },
};

const statusColors: Record<string, string> = {
  active: "bg-primary/20 text-primary",
  delayed: "bg-orange-500/20 text-orange-400",
  completed: "bg-green-500/20 text-green-400",
};

const emptyForm = { name: "", description: "", category: "personal", goal_type: "custom", target_value: "", deadline: "", priority: "medium", xp_reward: "50" };

export default function GoalsPage() {
  const { user } = useAuth();
  const { canCreate } = useSubscription();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchGoals = async () => {
    if (!user) return;
    const { data } = await supabase.from("goals").select("*").eq("user_id", user.id).order("is_main", { ascending: false });
    if (data) setGoals(data);
  };

  useEffect(() => { fetchGoals(); }, [user]);

  const openCreate = () => {
    setEditingGoal(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (e: React.MouseEvent, goal: Goal) => {
    e.stopPropagation();
    setEditingGoal(goal);
    setForm({
      name: goal.name, description: goal.description || "", category: goal.category,
      goal_type: goal.goal_type, target_value: String(goal.target_value),
      deadline: goal.deadline || "", priority: goal.priority, xp_reward: String(goal.xp_reward),
    });
    setDialogOpen(true);
  };

  const openDetail = (goal: Goal) => {
    setSelectedGoal(goal);
    setDetailOpen(true);
  };

  const saveGoal = async () => {
    if (!user || !form.name.trim()) return;
    if (!editingGoal && !canCreate("goals", goals.length)) {
      toast({ variant: "destructive", title: "Limite do plano Free", description: "Faça upgrade para criar mais metas." });
      return;
    }
    const payload = {
      name: form.name, description: form.description || null, category: form.category, goal_type: form.goal_type,
      target_value: Number(form.target_value) || 0, deadline: form.deadline || null, priority: form.priority, xp_reward: Number(form.xp_reward) || 50,
    };
    if (editingGoal) {
      await supabase.from("goals").update(payload).eq("id", editingGoal.id);
      toast({ title: "Meta atualizada! ✏️" });
    } else {
      await supabase.from("goals").insert({ ...payload, user_id: user.id });
      toast({ title: "Meta criada! 🎯" });
    }
    setForm(emptyForm);
    setEditingGoal(null);
    setDialogOpen(false);
    fetchGoals();
  };

  const addToGoalValue = async (id: string, addAmount: number, currentValue: number, target: number) => {
    const newValue = currentValue + addAmount;
    const status = newValue >= target ? "completed" : "active";
    await supabase.from("goals").update({ current_value: newValue, status }).eq("id", id);
    if (status === "completed") toast({ title: "Meta concluída! 🏆" });
    else toast({ title: `Progresso adicionado!` });
    fetchGoals();
    // Update the selected goal in detail sheet
    setSelectedGoal(prev => prev?.id === id ? { ...prev, current_value: newValue, status } : prev);
  };

  const toggleMain = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await supabase.from("goals").update({ is_main: false }).eq("user_id", user!.id);
    await supabase.from("goals").update({ is_main: true }).eq("id", id);
    fetchGoals();
  };

  const deleteGoal = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await supabase.from("goals").delete().eq("id", id);
    fetchGoals();
  };

  const mainGoal = goals.find((g) => g.is_main);
  const filtered = filter === "all" ? goals : goals.filter((g) => g.category === filter);
  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const rate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const getValueLabel = (goal: Goal) => {
    const type = typeConfig[goal.goal_type] || typeConfig.custom;
    return type.format;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PlanLimitBanner resource="goals" currentCount={goals.length} resourceLabel="metas" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Target className="h-6 w-6 text-primary" /> Metas</h1>
          <p className="text-sm text-muted-foreground mt-1">Defina objetivos e acompanhe seu progresso</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingGoal(null); }}>
          <DialogTrigger asChild><Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" /> Nova Meta</Button></DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle>{editingGoal ? "Editar Meta" : "Criar Meta"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary border-border" placeholder="Ex: Juntar R$10.000, Correr 30 dias" /></div>
              <div className="space-y-2"><Label>Descrição <span className="text-muted-foreground">(opcional)</span></Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-secondary border-border" placeholder="Detalhes sobre sua meta" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Categoria</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(catConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Tipo de meta</Label>
                  <Select value={form.goal_type} onValueChange={(v) => setForm({ ...form, goal_type: v })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">💰 Financeira (R$)</SelectItem>
                      <SelectItem value="habit">🔥 Hábito (dias)</SelectItem>
                      <SelectItem value="task">✅ Tarefas (quantidade)</SelectItem>
                      <SelectItem value="custom">🎯 Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>
                    {form.goal_type === "financial" ? "Valor alvo (R$)" :
                     form.goal_type === "habit" ? "Dias alvo" :
                     form.goal_type === "task" ? "Quantidade de tarefas" :
                     "Valor alvo"}
                  </Label>
                  <Input type="number" value={form.target_value} onChange={(e) => setForm({ ...form, target_value: e.target.value })} className="bg-secondary border-border"
                    placeholder={form.goal_type === "financial" ? "10000" : form.goal_type === "habit" ? "30" : "10"} />
                </div>
                <div className="space-y-2"><Label>Prazo</Label><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="bg-secondary border-border" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Prioridade</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>XP</Label><Input type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: e.target.value })} className="bg-secondary border-border" /></div>
              </div>
              <Button onClick={saveGoal} className="w-full">{editingGoal ? "Salvar Alterações" : "Criar Meta"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center"><p className="text-2xl font-bold text-foreground">{goals.filter((g) => g.status === "active").length}</p><p className="text-xs text-muted-foreground">Ativas</p></div>
        <div className="rounded-xl border border-border bg-card p-4 text-center"><p className="text-2xl font-bold text-primary">{completedGoals}</p><p className="text-xs text-muted-foreground">Concluídas</p></div>
        <div className="rounded-xl border border-border bg-card p-4 text-center"><p className="text-2xl font-bold text-foreground">{rate}%</p><p className="text-xs text-muted-foreground">Taxa de conclusão</p></div>
        <div className="rounded-xl border border-border bg-card p-4 text-center"><p className="text-2xl font-bold text-foreground">{goals.filter((g) => g.status === "delayed").length}</p><p className="text-xs text-muted-foreground">Atrasadas</p></div>
      </div>

      {/* Main goal */}
      {mainGoal && (() => {
        const fmt = getValueLabel(mainGoal);
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-primary/30 bg-primary/5 p-6 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => openDetail(mainGoal)}>
            <div className="flex items-center gap-2 mb-2"><Trophy className="h-5 w-5 text-primary" /><span className="text-sm font-semibold text-primary">META PRINCIPAL</span></div>
            <h2 className="text-xl font-bold text-foreground">{mainGoal.name}</h2>
            <Progress value={mainGoal.target_value > 0 ? (mainGoal.current_value / mainGoal.target_value) * 100 : 0} className="h-3 mt-3" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{fmt(mainGoal.current_value)} / {fmt(mainGoal.target_value)}</span>
              {mainGoal.deadline && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(mainGoal.deadline).toLocaleDateString("pt-BR")}</span>}
            </div>
          </motion.div>
        );
      })()}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[["all", "Todas"], ...Object.entries(catConfig).map(([k, v]) => [k, v.label])].map(([k, v]) => (
          <Button key={k} variant={filter === k ? "default" : "outline"} size="sm" onClick={() => setFilter(k)}>{v}</Button>
        ))}
      </div>

      {/* Goals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((goal) => {
          const pct = goal.target_value > 0 ? Math.round((goal.current_value / goal.target_value) * 100) : 0;
          const fmt = getValueLabel(goal);
          const cat = catConfig[goal.category] || catConfig.personal;
          const type = typeConfig[goal.goal_type] || typeConfig.custom;
          return (
            <motion.div key={goal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-card p-5 group hover:border-primary/20 transition-colors cursor-pointer"
              onClick={() => openDetail(goal)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{goal.name}</h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-xs gap-1"><span className={cat.color}>{cat.icon}</span>{cat.label}</Badge>
                    <Badge variant="outline" className="text-xs">{type.label}</Badge>
                    <Badge className={`text-xs ${statusColors[goal.status]}`}>{goal.status === "active" ? "Ativa" : goal.status === "completed" ? "Concluída" : "Atrasada"}</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!goal.is_main && <button onClick={(e) => toggleMain(e, goal.id)} className="text-muted-foreground hover:text-primary" title="Definir como principal"><Trophy className="h-4 w-4" /></button>}
                  <button onClick={(e) => openEdit(e, goal)} className="text-muted-foreground hover:text-primary" title="Editar meta"><Pencil className="h-4 w-4" /></button>
                  <button onClick={(e) => deleteGoal(e, goal.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <Progress value={pct} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{fmt(goal.current_value)} / {fmt(goal.target_value)}</span>
                <span>{pct}% • {goal.xp_reward} XP</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12 text-muted-foreground"><Target className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>Nenhuma meta criada ainda.</p></div>
      )}

      {/* Detail Sheet */}
      <GoalDetailSheet goal={selectedGoal} open={detailOpen} onOpenChange={setDetailOpen} onAddValue={addToGoalValue} />
    </div>
  );
}
