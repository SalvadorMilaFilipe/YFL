import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, BookOpen, Lightbulb, Wallet, BarChart3, Info } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/painel")({
  head: () => ({ meta: [{ title: "Literacia Financeira — Centro de Conhecimento" }] }),
  component: Dashboard,
});

type Perfil = { username: string };

function Dashboard() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/" });
        return;
      }
      const { data, error } = await supabase
        .from("perfis")
        .select("username")
        .eq("id", session.user.id)
        .maybeSingle();
      if (!active) return;
      if (error) toast.error(error.message);
      setPerfil(data);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [navigate]);

  const sair = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <img src="/LogoGinestal.png" alt="Logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight">Literância Financeira</span>
          </div>
          <Button variant="outline" size="sm" onClick={sair} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground animate-pulse">A carregar os teus conselhos...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Boas-vindas */}
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight">
                Olá, <span className="text-primary">{perfil?.username ?? "Utilizador"}</span> 👋
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                O conhecimento é o teu melhor investimento. Explora os conselhos e guias abaixo para melhorares a tua saúde financeira.
              </p>
            </div>

            {/* Conselhos Rápidos */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                <h2 className="text-2xl font-bold">Conselhos Financeiros</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <Wallet className="h-8 w-8 text-blue-500 mb-2" />
                    <CardTitle>Regra 50/30/20</CardTitle>
                    <CardDescription>O básico da poupança</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    Divide o teu rendimento: 50% para necessidades, 30% para desejos e 20% para poupança ou dívidas. É a forma mais simples de manter o equilíbrio.
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <BarChart3 className="h-8 w-8 text-green-500 mb-2" />
                    <CardTitle>Págate a ti primeiro</CardTitle>
                    <CardDescription>Prioridade máxima</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    Trata a tua poupança como uma conta obrigatória. Assim que receberes, transfere logo uma parte para a poupança antes de começares a gastar.
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <Info className="h-8 w-8 text-purple-500 mb-2" />
                    <CardTitle>Fundo de Emergência</CardTitle>
                    <CardDescription>A tua rede de segurança</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    Tenta juntar o equivalente a 6 meses de despesas básicas num local de fácil acesso. Isto protege-te contra imprevistos como desemprego ou avarias.
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Literacia Financeira */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Guia de Literacia</h2>
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    O que é a Inflação?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A inflação é a subida generalizada dos preços. Com o passar do tempo, o mesmo montante de dinheiro compra menos coisas. Por isso, manter dinheiro "debaixo do colchão" faz com que ele perca valor todos os anos.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    Juros Compostos
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    São juros calculados sobre o capital inicial e também sobre os juros acumulados de períodos anteriores. É a "bola de neve" positiva que faz os investimentos crescerem exponencialmente a longo prazo.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Ativos vs Passivos
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Simplificando: um **Ativo** coloca dinheiro no teu bolso (como ações ou um imóvel arrendado). Um **Passivo** tira dinheiro do teu bolso (como um carro ou dívidas de cartão de crédito).
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                    Diversificação
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    É a regra de "não pôr todos os ovos no mesmo cesto". Ao espalhares o teu dinheiro por diferentes tipos de investimento, reduzes o risco de perderes tudo se um deles correr mal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 py-10 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Literância Financeira Jovem. Desenvolvido para fins educativos.
          </p>
        </div>
      </footer>
    </main>
  );
}
