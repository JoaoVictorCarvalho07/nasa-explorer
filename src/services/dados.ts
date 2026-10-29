import AsyncStorage from '@react-native-async-storage/async-storage';
import { NasaItem } from './nasa';
import { supabase } from './supabase';

export type Visto = NasaItem & { nota: number };

// favoritos e vistos ficam no supabase quando configurado, senão no AsyncStorage
const chave = (userId: string, tipo: string) => `@nasa/${userId}/${tipo}`;

async function lerLocal<T>(userId: string, tipo: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(chave(userId, tipo));
  return raw ? JSON.parse(raw) : [];
}

async function salvarLocal(userId: string, tipo: string, lista: unknown[]) {
  await AsyncStorage.setItem(chave(userId, tipo), JSON.stringify(lista));
}

export async function carregarFavoritos(userId: string): Promise<NasaItem[]> {
  if (supabase) {
    const { data, error } = await supabase.from('favoritos').select('nasa_id, titulo, thumb');
    if (error) throw error;
    return data.map((r) => ({ id: r.nasa_id, titulo: r.titulo, thumb: r.thumb }));
  }
  return lerLocal<NasaItem>(userId, 'favoritos');
}

export async function salvarFavorito(userId: string, item: NasaItem, lista: NasaItem[]) {
  if (supabase) {
    const { error } = await supabase
      .from('favoritos')
      .upsert({ user_id: userId, nasa_id: item.id, titulo: item.titulo, thumb: item.thumb });
    if (error) throw error;
    return;
  }
  await salvarLocal(userId, 'favoritos', lista);
}

export async function removerFavorito(userId: string, id: string, lista: NasaItem[]) {
  if (supabase) {
    const { error } = await supabase.from('favoritos').delete().eq('nasa_id', id);
    if (error) throw error;
    return;
  }
  await salvarLocal(userId, 'favoritos', lista);
}

export async function carregarVistos(userId: string): Promise<Visto[]> {
  if (supabase) {
    const { data, error } = await supabase.from('vistos').select('nasa_id, titulo, thumb, nota');
    if (error) throw error;
    return data.map((r) => ({ id: r.nasa_id, titulo: r.titulo, thumb: r.thumb, nota: r.nota }));
  }
  return lerLocal<Visto>(userId, 'vistos');
}

export async function salvarVisto(userId: string, item: Visto, lista: Visto[]) {
  if (supabase) {
    const { error } = await supabase
      .from('vistos')
      .upsert({ user_id: userId, nasa_id: item.id, titulo: item.titulo, thumb: item.thumb, nota: item.nota });
    if (error) throw error;
    return;
  }
  await salvarLocal(userId, 'vistos', lista);
}

export async function removerVisto(userId: string, id: string, lista: Visto[]) {
  if (supabase) {
    const { error } = await supabase.from('vistos').delete().eq('nasa_id', id);
    if (error) throw error;
    return;
  }
  await salvarLocal(userId, 'vistos', lista);
}
