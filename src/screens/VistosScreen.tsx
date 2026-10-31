import React from 'react';
import { FlatList, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Estrelas } from '../components/Estrelas';
import { ItemLinha } from '../components/ItemLinha';
import { EmptyView, LoadingView } from '../components/StateViews';
import { cores } from '../components/theme';
import { useFavoritos } from '../contexts/FavoritosContext';
import { AppStackParams } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParams, 'Vistos'>;

export default function VistosScreen({ navigation }: Props) {
  const { vistos, carregando } = useFavoritos();

  if (carregando) return <LoadingView />;

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <FlatList
        data={vistos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1, width: '100%', maxWidth: 720, alignSelf: 'center' }}
        renderItem={({ item }) => (
          <ItemLinha item={item} onPress={() => navigation.navigate('Detalhe', { id: item.id })}>
            <Estrelas nota={item.nota} />
          </ItemLinha>
        )}
        ListEmptyComponent={<EmptyView message="Nenhuma imagem marcada como vista ainda." />}
      />
    </View>
  );
}
