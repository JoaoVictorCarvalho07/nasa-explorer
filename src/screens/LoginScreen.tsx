import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { cores } from '../components/theme';
import { useAuth } from '../contexts/AuthContext';
import { usaNuvem } from '../services/supabase';

export default function LoginScreen() {
  const { entrar, cadastrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modoCadastro, setModoCadastro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function enviar() {
    setMensagem('');
    if (!email || !senha) {
      setMensagem('Preencha e-mail e senha');
      return;
    }
    setCarregando(true);
    try {
      if (modoCadastro) {
        const entrou = await cadastrar(email, senha);
        if (!entrou) setMensagem('Conta criada! Confirme pelo link no seu e-mail e depois entre.');
      } else {
        await entrar(email, senha);
      }
    } catch (e: any) {
      setMensagem(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: cores.fundo }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Text style={s.logo} accessibilityRole="header">NASA Explorer</Text>
        <Text style={s.sub}>{modoCadastro ? 'Crie sua conta' : 'Entre para ver o catálogo'}</Text>

        <TextInput
          style={s.input}
          placeholder="E-mail"
          placeholderTextColor={cores.textoFraco}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="E-mail"
        />
        <TextInput
          style={s.input}
          placeholder="Senha"
          placeholderTextColor={cores.textoFraco}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          accessibilityLabel="Senha"
        />

        {mensagem !== '' && <Text style={s.msg} accessibilityLiveRegion="polite">{mensagem}</Text>}

        <Pressable style={s.botao} onPress={enviar} disabled={carregando} accessibilityRole="button"
          accessibilityLabel={modoCadastro ? 'Cadastrar' : 'Entrar'} accessibilityState={{ busy: carregando }}>
          {carregando ? <ActivityIndicator color="#000" /> : <Text style={s.botaoTexto}>{modoCadastro ? 'Cadastrar' : 'Entrar'}</Text>}
        </Pressable>

        <Pressable style={s.link} onPress={() => { setModoCadastro(!modoCadastro); setMensagem(''); }} accessibilityRole="button">
          <Text style={s.linkTexto}>{modoCadastro ? 'Já tenho conta' : 'Não tem conta? Cadastre-se'}</Text>
        </Pressable>

        <Text style={s.modo}>{usaNuvem ? 'Conta na nuvem (Supabase)' : 'Modo local (dados só neste aparelho)'}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 12 },
  logo: { color: cores.texto, fontSize: 32, fontWeight: '800', textAlign: 'center' },
  sub: { color: cores.textoFraco, textAlign: 'center', marginBottom: 12 },
  input: { backgroundColor: cores.card, color: cores.texto, borderRadius: 8, padding: 14, borderWidth: 1, borderColor: cores.borda },
  msg: { color: cores.erro, textAlign: 'center' },
  botao: { backgroundColor: cores.primaria, padding: 14, borderRadius: 8, alignItems: 'center', minHeight: 48, justifyContent: 'center' },
  botaoTexto: { color: '#000', fontWeight: '700', fontSize: 16 },
  link: { padding: 12, alignItems: 'center' },
  linkTexto: { color: cores.primaria },
  modo: { color: cores.textoFraco, textAlign: 'center', fontSize: 12, marginTop: 16 },
});
