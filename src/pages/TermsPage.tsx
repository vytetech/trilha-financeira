import { motion } from "framer-motion";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function TermsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 glass-strong border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold gradient-text">TRILHA</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(from)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {from === "/signup" ? "Voltar ao cadastro" : "Voltar ao início"}
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Termos de Uso
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Última atualização:{" "}
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                1. Aceitação dos Termos
              </h2>
              <p className="leading-relaxed">
                Ao acessar ou utilizar a plataforma TRILHA, desenvolvida e
                operada pela{" "}
                <strong className="text-foreground">VyteTech</strong>, você
                concorda com estes Termos de Uso em sua totalidade.
              </p>
              <p className="leading-relaxed mt-3">
                Estes Termos constituem um acordo legal vinculante entre você
                ("Usuário") e a VyteTech ("Empresa"). A utilização contínua da
                plataforma após alterações implica aceitação das novas
                condições.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                2. Descrição do Serviço
              </h2>
              <p className="leading-relaxed">
                O TRILHA é uma plataforma SaaS de evolução pessoal gamificada
                que oferece:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1.5">
                <li>Gerenciamento de tarefas e projetos em formato Kanban</li>
                <li>Acompanhamento de hábitos com sistema de streaks e XP</li>
                <li>Definição e acompanhamento de metas gamificadas</li>
                <li>
                  Controle financeiro com receitas, despesas e cartões de
                  crédito
                </li>
                <li>
                  Gestão de portfólio de investimentos com integração à API
                  brapi
                </li>
                <li>Planejamento de sonhos com metas financeiras</li>
                <li>Relatórios de desempenho e exportação em PDF/Excel</li>
                <li>Ranking global e sistema de conquistas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                3. Cadastro e Conta
              </h2>
              <p className="leading-relaxed">
                Para utilizar o TRILHA, é necessário criar uma conta com
                informações verdadeiras. Você é responsável por:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1.5">
                <li>
                  Manter a confidencialidade de suas credenciais de acesso
                </li>
                <li>Todas as atividades realizadas em sua conta</li>
                <li>
                  Notificar imediatamente a VyteTech em caso de uso não
                  autorizado
                </li>
                <li>Manter seus dados cadastrais atualizados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                4. Planos e Pagamentos
              </h2>
              <h3 className="font-medium text-foreground mt-4 mb-2">
                4.1 Planos disponíveis
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-foreground">Plano Free:</strong>{" "}
                  gratuito, com limitações de uso
                </li>
                <li>
                  <strong className="text-foreground">Plano Pro:</strong> R$
                  19,90/mês ou R$ 199,90/ano
                </li>
                <li>
                  <strong className="text-foreground">Plano Ultimate:</strong>{" "}
                  R$ 39,90/mês ou R$ 399,90/ano
                </li>
              </ul>
              <h3 className="font-medium text-foreground mt-4 mb-2">
                4.2 Cobrança
              </h3>
              <p className="leading-relaxed">
                Pagamentos processados com segurança pela{" "}
                <strong className="text-foreground">Stripe</strong>. Ao assinar,
                você autoriza cobrança recorrente no ciclo escolhido (mensal ou
                anual).
              </p>
              <h3 className="font-medium text-foreground mt-4 mb-2">
                4.3 Cancelamento
              </h3>
              <p className="leading-relaxed">
                Cancele a qualquer momento em Configurações → Plano → Gerenciar.
                O acesso continua até o final do período pago.
              </p>
              <h3 className="font-medium text-foreground mt-4 mb-2">
                4.4 Reembolsos
              </h3>
              <p className="leading-relaxed">
                Não oferecemos reembolsos proporcionais. Em casos de falha
                técnica comprovada, a VyteTech poderá conceder créditos a seu
                critério.
              </p>
              <h3 className="font-medium text-foreground mt-4 mb-2">
                4.5 Inadimplência
              </h3>
              <p className="leading-relaxed">
                Em caso de falha no pagamento, a conta é rebaixada para o Plano
                Free. Seus dados são preservados.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                5. Uso Aceitável
              </h2>
              <p className="leading-relaxed">
                Ao utilizar o TRILHA, você concorda em NÃO:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1.5">
                <li>Violar leis ou regulamentos aplicáveis</li>
                <li>Tentar acessar dados de outros usuários</li>
                <li>Realizar engenharia reversa da plataforma</li>
                <li>Usar bots ou scripts automatizados</li>
                <li>Compartilhar sua conta com terceiros</li>
                <li>Usar o serviço para fins ilegais ou fraudulentos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                6. Integração com Terceiros
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-foreground">Supabase:</strong> banco
                  de dados e autenticação
                </li>
                <li>
                  <strong className="text-foreground">Stripe:</strong>{" "}
                  processamento de pagamentos
                </li>
                <li>
                  <strong className="text-foreground">
                    brapi (brapi.dev):
                  </strong>{" "}
                  cotações de ações, FIIs, ETFs e criptomoedas. Dados meramente
                  informativos, não constituem recomendação de investimento.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                7. Propriedade Intelectual
              </h2>
              <p className="leading-relaxed">
                Todo o conteúdo da plataforma TRILHA é propriedade da VyteTech.
                Os dados inseridos pelo Usuário permanecem de sua propriedade.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                8. Isenção de Responsabilidade
              </h2>
              <p className="leading-relaxed">
                O TRILHA é fornecido "como está". A VyteTech não se
                responsabiliza por perda de dados, decisões financeiras tomadas
                com base na plataforma ou danos indiretos.
              </p>
              <p className="leading-relaxed mt-3">
                <strong className="text-foreground">
                  Os dados financeiros exibidos são exclusivamente informativos
                  e não constituem aconselhamento financeiro.
                </strong>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                9. Lei Aplicável
              </h2>
              <p className="leading-relaxed">
                Estes Termos são regidos pelas leis da República Federativa do
                Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                10. Contato
              </h2>
              <ul className="list-none space-y-1.5">
                <li>
                  <strong className="text-foreground">Empresa:</strong> VyteTech
                </li>
                <li>
                  <strong className="text-foreground">Produto:</strong> TRILHA
                </li>
                <li>
                  <strong className="text-foreground">E-mail:</strong>{" "}
                  trilhaapp@gmail.com
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Veja também nossa{" "}
              <Link
                to="/privacy"
                state={{ from: from }}
                className="text-primary hover:underline"
              >
                Política de Privacidade
              </Link>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(from)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {from === "/signup" ? "Voltar ao cadastro" : "Voltar ao início"}
            </Button>
          </div>
        </motion.div>
      </div>

      <footer className="py-6 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold gradient-text">TRILHA</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Termos de Uso
            </Link>
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Política de Privacidade
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TRILHA · VyteTech. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
