# Setup Guia: Configurar Supabase para Repertório MVP

## Pré-requisitos

- ✅ Projeto Supabase já criado
- ✅ `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` configurados em `.env` ou `.env.local`
- ✅ Autenticação via Email/Password habilitada em Supabase

## Passo 1: Criar Tabelas via SQL Migration

1. Abra seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **SQL Editor** (lado esquerdo)
3. Clique em **New Query**
4. Copie todo o conteúdo do arquivo [`supabase-migration.sql`](supabase-migration.sql)
5. Cole na janela SQL Editor
6. Clique **Run** (ou Cmd+Enter)

**Resultado esperado:**
- ✅ Tabelas `cards` e `projects` criadas
- ✅ Policies (RLS) criadas e ativas
- ✅ Indexes criados
- ✅ Triggers criados

## Passo 2: Verificar RLS Está Ativado

1. Em Supabase Dashboard, vá para **Authentication > Policies**
2. Selecione table: `cards`
3. Deve listar:
   - ✅ "Users can view own cards" (SELECT)
   - ✅ "Users can create cards" (INSERT)
   - ✅ "Users can update own cards" (UPDATE)
   - ✅ "Users can delete own cards" (DELETE)

4. Selecione table: `projects`
5. Deve listar mesmas policies para projects

**Se RLS não está ativo:**
- Clique em **Enable RLS** (botão no topo da tabela)

## Passo 3: Configurar Variáveis de Ambiente

No seu repositório, atualize `.env.local` (ou crie novo):

```env
VITE_SUPABASE_URL=https://seu-projeto-supabase.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Encontre esses valores em:
- **Dashboard > Project Settings > API**
- Procure por "Project URL" e "anon public"

## Passo 4: Testar Conexão

1. Inicie o app: `npm run dev`
2. Vá para **Profile** (aba 3)
3. Tente fazer **signup** com um email de teste
4. Se suceder:
   - ✅ Autenticação funciona
   - ✅ Conexão com Supabase OK

5. Criar um card de teste:
   - Voltee para **Home**
   - Clique **+** para novo card
   - Preencha dados
   - Clique **Salvar**

6. Verificar se aparece na galeria:
   - ✅ Card foi criado e exibido
   - ✅ Supabase INSERT foi bem-sucedido

## Passo 5: Verificar Isolamento de Usuário

1. **Login com Usuário A**
   ```
   Email: user-a@test.com
   Senha: qualquer-senha-valida
   ```

2. **Criar card**: "Idea from User A"

3. **Logout** e **Verificar localStorage foi limpo**

4. **Login com Usuário B**
   ```
   Email: user-b@test.com
   Senha: qualquer-outra-senha
   ```

5. **Verificar que:**
   - ✅ Não vê cards de User A
   - ✅ Apenas vê cards de User B (inicialmente vazio)
   - ✅ Pode criar novo card: "Idea from User B"

6. **Login novamente com Usuário A**
   - ✅ Vê "Idea from User A"
   - ✅ Não vê "Idea from User B"
   - ✅ Cards de User B têm lock icon (não pode editar)

## Passo 6: Testar Permissões

1. **Em CardDetailView**, teste se:
   - ✅ Cards próprios mostram botões "Editar" e "Excluir"
   - ✅ Cards alheios mostram "Card de outra pessoa" (sem botões)

2. **Tente editar URL manualmente** (advanced test):
   - Copie ID de card de outro usuário
   - A função `updateCard()` deve retornar erro (401 Forbidden via RLS)

## Troubleshooting

### Erro: "Missing VITE_SUPABASE_URL"
- ✅ Verificar se `.env.local` tem as variáveis
- ✅ Restart do app (`npm run dev`)
- ✅ Variáveis devem começar com `VITE_` para Vite reconhecer

### Erro: "RLS policy denied"
- ✅ Verificar se RLS está **habilitado** na tabela
- ✅ Verificar se `auth.uid()` retorna UUID válido
- ✅ SQL deve ter: `auth.uid() = user_id`

### Erro: "User_id is not null"
- ✅ Função `createCard()` não está passando `user_id`
- ✅ Verificar se `currentUser` é not null antes de criar

### Cards vazios após login
- ✅ Usuário é novo (não há cards ainda) — criar um!
- ✅ Verificar Supabase: **Table Editor > cards** deve mostrar rows

### Dados não sincronizam
- ✅ Offline fallback pode estar ativo
- ✅ Verificar console para `setSyncError`
- ✅ Dados em localStorage podem ser stale — logout e login de novo

## Próximas Etapas

Após completar setup:

1. **Deploy**
   - Fazer commit com `supabase-migration.sql` no repo
   - Deploy no seu servidor (Vercel, Netlify, etc)
   - Confirmar Supabase acessível do servidor

2. **Real-time Features** (futuro)
   - Descomentar `subscribeToUserCards()` em App.tsx
   - Implementar live sync entre abas do mesmo usuário

3. **Backup & Recovery** (futuro)
   - Implementar scheduled backups via Supabase
   - Criar página de recovery de dados

4. **Analytics** (futuro)
   - Rastrear stats por usuário
   - Implementar insights de uso

---

**Última atualização**: 17 de Junho de 2026
**Status**: ✅ Pronto para Setup
