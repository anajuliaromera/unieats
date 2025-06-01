import type { Metadata } from "next";
import { Nunito } from "next/font/google"; // 1. Importar Nunito em vez de Poppins
import "./globals.css"; // Seu arquivo de estilos globais UniEats
import { CartProvider } from "./_context/cart";
import AuthProvider from "./_providers/auth";
import { Toaster } from "@/app/_components/ui/sonner";

// 2. Configurar a fonte Nunito
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"], // Pesos que definimos para o UniEats
  display: "swap", // Boa prática para performance da fonte
  // variable: '--font-nunito', // Opcional: se quiser usar como variável CSS em tailwind.config.js
});

// 3. Atualizar os Metadados para UniEats
export const metadata: Metadata = {
  title: {
    default: "UniEats", // Título padrão do site
    template: "%s | UniEats", // Para títulos de páginas específicas (ex: "Cardápio | UniEats")
  },
  description:
    "UniEats - Seu app de delivery universitário, prático e divertido!",
  icons: {
    icon: "/uniets_icon.png", // Exemplo: coloque seu ícone uniets_icon.png (32x32 ou similar) na pasta /public
    // ou use /favicon.ico se preferir esse nome e formato.
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 4. Atualizar o idioma para pt-BR
    <html lang="pt-BR" className={nunito.className}>
      {" "}
      {/* Aplicando a classe da fonte Nunito ao HTML ou BODY */}
      {/* Alternativamente, se Nunito foi configurado com 'variable':
      <html lang="pt-BR" className={nunito.variable}> 
      E no seu globals.css, no body: font-family: var(--font-nunito);
      Mas aplicar a className diretamente como abaixo é mais comum com next/font.
      */}
      <body className={nunito.className}>
        {" "}
        {/* Aplicando a classe da fonte Nunito diretamente ao body */}
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
