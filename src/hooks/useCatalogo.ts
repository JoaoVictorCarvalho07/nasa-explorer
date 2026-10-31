import { useCallback, useEffect, useState } from 'react';
import { buscarImagens, NasaItem } from '../services/nasa';

export function useCatalogo(termo: string) {
  const [itens, setItens] = useState<NasaItem[]>([]);
  const [pagina, setPagina] = useState(1);
  const [temMais, setTemMais] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(
    async (p: number) => {
      setCarregando(true);
      setErro(null);
      try {
        const res = await buscarImagens(termo, p);
        setItens((antigos) => {
          if (p === 1) return res.itens;
          const ids = new Set(antigos.map((i) => i.id));
          return [...antigos, ...res.itens.filter((i) => !ids.has(i.id))];
        });
        setPagina(p);
        setTemMais(res.temMais);
      } catch {
        setErro('Não foi possível carregar as imagens. Verifique sua conexão.');
      } finally {
        setCarregando(false);
        setAtualizando(false);
      }
    },
    [termo]
  );

  useEffect(() => {
    carregar(1);
  }, [carregar]);

  function proximaPagina() {
    if (!carregando && temMais && !erro) carregar(pagina + 1);
  }

  function atualizar() {
    setAtualizando(true);
    carregar(1);
  }

  function tentarNovamente() {
    carregar(itens.length === 0 ? 1 : pagina + 1);
  }

  return { itens, carregando, atualizando, erro, proximaPagina, atualizar, tentarNovamente };
}
