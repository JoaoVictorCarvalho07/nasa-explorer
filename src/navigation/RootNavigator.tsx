import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoadingView } from '../components/StateViews';
import { cores } from '../components/theme';
import { useAuth } from '../contexts/AuthContext';
import BuscaScreen from '../screens/BuscaScreen';
import CatalogoScreen from '../screens/CatalogoScreen';
import DetalheScreen from '../screens/DetalheScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import LoginScreen from '../screens/LoginScreen';
import VistosScreen from '../screens/VistosScreen';
import { AppStackParams, AuthStackParams } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParams>();
const AppStack = createNativeStackNavigator<AppStackParams>();

const tema = { ...DarkTheme, colors: { ...DarkTheme.colors, background: cores.fundo, card: cores.card, primary: cores.primaria } };

export default function RootNavigator() {
  const { usuario, carregando } = useAuth();

  if (carregando) return <LoadingView message="Abrindo..." />;

  return (
    <NavigationContainer theme={tema}>
      {usuario ? (
        <AppStack.Navigator>
          <AppStack.Screen name="Catalogo" component={CatalogoScreen} options={{ title: 'NASA Explorer' }} />
          <AppStack.Screen name="Detalhe" component={DetalheScreen} options={{ title: '' }} />
          <AppStack.Screen name="Busca" component={BuscaScreen} />
          <AppStack.Screen name="Favoritos" component={FavoritosScreen} />
          <AppStack.Screen name="Vistos" component={VistosScreen} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
