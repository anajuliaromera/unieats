# UniEats 🍔🍕🥗

Bem-vindo ao UniEats! Uma plataforma de delivery de comida desenvolvida para facilitar a conexão entre vendedores de alimentos (cantinas, alunos vendedores, repúblicas, food bikes) e a comunidade universitária.

## 🌟 Funcionalidades Principais

* **Listagem de Restaurantes/Vendedores:** Navegue por diferentes tipos de vendedores de comida.
* **Visualização de Produtos:** Veja os produtos oferecidos por cada restaurante/vendedor.
* **Busca:** Encontre restaurantes e produtos facilmente.
* **Categorias de Produtos:** Explore produtos por categorias.
* **Favoritos:** Marque seus restaurantes preferidos.
* **Meus Pedidos:** Acompanhe seus pedidos (funcionalidade em desenvolvimento/a ser detalhada).
* **Autenticação de Usuários:** Sistema de login e registro seguro.

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * [Next.js](https://nextjs.org/) 
    * [React](https://reactjs.org/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Tailwind CSS](https://tailwindcss.com/) 
    * [Shadcn/UI](https://ui.shadcn.com/) 
    * `next-auth` (para autenticação)
    * `next/font` (para otimização de fontes)
* **Backend:**
    * [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) (para funcionalidades como NextAuth)
    * [Prisma](https://www.prisma.io/) (ORM para interação com o banco de dados)
* **Banco de Dados:**
    * [PostgreSQL](https://www.postgresql.org/)
* **Testes:**
    * [Jest](https://jestjs.io/)
    * [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
    * `@swc/jest` (para transformar código nos testes)
* **Outras Ferramentas:**
    * ESLint (para linting de código)
    * Husky (para Git hooks)
    * `cross-env` (para variáveis de ambiente consistentes entre plataformas)

## 🚀 Começando

Siga estas instruções para rodar o projeto localmente na sua máquina.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 18.x ou 20.x recomendada, a versão 22.x que você usou no Actions também deve funcionar)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* Uma instância do [PostgreSQL](https://www.postgresql.org/download/) rodando localmente ou acessível.

### Configuração Local

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/anajuliaromera/unieats.git](https://github.com/anajuliaromera/unieats.git)
    cd unieats
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env` na raiz do projeto.
    * Copie o conteúdo do arquivo `.env.example` (se você criar um) ou adicione as seguintes variáveis:

        ```env
        DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@SEU_HOST:SUA_PORTA/SEU_BANCO_DE_DADOS"

        NEXTAUTH_SECRET="SEU_NEXTAUTH_SECRET_ALEATORIO_E_SEGURO"
        NEXTAUTH_URL="http://localhost:3000" # Para desenvolvimento local

        # Adicione outras variáveis que seu projeto possa precisar (ex: chaves de API para Google Auth)
        # GOOGLE_CLIENT_ID="SUA_GOOGLE_CLIENT_ID"
        # GOOGLE_CLIENT_SECRET="SUA_GOOGLE_CLIENT_SECRET"
        ```
    * **Importante:** Substitua os placeholders pelos seus valores reais. `NEXTAUTH_SECRET` pode ser gerado com `openssl rand -base64 32`.

4.  **Execute as Migrações do Prisma:**
    Isso irá criar as tabelas no seu banco de dados conforme definido em `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```
    Opcionalmente, para popular o banco com dados iniciais (se você tiver um arquivo de seed):
    ```bash
    npx prisma db seed
    ```

5.  **Gere o Cliente Prisma:**
    (Normalmente, isso é feito automaticamente pelo script `prepare` após `npm install`, mas pode ser rodado manualmente se necessário)
    ```bash
    npx prisma generate
    ```

### Rodando a Aplicação

1.  **Iniciar o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

2.  **Rodar o build de produção:**
    ```bash
    npm run build
    ```

3.  **Iniciar em modo de produção (após o build):**
    ```bash
    npm run start
    ```

4.  **Rodar os testes:**
    ```bash
    npm run test
    ```

5.  **Rodar o lint:**
    ```bash
    npm run lint
    ```

6.  **Abrir o Prisma Studio (para visualizar/gerenciar o banco de dados):**
    ```bash
    npx prisma studio
    ```

## 🔑 Variáveis de Ambiente

As seguintes variáveis de ambiente são necessárias para o funcionamento correto da aplicação. Crie um arquivo `.env` na raiz do projeto e adicione-as:

* `DATABASE_URL`: String de conexão para o seu banco de dados PostgreSQL.
    * Formato: `postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO`
* `NEXTAUTH_SECRET`: Uma string secreta e aleatória usada pelo NextAuth.js para assinar tokens, cookies, etc. Gere uma forte!
* `NEXTAUTH_URL`: A URL canônica da sua aplicação. Para desenvolvimento local, geralmente é `http://localhost:3000`.
* `GOOGLE_CLIENT_ID` (Opcional): Se você implementou login com Google, adicione seu Client ID.
* `GOOGLE_CLIENT_SECRET` (Opcional): Se você implementou login com Google, adicione seu Client Secret.

## 📜 Scripts Disponíveis

No `package.json`, você encontrará os seguintes scripts principais:

* `npm run dev`: Inicia o servidor de desenvolvimento.
* `npm run build`: Compila a aplicação para produção.
* `npm run start`: Inicia o servidor de produção (após o build).
* `npm run lint`: Executa o ESLint para verificar o código.
* `npm run test`: Executa os testes com Jest.
* `npm run prepare`: Executa `husky && prisma generate` (geralmente após a instalação de pacotes).

---
