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

# UniEats 🍔🍕🥗

Welcome to UniEats! A food delivery platform designed to connect food vendors (canteens, student sellers, fraternities/sororities, food bikes) with the university community.

## 🌟 Key Features

* **Restaurant/Vendor Listing:** Browse different types of food vendors.
* **Product Viewing:** See the products offered by each restaurant/vendor.
* **Search:** Easily find restaurants and products.
* **Product Categories:** Explore products by categories.
* **Favorites:** Mark your preferred restaurants.
* **My Orders:** Track your orders (feature under development/to be detailed).
* **User Authentication:** Secure login and registration system.

## 🛠️ Technologies Used

* **Frontend:**
    * [Next.js](https://nextjs.org/)
    * [React](https://reactjs.org/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Tailwind CSS](https://tailwindcss.com/)
    * [Shadcn/UI](https://ui.shadcn.com/)
    * `next-auth` (for authentication)
    * `next/font` (for font optimization)
* **Backend:**
    * [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) (for functionalities like NextAuth)
    * [Prisma](https://www.prisma.io/) (ORM for database interaction)
* **Database:**
    * [PostgreSQL](https://www.postgresql.org/)
* **Testing:**
    * [Jest](https://jest.io/)
    * [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
    * `@swc/jest` (for code transformation in tests)
* **Other Tools:**
    * ESLint (for code linting)
    * Husky (for Git hooks)
    * `cross-env` (for consistent environment variables across platforms)

## 🚀 Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (version 18.x or 20.x recommended, version 22.x used in Actions should also work)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* A [PostgreSQL](https://www.postgresql.org/download/) instance running locally or accessible.

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/anajuliaromera/unieats.git](https://github.com/anajuliaromera/unieats.git)
    cd unieats
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    * Create a file named `.env` in the project root.
    * Copy the content from the `.env.example` file (if you create one) or add the following variables:

        ```env
        DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/YOUR_DATABASE_NAME"

        NEXTAUTH_SECRET="YOUR_RANDOM_AND_SECURE_NEXTAUTH_SECRET"
        NEXTAUTH_URL="http://localhost:3000" # For local development

        # Add other variables your project might need (e.g., API keys for Google Auth)
        # GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
        # GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
        ```
    * **Important:** Replace the placeholders with your actual values. `NEXTAUTH_SECRET` can be generated with `openssl rand -base64 32`.

4.  **Run Prisma Migrations:**
    This will create the tables in your database as defined in `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```
    Optionally, to populate the database with initial data (if you have a seed file):
    ```bash
    npx prisma db seed
    ```

5.  **Generate Prisma Client:**
    (Normally, this is done automatically by the `prepare` script after `npm install`, but can be run manually if needed)
    ```bash
    npx prisma generate
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

2.  **Run the production build:**
    ```bash
    npm run build
    ```

3.  **Start in production mode (after build):**
    ```bash
    npm run start
    ```

4.  **Run tests:**
    ```bash
    npm run test
    ```

5.  **Run lint:**
    ```bash
    npm run lint
    ```

6.  **Open Prisma Studio (to view/manage the database):**
    ```bash
    npx prisma studio
    ```

## 🔑 Environment Variables

The following environment variables are necessary for the application to function correctly. Create a `.env` file in the project root and add them:

* `DATABASE_URL`: Connection string for your PostgreSQL database.
    * Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME`
* `NEXTAUTH_SECRET`: A secret and random string used by NextAuth.js to sign tokens, cookies, etc. Generate a strong one!
* `NEXTAUTH_URL`: The canonical URL of your application. For local development, this is usually `http://localhost:3000`.
* `GOOGLE_CLIENT_ID` (Optional): If you implemented Google login, add your Client ID.
* `GOOGLE_CLIENT_SECRET` (Optional): If you implemented Google login, add your Client Secret.

## 📜 Available Scripts

In `package.json`, you'll find the following main scripts:

* `npm run dev`: Starts the development server.
* `npm run build`: Compiles the application for production.
* `npm run start`: Starts the production server (after build).
* `npm run lint`: Runs ESLint to check the code.
* `npm run test`: Runs tests with Jest.
* `npm run prepare`: Runs `husky && prisma generate` (usually after package installation).

---
