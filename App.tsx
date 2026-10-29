import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { FavoritosProvider } from './src/contexts/FavoritosContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <FavoritosProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </FavoritosProvider>
    </AuthProvider>
  );
}
