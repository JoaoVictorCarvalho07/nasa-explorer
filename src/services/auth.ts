import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { supabase } from './supabase';

export type Usuario = { id: string; email: string };

const CHAVE_SESSAO = '@nasa/sessao';
const CHAVE_USUARIOS = '@nasa/usuarios';

async function hashSenha(email: string, senha: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, email + ':' + senha);
}

async function lerUsuariosLocais(): Promise<Record<string, string>> {
  const raw = await AsyncStorage.getItem(CHAVE_USUARIOS);
  return raw ? JSON.parse(raw) : {};
}

export async function sessaoAtual(): Promise<Usuario | null> {
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const u = data.session?.user;
    return u ? { id: u.id, email: u.email ?? '' } : null;
  }
  const raw = await AsyncStorage.getItem(CHAVE_SESSAO);
  return raw ? JSON.parse(raw) : null;
}

export async function entrar(email: string, senha: string): Promise<Usuario> {
  email = email.trim().toLowerCase();
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error || !data.user) throw new Error('E-mail ou senha inválidos');
    return { id: data.user.id, email };
  }
  const usuarios = await lerUsuariosLocais();
  if (usuarios[email] !== (await hashSenha(email, senha))) throw new Error('E-mail ou senha inválidos');
  const usuario = { id: email, email };
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
  return usuario;
}

export async function cadastrar(email: string, senha: string): Promise<Usuario | null> {
  email = email.trim().toLowerCase();
  if (!email.includes('@') || senha.length < 6) throw new Error('Informe um e-mail válido e senha com 6+ caracteres');
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({ email, password: senha });
    if (error) throw new Error('Não foi possível criar a conta');
    // se a confirmação por e-mail estiver ligada não vem sessão
    if (!data.session || !data.user) return null;
    return { id: data.user.id, email };
  }
  const usuarios = await lerUsuariosLocais();
  if (usuarios[email]) throw new Error('Não foi possível criar a conta');
  usuarios[email] = await hashSenha(email, senha);
  await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
  const usuario = { id: email, email };
  await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
  return usuario;
}

export async function sair() {
  if (supabase) await supabase.auth.signOut();
  await AsyncStorage.removeItem(CHAVE_SESSAO);
}
