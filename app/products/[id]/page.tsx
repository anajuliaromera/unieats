import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import ProductDetails from "@/app/_components/product-details"; // FOCO TOTAL NESTE COMPONENTE PARA ESTILIZAÇÃO
import { prismaDecimalParse } from "@/app/_helpers/prisma";
import { Header } from "@/app/_components/header"; // Estilizar internamente

interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage = async ({ params: { id } }: ProductPageProps) => {
  const product = await db.product.findUnique({
    // Renomeado para 'product' para clareza
    where: {
      id,
    },
    include: {
      restaurant: true,
    },
  });

  if (!product) {
    notFound();
  }

  const juices = await db.product.findMany({
    where: {
      category: {
        name: "Sucos", // Idealmente, isso viria de uma relação ou ID de categoria, não de um nome fixo
      },
      restaurant: {
        id: product.restaurant.id, // Usando o ID do restaurante do produto principal
      },
    },
    include: {
      restaurant: true,
    },
  });

  return (
    // Adicionando padding geral e garantindo fundo bege (herdado do layout)
    <section className="bg-[var(--uni-beige-bg)] px-5 py-6 md:space-y-8 md:px-10 md:py-8 lg:px-16 xl:px-20">
      {/* Header: Estilizar internamente. 
        Considere se o header é necessário em mobile para esta página ou se um header mobile mais simples
        com botão "voltar" seria melhor. A prop haveSearchbar={true} pode ser false aqui.
      */}
      <div className="hidden md:block md:pb-6">
        {" "}
        {/* Adicionado pb-6 para espaçamento se o header estiver visível */}
        <Header haveSearchbar={false} />
      </div>

      {/* O componente ProductDetails é onde toda a mágica do design UniEats acontecerá.
        Ele precisará de uma reestruturação visual interna significativa.
        Pode ter um fundo branco próprio para se destacar na página bege.
        Ex: <ProductDetails className="bg-white rounded-[var(--border-radius-large)] p-6 shadow-[var(--shadow-medium)]" ... />
        Ou os estilos podem ser todos internos ao componente.
      */}
      <div className="mx-auto max-w-5xl lg:max-w-6xl">
        {" "}
        {/* Container para limitar a largura do conteúdo principal */}
        <ProductDetails
          product={prismaDecimalParse(product)}
          juices={prismaDecimalParse(juices)}
        />
      </div>
    </section>
  );
};

export default ProductPage;
