import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { cores } from './theme';

export function LoadingView({ message = 'Carregando...' }: { message?: string }) {
  return (
    <View style={s.center} accessibilityRole="progressbar" accessibilityLabel={message}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={s.text}>{message}</Text>
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={s.center} accessibilityLiveRegion="polite">
      <Text style={s.title}>Algo deu errado</Text>
      <Text style={s.text}>{message}</Text>
      <Pressable style={s.btn} onPress={onRetry} accessibilityRole="button" accessibilityLabel="Tentar novamente">
        <Text style={s.btnText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

export function EmptyView({ message }: { message: string }) {
  return <View style={s.center}><Text style={s.text}>{message}</Text></View>;
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 18, fontWeight: '700', color: cores.texto },
  text: { color: cores.textoFraco, textAlign: 'center' },
  btn: { backgroundColor: cores.primaria, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, minHeight: 44 },
  btnText: { color: '#fff', fontWeight: '700' },
});
