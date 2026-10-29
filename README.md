# NASA Explorer

App de catálogo feito em React Native + Expo para o Somativo 2 de Desenvolvimento Mobile Híbrido (PUCPR).

Usa a API pública [NASA Image and Video Library](https://images-api.nasa.gov) para listar, buscar e ver detalhes de imagens da NASA.

## Como rodar

```bash
npm install
cp .env.example .env
npx expo start
```

## Variáveis de ambiente

- `EXPO_PUBLIC_NASA_API_URL`: endereço da API da NASA
- `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`: projeto do Supabase. Se ficarem vazias, o login e os dados ficam só no aparelho (AsyncStorage).
