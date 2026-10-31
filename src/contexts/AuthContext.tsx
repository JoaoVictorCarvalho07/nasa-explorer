import { createContext, useContext, useEffect, useState } from 'react';
import * as auth from '../services/auth';
import { supabase } from '../services/supabase';

type AuthContextType = {
  usuario: auth.Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (email: string, senha: string) => Promise<boolean>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<auth.Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    auth.sessaoAtual().then((u) => {
      setUsuario(u);
      setCarregando(false);
    });

    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      const u = sessao?.user;
      setUsuario(u ? { id: u.id, email: u.email ?? '' } : null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function entrar(email: string, senha: string) {
    setUsuario(await auth.entrar(email, senha));
  }

  // retorna false quando precisa confirmar o e-mail antes de entrar
  async function cadastrar(email: string, senha: string) {
    const u = await auth.cadastrar(email, senha);
    if (u) setUsuario(u);
    return u !== null;
  }

  async function sair() {
    await auth.sair();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, cadastrar, sair }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
