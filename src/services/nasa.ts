import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_NASA_API_URL || 'https://images-api.nasa.gov',
  timeout: 15000,
});

export type NasaItem = {
  id: string;
  titulo: string;
  thumb: string | null;
  data?: string;
};

export type NasaDetalhe = NasaItem & {
  descricao: string;
  centro?: string;
  palavras: string[];
  imagemGrande: string | null;
};

const POR_PAGINA = 24;

function converter(item: any): NasaItem {
  const d = item.data?.[0] ?? {};
  const link = item.links?.find((l: any) => l.render === 'image') ?? item.links?.[0];
  return { id: d.nasa_id, titulo: d.title ?? 'Sem título', thumb: link?.href ?? null, data: d.date_created };
}

export function limparHtml(texto: string) {
  return texto
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export async function buscarImagens(termo: string, pagina: number) {
  const res = await api.get('/search', {
    params: { q: termo, media_type: 'image', page: pagina, page_size: POR_PAGINA },
  });
  const itens: NasaItem[] = res.data.collection.items.map(converter).filter((i: NasaItem) => i.id);
  const temMais = res.data.collection.links?.some((l: any) => l.rel === 'next') ?? false;
  return { itens, temMais };
}

export async function buscarDetalhe(id: string): Promise<NasaDetalhe> {
  const [busca, asset] = await Promise.all([
    api.get('/search', { params: { nasa_id: id } }),
    api.get(`/asset/${encodeURIComponent(id)}`),
  ]);
  const item = busca.data.collection.items[0];
  if (!item) throw new Error('Item não encontrado');
  const d = item.data[0];
  const arquivos: string[] = asset.data.collection.items.map((i: any) => i.href);
  const grande =
    arquivos.find((h) => h.includes('~medium')) ??
    arquivos.find((h) => h.includes('~orig')) ??
    converter(item).thumb;

  return {
    ...converter(item),
    descricao: limparHtml(d.description ?? ''),
    centro: d.center,
    palavras: d.keywords ?? [],
    imagemGrande: grande ? grande.replace('http://', 'https://') : null,
  };
}
