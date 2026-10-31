import { FlatList, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ItemCard } from '../components/ItemCard';
import { EmptyView, LoadingView } from '../components/StateViews';
import { cores } from '../components/theme';
import { useFavoritos } from '../contexts/FavoritosContext';
import { AppStackParams } from '../navigation/types';

type Props = NativeStackScreenProps<AppStackParams, 'Favoritos'>;

export default function FavoritosScreen({ navigation }: Props) {
  const { favoritos, carregando } = useFavoritos();

  if (carregando) return <LoadingView />;

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 6, flexGrow: 1 }}
        renderItem={({ item }) => (
          <ItemCard item={item} favorito onPress={() => navigation.navigate('Detalhe', { id: item.id })} />
        )}
        ListEmptyComponent={<EmptyView message="Você ainda não tem favoritos. Toque no coração na tela de detalhes." />}
      />
    </View>
  );
}
