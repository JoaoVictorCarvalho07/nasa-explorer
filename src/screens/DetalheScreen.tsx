import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Estrelas } from '../components/Estrelas';
import { ErrorView, LoadingView } from '../components/StateViews';
import { cores } from '../components/theme';
import { useFavoritos } from '../contexts/FavoritosContext';
import { AppStackParams } from '../navigation/types';
import { buscarDetalhe, NasaDetalhe } from '../services/nasa';

type Props = NativeStackScreenProps<AppStackParams, 'Detalhe'>;

export default function DetalheScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [item, setItem] = useState<NasaDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const { ehFavorito, alternarFavorito, notaDe, marcarVisto, desmarcarVisto } = useFavoritos();

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const d = await buscarDetalhe(id);
      setItem(d);
      navigation.setOptions({ title: d.titulo });
    } catch {
      setErro('Não foi possível carregar os detalhes.');
    } finally {
      setCarregando(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (carregando) return <LoadingView message="Carregando detalhes..." />;
  if (erro || !item) return <ErrorView message={erro ?? 'Erro'} onRetry={carregar} />;

  const favorito = ehFavorito(item.id);
  const nota = notaDe(item.id);

  return (
    <ScrollView style={s.tela} contentContainerStyle={{ paddingBottom: 32 }}>
      {item.imagemGrande ? (
        <Image source={{ uri: item.imagemGrande }} style={s.img} resizeMode="contain"
          accessible accessibilityRole="image" accessibilityLabel={`Imagem: ${item.titulo}`} />
      ) : (
        <View style={[s.img, s.semImagem]}><Text style={s.fraco}>Sem imagem</Text></View>
      )}

      <View style={s.conteudo}>
        <Text style={s.titulo} accessibilityRole="header">{item.titulo}</Text>
        <Text style={s.fraco}>
          {item.centro ? `Centro: ${item.centro}` : ''}
          {item.data ? `  •  ${new Date(item.data).toLocaleDateString('pt-BR')}` : ''}
        </Text>

        <Pressable
          style={[s.botao, favorito && s.botaoAtivo]}
          onPress={() => alternarFavorito(item)}
          accessibilityRole="button"
          accessibilityLabel={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          accessibilityState={{ selected: favorito }}
        >
          <Text style={s.botaoTexto}>{favorito ? '♥ Favorito' : '♡ Favoritar'}</Text>
        </Pressable>

        <View style={s.caixa}>
          <Text style={s.subtitulo}>{nota ? 'Você já viu esta imagem' : 'Marcar como vista'}</Text>
          <Estrelas nota={nota} onChange={(n) => marcarVisto(item, n)} />
          {nota > 0 && (
            <Pressable onPress={() => desmarcarVisto(item.id)} style={{ paddingVertical: 10 }}
              accessibilityRole="button" accessibilityLabel="Desmarcar como vista" accessibilityState={{ selected: true }}>
              <Text style={{ color: cores.erro }}>Desmarcar</Text>
            </Pressable>
          )}
        </View>

        {item.descricao !== '' && <Text style={s.descricao}>{item.descricao}</Text>}

        {item.palavras.length > 0 && (
          <View style={s.tags}>
            {item.palavras.slice(0, 10).map((p) => (
              <Text key={p} style={s.tag}>{p}</Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  img: { width: '100%', aspectRatio: 1, backgroundColor: '#000' },
  semImagem: { alignItems: 'center', justifyContent: 'center' },
  conteudo: { padding: 16, gap: 12 },
  titulo: { color: cores.texto, fontSize: 22, fontWeight: '700' },
  subtitulo: { color: cores.texto, fontWeight: '600' },
  fraco: { color: cores.textoFraco },
  botao: { borderWidth: 1, borderColor: cores.primaria, borderRadius: 8, padding: 12, alignItems: 'center', minHeight: 44 },
  botaoAtivo: { backgroundColor: cores.primaria },
  botaoTexto: { color: cores.texto, fontWeight: '700' },
  caixa: { backgroundColor: cores.card, borderRadius: 8, padding: 12, gap: 4 },
  descricao: { color: cores.texto, lineHeight: 22 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { color: cores.textoFraco, backgroundColor: cores.card, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
});
