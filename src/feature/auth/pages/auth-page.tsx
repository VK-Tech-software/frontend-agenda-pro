import { Eye, EyeOff, Calendar, Sparkles, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent } from "../../../components/ui/card"
import { Separator } from "../../../components/ui/separator"
import { AuthStore } from "../stores/auth-store"
import { useEmpresaStore } from "../../empresa/stores/empresa-store"
import { useAlert } from "../../../hooks/use-alert"
import { useNavigate } from "react-router-dom"

export default function AuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const { onLogin, loading, isAuthenticated } = AuthStore()
  const { fetchByUserId } = useEmpresaStore();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { showAlert } = useAlert();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleLogin() {
    if (email == "" || password == "") {
      showAlert({
        title: "Falha na autenticação",
        message: "Informe todas as credenciais obrigatórias.",
        type: "destructive",
      });
      return;
    }
    try {
      await onLogin(email, password)

      const user = AuthStore.getState().user

      const company = await fetchByUserId(user!.id)

      if (company) {
        navigate('/dashboard', { replace: true })
        return
      }

      navigate('/empresa/cadastro', { replace: true })

    } catch (error) {
      showAlert({
        title: "Falha na autenticação",
        message: "Erro ao autenticar.",
        type: "destructive",
      });
    }

  }

  const onRegister = () => {
    navigate('/register')
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">

      {/* LEFT */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-md border-slate-200/80 shadow-xl shadow-slate-200/60">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                  <Calendar size={20} />
                </div>
                <span className="text-xl font-semibold">AgendaPro</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                <ShieldCheck size={12} />
                Seguro
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta!</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Entre na sua conta para continuar
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input
                  placeholder="seu@email.com"
                  className="h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="h-11 pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button className="w-full h-11" onClick={handleLogin} disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </div>

            <Separator className="my-6" />

            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Button onClick={onRegister} variant="link" className="px-1 text-emerald-600">
                Registre-se grátis
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex items-center justify-center bg-slate-950 text-white p-12">
        <Card className="bg-transparent border-none shadow-none text-center space-y-6 max-w-lg">
          <CardContent className="space-y-6 justify-center items-center flex-col">
            <div className="mx-auto bg-white/10 p-4 rounded-2xl w-fit">
              <Sparkles size={28} />
            </div>

            <h2 className="text-3xl font-bold text-white">
              Gestão inteligente para seu negócio
            </h2>

            <p className="text-slate-300 text-center">
              Acesse sua agenda, serviços e estoque de qualquer lugar.
              Simplifique sua gestão e foque no crescimento do seu negócio.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
