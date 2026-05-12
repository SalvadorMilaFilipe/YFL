import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Literancia Financeira Jovem - Ginestal Machado" },
      { name: "description", content: "App de Literancia financeira para jovens adultos. Aprende a poupar, investir e gerir o teu dinheiro." },
      { property: "og:title", content: "Literancia Financeira Jovem" },
      { property: "og:description", content: "Aprende a gerir o teu dinheiro." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex h-20 w-auto items-center justify-center">
          <img src="/LogoGinestal.png" alt="Logo Ginestal Machado" className="h-20 w-auto object-contain" />
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Literancia Financeira Jovem
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
          Aprende a gerir o teu dinheiro.
        </p>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Literancia financeira simples, prática e feita para ti.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="px-8">
            <Link to="/registar">Criar conta</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8">
            <Link to="/entrar">Entrar</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
