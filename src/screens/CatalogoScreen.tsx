import React, { useLayoutEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ItemCard } from '../components/ItemCard';
import { ErrorView, LoadingView } from '../components/StateViews';
import { cores } from '../components/theme';
import { useAuth } from '../contexts/AuthContext';
import { useFavoritos } from '../contexts/FavoritosContext';
import { useCatalogo } from '../hooks/useCatalogo';
import { AppStackParams } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParams, 'Catalogo'>;

export default function CatalogoScreen({ navigation }: Props) {
  const { itens, carregando, atualizando, erro, proximaPagina, atualizar, tentarNovamente } = useCatalogo('galaxy');
  const { ehFavorito } = useFavoritos();
  const { sair } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={sair} hitSlop={10} accessibilityRole="button" accessibilityLabel="Sair da conta">
          <Text style={{ color: cores.primaria, fontWeight: '700' }}>Sair</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  if (carregando && itens.length === 0) return <LoadingView message="Carregando imagens..." />;
  if (erro && itens.length === 0) return <ErrorView message={erro} onRetry={tentarNovamente} />;

  return (
    <View style={s.tela}>
      <View style={s.menu}>
        <BotaoMenu texto="Buscar" onPress={() => navigation.navigate('Busca')} />
        <BotaoMenu texto="Favoritos" onPress={() => navigation.navigate('Favoritos')} />
        <BotaoMenu texto="Vistos" onPress={() => navigation.navigate('Vistos')} />
      </View>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 6 }}
        renderItem={({ item }) => (
          <ItemCard item={item} favorito={ehFavorito(item.id)} onPress={() => navigation.navigate('Detalhe', { id: item.id })} />
        )}
        onEndReached={proximaPagina}
        onEndReachedThreshold={0.5}
        refreshing={atualizando}
        onRefresh={atualizar}
        ListFooterComponent={
          erro ? (
            <ErrorView message={erro} onRetry={tentarNovamente} />
          ) : carregando ? (
            <ActivityIndicator style={{ margin: 16 }} color={cores.primaria} accessibilityLabel="Carregando mais" />
          ) : null
        }
      />
    </View>
  );
}

function BotaoMenu({ texto, onPress }: { texto: string; onPress: () => void }) {
  return (
    <Pressable style={s.botao} onPress={onPress} accessibilityRole="button" accessibilityLabel={`Abrir ${texto}`}>
      <Text style={s.botaoTexto}>{texto}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  menu: { flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 0 },
  botao: { flex: 1, backgroundColor: cores.card, borderRadius: 8, paddingVertical: 12, alignItems: 'center', minHeight: 44, borderWidth: 1, borderColor: cores.borda },
  botaoTexto: { color: cores.texto, fontWeight: '600' },
});
