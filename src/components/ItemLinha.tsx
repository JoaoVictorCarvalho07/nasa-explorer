import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { NasaItem } from '../services/nasa';
import { cores } from './theme';

type Props = { item: NasaItem; onPress: () => void; children?: React.ReactNode };

export function ItemLinha({ item, onPress, children }: Props) {
  return (
    <Pressable style={s.linha} onPress={onPress} accessible accessibilityRole="button" accessibilityLabel={`${item.titulo}. Abrir detalhes`}>
      {item.thumb ? <Image source={{ uri: item.thumb }} style={s.img} /> : <View style={[s.img, { backgroundColor: cores.borda }]} />}
      <View style={{ flex: 1 }}>
        <Text style={s.titulo} numberOfLines={2}>{item.titulo}</Text>
        {children}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 12, padding: 10, marginHorizontal: 12, marginVertical: 4, backgroundColor: cores.card, borderRadius: 8, alignItems: 'center', minHeight: 44 },
  img: { width: 64, height: 64, borderRadius: 6 },
  titulo: { color: cores.texto, fontWeight: '600' },
});
