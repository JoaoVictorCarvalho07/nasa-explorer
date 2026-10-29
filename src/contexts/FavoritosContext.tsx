import React, { createContext, useContext, useEffect, useState } from 'react';
import * as dados from '../services/dados';
import { NasaItem } from '../services/nasa';
import { useAuth } from './AuthContext';

type FavoritosContextType = {
  favoritos: NasaItem[];
  vistos: dados.Visto[];
  carregando: boolean;
  ehFavorito: (id: string) => boolean;
  alternarFavorito: (item: NasaItem) => void;
  notaDe: (id: string) => number;
  marcarVisto: (item: NasaItem, nota: number) => void;
  desmarcarVisto: (id: string) => void;
};

const FavoritosContext = createContext<FavoritosContextType>({} as FavoritosContextType);

export function FavoritosProvider({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  const [favoritos, setFavoritos] = useState<NasaItem[]>([]);
  const [vistos, setVistos] = useState<dados.Visto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    let ativo = true;
    setCarregando(true);
    Promise.all([dados.carregarFavoritos(usuario.id), dados.carregarVistos(usuario.id)])
      .then(([f, v]) => {
        if (!ativo) return;
        setFavoritos(f);
        setVistos(v);
      })
      .catch(() => console.log('erro ao carregar dados salvos'))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [usuario]);

  const ehFavorito = (id: string) => favoritos.some((f) => f.id === id);
  const notaDe = (id: string) => vistos.find((v) => v.id === id)?.nota ?? 0;

  function alternarFavorito(item: NasaItem) {
    if (!usuario) return;
    const simples = { id: item.id, titulo: item.titulo, thumb: item.thumb };
    if (ehFavorito(item.id)) {
      const nova = favoritos.filter((f) => f.id !== item.id);
      setFavoritos(nova);
      dados.removerFavorito(usuario.id, item.id, nova).catch(() => setFavoritos(favoritos));
    } else {
      const nova = [simples, ...favoritos];
      setFavoritos(nova);
      dados.salvarFavorito(usuario.id, simples, nova).catch(() => setFavoritos(favoritos));
    }
  }

  function marcarVisto(item: NasaItem, nota: number) {
    if (!usuario) return;
    const visto = { id: item.id, titulo: item.titulo, thumb: item.thumb, nota };
    const nova = [visto, ...vistos.filter((v) => v.id !== item.id)];
    setVistos(nova);
    dados.salvarVisto(usuario.id, visto, nova).catch(() => setVistos(vistos));
  }

  function desmarcarVisto(id: string) {
    if (!usuario) return;
    const nova = vistos.filter((v) => v.id !== id);
    setVistos(nova);
    dados.removerVisto(usuario.id, id, nova).catch(() => setVistos(vistos));
  }

  return (
    <FavoritosContext.Provider
      value={{ favoritos, vistos, carregando, ehFavorito, alternarFavorito, notaDe, marcarVisto, desmarcarVisto }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

export const useFavoritos = () => useContext(FavoritosContext);
