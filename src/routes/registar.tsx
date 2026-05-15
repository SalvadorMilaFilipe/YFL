import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/registar")({
  head: () => ({ meta: [{ title: "Criar conta — Literancia Financeira Jovem" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/painel" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Capturar valores atuais para evitar perdas de estado
    const currentEmail = email;
    const currentPassword = password;
    const currentUsername = username;

    console.log("Iniciando registo para:", currentEmail);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: currentEmail,
      password: currentPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/painel`,
        data: { username: currentUsername },
      },
    });

    if (signUpError) {
      setLoading(false);
      toast.error(signUpError.message);
      return;
    }

    // Inserir na tabela 'perfis'
    if (signUpData.user) {
      console.log("Inserindo na tabela perfis...");
      const { error: profileError } = await supabase
        .from('perfis')
        .insert({ 
          id: signUpData.user.id, 
          username: currentUsername, 
          email: currentEmail,
          password: currentPassword 
        } as any);

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        toast.error("Erro ao gravar dados na tabela perfis.");
      } else {
        console.log("Perfil criado com sucesso!");
      }
    }

    setLoading(false);
    toast.success("Conta criada com sucesso!");
    navigate({ to: "/painel" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary to-accent px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription>Começa a tua jornada financeira.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de utilizador</Label>
              <Input id="username" required minLength={2} value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "A criar conta..." : "Criar conta"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Já tens conta?{" "}
              <Link to="/" className="font-medium text-primary hover:underline">
                Entra aqui
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
