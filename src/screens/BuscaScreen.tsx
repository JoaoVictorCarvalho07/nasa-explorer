import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ItemLinha } from '../components/ItemLinha';
import { EmptyView, ErrorView } from '../components/StateViews';
import { cores } from '../components/theme';
import { AppStackParams } from '../navigation/types';
import { buscarImagens, NasaItem } from '../services/nasa';

type Props = NativeStackScreenProps<AppStackParams, 'Busca'>;

export default function BuscaScreen({ navigation }: Props) {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<NasaItem[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [buscou, setBuscou] = useState(false);

  async function buscar() {
    if (!termo.trim()) return;
    setCarregando(true);
    setErro(null);
    try {
      const res = await buscarImagens(termo.trim(), 1);
      setResultados(res.itens);
      setBuscou(true);
    } catch {
      setErro('Erro ao buscar. Tente de novo.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={s.tela}>
      <View style={s.barra}>
        <TextInput
          style={s.input}
          value={termo}
          onChangeText={setTermo}
          placeholder="Ex.: moon, apollo, mars"
          placeholderTextColor={cores.textoFraco}
          onSubmitEditing={buscar}
          returnKeyType="search"
          autoCapitalize="none"
          accessibilityLabel="Termo da busca"
        />
        <Pressable style={s.botao} onPress={buscar} accessibilityRole="button" accessibilityLabel="Buscar">
          <Text style={s.botaoTexto}>Buscar</Text>
        </Pressable>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color={cores.primaria} style={{ marginTop: 32 }} accessibilityLabel="Buscando" />
      ) : erro ? (
        <ErrorView message={erro} onRetry={buscar} />
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemLinha item={item} onPress={() => navigation.navigate('Detalhe', { id: item.id })} />}
          ListEmptyComponent={buscou ? <EmptyView message={`Nenhum resultado para "${termo}".`} /> : null}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  barra: { flexDirection: 'row', gap: 8, padding: 12 },
  input: { flex: 1, backgroundColor: cores.card, color: cores.texto, borderRadius: 8, paddingHorizontal: 12, minHeight: 44, borderWidth: 1, borderColor: cores.borda },
  botao: { backgroundColor: cores.primaria, borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', minHeight: 44 },
  botaoTexto: { color: '#000', fontWeight: '700' },
});
