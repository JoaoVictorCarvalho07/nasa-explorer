import React from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ItemCard } from '../components/ItemCard';
import { EmptyView, LoadingView } from '../components/StateViews';
import { cores } from '../components/theme';
import { useFavoritos } from '../contexts/FavoritosContext';
import { AppStackParams } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParams, 'Favoritos'>;

export default function FavoritosScreen({ navigation }: Props) {
  const { favoritos, carregando } = useFavoritos();
  const { width } = useWindowDimensions();
  const colunas = width < 600 ? 2 : width < 900 ? 3 : 4;

  if (carregando) return <LoadingView />;

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        key={colunas}
        numColumns={colunas}
        contentContainerStyle={{ padding: 6, flexGrow: 1, width: '100%', maxWidth: 1100, alignSelf: 'center' }}
        renderItem={({ item }) => (
          <ItemCard item={item} favorito onPress={() => navigation.navigate('Detalhe', { id: item.id })} />
        )}
        ListEmptyComponent={<EmptyView message="Você ainda não tem favoritos. Toque no coração na tela de detalhes." />}
      />
    </View>
  );
}
