import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { NasaItem } from '../services/nasa';
import { cores } from './theme';

type Props = {
  item: NasaItem;
  favorito: boolean;
  onPress: () => void;
};

export function ItemCard({ item, favorito, onPress }: Props) {
  return (
    <Pressable
      style={s.card}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${item.titulo}${favorito ? ', favorito' : ''}. Abrir detalhes`}
    >
      {item.thumb ? (
        <Image source={{ uri: item.thumb }} style={s.img} accessibilityIgnoresInvertColors />
      ) : (
        <View style={[s.img, s.semImagem]}>
          <Text style={s.semImagemTexto}>Sem imagem</Text>
        </View>
      )}
      <View style={s.info}>
        <Text style={s.titulo} numberOfLines={2}>
          {item.titulo}
        </Text>
        {favorito && <Text style={s.coracao}>♥</Text>}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { flex: 1, margin: 6, backgroundColor: cores.card, borderRadius: 10, overflow: 'hidden' },
  img: { width: '100%', aspectRatio: 1 },
  semImagem: { alignItems: 'center', justifyContent: 'center', backgroundColor: cores.borda },
  semImagemTexto: { color: cores.textoFraco },
  info: { flexDirection: 'row', padding: 8, gap: 4 },
  titulo: { flex: 1, color: cores.texto, fontWeight: '600' },
  coracao: { color: '#FF6B81', fontSize: 16 },
});
