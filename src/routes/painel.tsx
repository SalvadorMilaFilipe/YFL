import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, LogOut, Trophy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/painel")({
  head: () => ({ meta: [{ title: "Painel — Literancia Financeira Jovem" }] }),
  component: Dashboard,
});

type Perfil = { username: string; nivel: string; pontos: number };

function Dashboard() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/entrar" });
        return;
      }
      const { data, error } = await supabase
        .from("perfis")
        .select("username, nivel, pontos")
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
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/LogoGinestal.png" alt="Logo" className="h-10 w-auto object-contain" />
            <span className="text-lg font-semibold">Literancia Financeira Jovem</span>
          </div>
          <Button variant="ghost" size="sm" onClick={sair}>
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        {loading ? (
          <p className="text-muted-foreground">A carregar...</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Olá, <span className="text-primary">{perfil?.username ?? "amigo"}</span> 👋
            </h1>
            <p className="mt-2 text-muted-foreground">
              Bem-vindo de volta ao teu painel financeiro.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Nível atual</CardTitle>
                  <Trophy className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{perfil?.nivel ?? "iniciante"}</div>
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pontos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{perfil?.pontos ?? 0}</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
