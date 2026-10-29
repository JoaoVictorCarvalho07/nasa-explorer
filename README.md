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

## Supabase (bônus de nuvem e login real)

1. Crie um projeto em supabase.com.
2. No SQL Editor rode o arquivo `supabase/schema.sql` (cria as tabelas `favoritos` e `vistos` com RLS).
3. Em Project Settings > API copie a URL e a anon key para o `.env`.
4. Reinicie o Expo (`npx expo start -c`).

## Estrutura

```
src/
  components/   ItemCard, ItemLinha, Estrelas, telas de loading/erro
  contexts/     AuthContext e FavoritosContext
  hooks/        useCatalogo (paginação)
  navigation/   stacks de login e do app
  screens/      Login, Catalogo, Detalhe, Busca, Favoritos, Vistos
  services/     nasa (axios), auth, dados, supabase
supabase/       schema.sql
```
