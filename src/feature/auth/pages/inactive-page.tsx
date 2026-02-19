import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const InactivePage = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeout = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 5000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4 text-center">
          <h1 className="text-xl font-semibold">Sessão expirada por inatividade</h1>
          <p className="text-sm text-muted-foreground">
            Você ficou mais de 5 segundos sem interagir. Para sua segurança, volte ao login.
          </p>
          <Button onClick={() => navigate("/login", { replace: true })} className="w-full">
            Voltar para o login
          </Button>
          <p className="text-xs text-muted-foreground">Redirecionando em {seconds}s</p>
        </CardContent>
      </Card>
    </div>
  );
};
