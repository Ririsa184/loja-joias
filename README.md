# Lumière Fé — Loja de Joias, Bijuterias e Artigos Religiosos

Site de e-commerce (front-end) com catálogo de produtos, carrinho de compras, conta de
usuário com registro de interesse por produto, painel administrativo, contato via
WhatsApp Business e um agente de IA integrado ao chat. Construído com **React + Vite +
Tailwind CSS**, pronto para publicar no **GitHub Pages** (ou Vercel/Netlify).

## O que já funciona nesta versão

- Catálogo com filtro por categoria (Joias, Bijuterias, Artigos Religiosos) e busca
- Carrinho de compras com quantidade e total
- Cadastro/login simples e página de perfil com "produtos de interesse" (wishlist)
- Painel administrativo protegido por senha, com listagem de produtos e dos registros
  de interesse feitos na sessão
- Botão de WhatsApp que abre uma conversa já preenchida com o produto/carrinho
- Agente de IA (chat) com respostas automáticas sobre materiais, preços e categorias
- Layout 100% responsivo, pensado primeiro para mobile

## O que é demonstração e o que precisa de backend real

Este projeto é **front-end only**: os dados (produtos, login, carrinho, interesses)
vivem na memória do navegador e são reiniciados a cada recarregamento de página. Para
um e-commerce real em produção, você vai precisar conectar:

| Recurso | Nesta demo | Em produção, use |
|---|---|---|
| Login de usuário | Formulário local, sem senha | Autenticação real (Supabase Auth, Firebase Auth, Clerk, Auth0) |
| Banco de produtos | Array fixo no código (`PRODUCTS`) | Banco de dados (Supabase/Postgres, Firebase, ou um CMS como Sanity/Strapi) |
| Painel admin | Senha fixa `loja2026` no código | Autenticação de admin real + regras de acesso no banco |
| Pagamento | Não incluso (fecha pedido via WhatsApp) | Gateway de pagamento (Mercado Pago, Stripe, PagSeguro) se quiser checkout no site |
| Agente de IA | Respostas por regras simples (sem custo) | API da Anthropic (Claude) chamada por um backend seguro — nunca exponha a chave de API no front-end |
| WhatsApp Business | Link `wa.me` com mensagem pré-preenchida | Mesmo link funciona em produção; para automações, use a API oficial do WhatsApp Business |

Nada disso impede o deploy — o site funciona como catálogo + vitrine + captação de
interesse desde já. As integrações acima são o caminho natural de evolução.

## Rodando localmente

Pré-requisitos: [Node.js 18+](https://nodejs.org) instalado.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`).

## Publicando no GitHub (passo a passo)

### 1. Criar o repositório

1. Crie um repositório novo no GitHub (ex.: `lumiere-fe-loja`), público.
2. Nesta pasta do projeto, rode:

```bash
git init
git add .
git commit -m "Primeiro commit: site Lumière Fé"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/lumiere-fe-loja.git
git push -u origin main
```

### 2. Ajustar o caminho base (GitHub Pages)

Abra `vite.config.js` e troque:

```js
base: "/nome-do-repositorio/",
```

pelo nome exato do seu repositório, por exemplo:

```js
base: "/lumiere-fe-loja/",
```

Se for publicar em domínio próprio, Vercel ou Netlify, deixe `base: "/"`.

### 3. Ativar o GitHub Pages

Este projeto já inclui o workflow `.github/workflows/deploy.yml`, que builda e publica
o site automaticamente a cada `push` na branch `main`.

1. No GitHub, vá em **Settings → Pages**.
2. Em "Build and deployment", escolha **Source: GitHub Actions**.
3. Faça um `git push` (ou rode o workflow manualmente em **Actions**).
4. Em alguns minutos o site estará em:
   `https://SEU-USUARIO.github.io/lumiere-fe-loja/`

### Alternativa: Netlify (deploy mais simples, recomendado)

O projeto já inclui `netlify.toml` com as configurações prontas — a Netlify detecta
tudo sozinha, não precisa mexer no `vite.config.js`.

**Opção A — conectando ao GitHub (recomendado, atualiza sozinho a cada push):**

1. Suba o projeto para um repositório no GitHub (veja o passo 1 acima).
2. Crie uma conta em [netlify.com](https://netlify.com) (dá para entrar direto com a
   conta do GitHub).
3. Clique em **Add new site → Import an existing project**.
4. Escolha **GitHub** e selecione o repositório.
5. A Netlify já vai detectar `npm run build` como comando e `dist` como pasta de
   publicação (vêm do `netlify.toml`) — clique em **Deploy**.
6. Em alguns minutos o site estará no ar em um endereço como
   `https://nome-aleatorio.netlify.app`. Você pode trocar esse nome (ou usar um
   domínio próprio) em **Site settings → Domain management**.
7. A partir de agora, todo `git push` na branch `main` publica uma nova versão
   automaticamente.

**Opção B — sem GitHub, arrastando a pasta (mais rápido para testar):**

1. No computador, dentro da pasta do projeto, rode:

   ```bash
   npm install
   npm run build
   ```

2. Isso gera uma pasta `dist/`.
3. Acesse [app.netlify.com/drop](https://app.netlify.com/drop) e arraste a pasta
   `dist` para a página.
4. O site fica no ar imediatamente. Essa opção não fica conectada ao GitHub — para
   atualizar, é preciso repetir o `npm run build` e arrastar de novo.

### Alternativa: Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) e importe o repositório do
   GitHub.
2. Framework preset: **Vite**. Build command: `npm run build`. Output dir: `dist`.
3. Como o `base` já é `"/"` por padrão (fora do GitHub Pages), não precisa configurar
   nada extra.

## Configurações que você deve personalizar

- **Número de WhatsApp**: em `src/App.jsx`, troque a constante `WHATSAPP_NUMBER` pelo
  número real da loja (formato `55DDDNÚMERO`, só dígitos).
- **Senha do painel admin**: em `src/App.jsx`, procure `"loja2026"` dentro de
  `onLogin` e substitua — idealmente migre para autenticação real antes de ir ao ar.
- **Produtos**: edite o array `PRODUCTS` em `src/App.jsx` (nome, preço, categoria,
  material, descrição).
- **Nome da loja e identidade visual**: procure por "Lumière Fé" e pelas cores em hexa
  (`#C9A24C` dourado, `#C97B84` rosé, `#4C8577` verde) no início do arquivo.

## Estrutura do projeto

```
loja-app/
├── .github/workflows/deploy.yml   # publica automaticamente no GitHub Pages
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.jsx     # toda a aplicação (catálogo, carrinho, conta, admin, IA, WhatsApp)
    ├── main.jsx
    └── index.css
```

## Próximos passos sugeridos

1. Conectar um banco de dados (Supabase é o caminho mais rápido) para produtos, contas
   e pedidos persistirem de verdade.
2. Mover a senha do admin e qualquer chave de API para variáveis de ambiente/backend —
   nunca deixá-las no código do front-end.
3. Se quiser um agente de IA mais sofisticado (respostas geradas de verdade), criar uma
   função de backend (ex.: Vercel Function) que chama a API da Anthropic com sua chave
   guardada em segredo, e o front-end apenas consome esse endpoint.
4. Cadastrar o número real do WhatsApp Business e testar o fluxo completo em um
   celular.
