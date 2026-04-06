import { motion } from "framer-motion";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function PrivacyPage() {
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
            Política de Privacidade
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
                1. Introdução
              </h2>
              <p className="leading-relaxed">
                A <strong className="text-foreground">VyteTech</strong>,
                responsável pelo produto{" "}
                <strong className="text-foreground">TRILHA</strong>, está
                comprometida com a proteção da privacidade dos seus usuários, em
                conformidade com a{" "}
                <strong className="text-foreground">
                  Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)
                </strong>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                2. Dados que Coletamos
              </h2>
              <h3 className="font-medium text-foreground mt-4 mb-2">
                2.1 Fornecidos por você
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-foreground">Cadastro:</strong> nome
                  completo e e-mail
                </li>
                <li>
                  <strong className="text-foreground">Perfil:</strong>{" "}
                  preferências de moeda e metas de economia
                </li>
                <li>
                  <strong className="text-foreground">Financeiros:</strong>{" "}
                  transações, receitas, despesas e cartões (apenas metadados)
                </li>
                <li>
                  <strong className="text-foreground">Investimentos:</strong>{" "}
                  ativos, quantidades, preços e histórico
                </li>
                <li>
                  <strong className="text-foreground">Produtividade:</strong>{" "}
                  tarefas, hábitos, metas, sonhos e conquistas
                </li>
              </ul>
              <h3 className="font-medium text-foreground mt-4 mb-2">
                2.2 Coletados automaticamente
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Dados de uso e funcionalidades acessadas</li>
                <li>Endereço IP, tipo de navegador e dispositivo</li>
                <li>Tokens de sessão e logs de acesso</li>
              </ul>
              <h3 className="font-medium text-foreground mt-4 mb-2">
                2.3 De terceiros
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-foreground">Stripe:</strong> dados de
                  cobrança e histórico de pagamentos
                </li>
                <li>
                  <strong className="text-foreground">brapi:</strong> cotações
                  consultadas em tempo real (não armazenamos permanentemente)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                3. Como Usamos seus Dados
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Criar e gerenciar sua conta</li>
                <li>Fornecer as funcionalidades do TRILHA</li>
                <li>Processar pagamentos e assinaturas</li>
                <li>Enviar comunicações transacionais</li>
                <li>Calcular XP, níveis, streaks e rankings</li>
                <li>Gerar relatórios personalizados</li>
                <li>
                  Melhorar a plataforma com dados agregados e anonimizados
                </li>
                <li>Cumprir obrigações legais e prevenir fraudes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                4. Compartilhamento de Dados
              </h2>
              <p className="leading-relaxed">
                A VyteTech{" "}
                <strong className="text-foreground">não vende</strong> seus
                dados.
              </p>
              <h3 className="font-medium text-foreground mt-4 mb-2">
                4.1 Provedores de serviço
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-foreground">Supabase:</strong> banco
                  de dados, autenticação e infraestrutura
                </li>
                <li>
                  <strong className="text-foreground">Stripe:</strong>{" "}
                  pagamentos seguros (PCI-DSS). Não armazenamos dados completos
                  de cartão.
                </li>
                <li>
                  <strong className="text-foreground">brapi:</strong> apenas
                  tickers de ativos são enviados para consulta. Nenhum dado
                  pessoal é compartilhado.
                </li>
              </ul>
              <h3 className="font-medium text-foreground mt-4 mb-2">
                4.2 Ranking global
              </h3>
              <p className="leading-relaxed">
                O Ranking exibe publicamente para usuários autenticados: nome,
                nível e XP total. Nenhum dado financeiro é exibido.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                5. Segurança
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Autenticação com tokens JWT (ES256)</li>
                <li>
                  Row Level Security (RLS) — cada usuário acessa só seus dados
                </li>
                <li>Senhas com hash criptográfico</li>
                <li>Comunicação via HTTPS em toda a plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                6. Retenção de Dados
              </h2>
              <p className="leading-relaxed">
                Dados são mantidos enquanto sua conta estiver ativa. Após
                encerramento, excluídos em até{" "}
                <strong className="text-foreground">30 dias</strong>, salvo
                obrigação legal (até 5 anos para dados fiscais).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                7. Seus Direitos (LGPD)
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-foreground">Acesso:</strong> confirmar
                  e acessar seus dados
                </li>
                <li>
                  <strong className="text-foreground">Correção:</strong>{" "}
                  corrigir dados incorretos
                </li>
                <li>
                  <strong className="text-foreground">Exclusão:</strong>{" "}
                  solicitar remoção de dados desnecessários
                </li>
                <li>
                  <strong className="text-foreground">Portabilidade:</strong>{" "}
                  exportar seus dados
                </li>
                <li>
                  <strong className="text-foreground">Revogação:</strong>{" "}
                  retirar consentimento a qualquer momento
                </li>
              </ul>
              <p className="leading-relaxed mt-3">
                Para exercer esses direitos:{" "}
                <strong className="text-foreground">trilhaapp@gmail.com</strong>
                . Respondemos em até 15 dias úteis.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                8. Cookies e Armazenamento
              </h2>
              <p className="leading-relaxed">
                Usamos <strong className="text-foreground">localStorage</strong>{" "}
                para manter sua sessão ativa. Não utilizamos cookies de
                rastreamento ou publicidade.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                9. Contato (DPO)
              </h2>
              <ul className="list-none space-y-1.5">
                <li>
                  <strong className="text-foreground">Empresa:</strong> VyteTech
                </li>
                <li>
                  <strong className="text-foreground">
                    E-mail de privacidade:
                  </strong>{" "}
                  trilhaapp@gmail.com
                </li>
                <li>
                  <strong className="text-foreground">
                    E-mail de suporte:
                  </strong>{" "}
                  trilhaapp@gmail.com
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Veja também nossos{" "}
              <Link
                to="/terms"
                state={{ from: from }}
                className="text-primary hover:underline"
              >
                Termos de Uso
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
