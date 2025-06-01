// app/page.tsx
import { db } from "@/app/_lib/prisma";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Seus Componentes UniEats (PRECISAM SER ESTILIZADOS INTERNAMENTE)
import CategoryList from "./_components/category-list";
import { Header } from "./_components/header";
import ProductList from "./_components/product-list";
import PromoBanner from "./_components/promo-banner";
import RestaurantList from "./_components/restaurant-list"; // Esta lista renderizará os RestaurantItems como SellerCards
import Search from "./_components/search";
import { Button } from "./_components/ui/button"; // Seu componente Button da lib de UI

// Seus Helpers
import { prismaDecimalParse } from "./_helpers/prisma"; // Certifique-se que o caminho está correto
import { getServerSession } from "next-auth";
import { authOptions } from "./_lib/auth"; // Certifique-se que o caminho está correto
import { Restaurant, UserFavoriteRestaurant, Product } from "@prisma/client"; // Importando tipos
import type { Metadata } from "next";

// Lembre-se: O título principal da aba ("UniEats") é definido no app/layout.tsx
// Se quiser um título específico para esta página:
export const metadata: Metadata = {
  title: "Início | UniEats",
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Busca de dados (adapte conforme sua lógica)
  const productsInDiscount: Product[] = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 10,
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const featuredSellers: Restaurant[] = await db.restaurant.findMany({
    take: 10,
    orderBy: {
      // Defina um critério de ordenação para seus vendedores em destaque, ex:
      // rating: "desc",
      name: "asc", // ou createdAt, se você adicionou
    },
    // Inclua quaisquer campos que RestaurantItem/SellerCardItem precise
  });

  const userFavoriteRestaurants: UserFavoriteRestaurant[] = session?.user?.id
    ? await db.userFavoriteRestaurant.findMany({
        where: { userId: session.user.id },
      })
    : [];

  return (
    <main className="pb-12 md:pb-16">
      {" "}
      {/* Fundo bege principal aplicado globalmente via globals.css no body */}
      <header className="sticky top-0 z-50 bg-white shadow-[var(--shadow-soft)]">
        {/* O Header precisa estar estilizado e com o logo uniets.jpeg */}
        <Header haveSearchbar={false} />
      </header>
      {/* Seção Hero */}
      <section
        aria-labelledby="hero-title"
        className="px-5 py-10 text-center text-[hsl(var(--foreground))] md:flex md:min-h-[calc(65vh)] md:items-center md:justify-between md:gap-8 md:px-20 md:py-0 md:text-left lg:min-h-[calc(75vh)] lg:px-32 xl:min-h-[calc(80vh)]"
      >
        <div className="md:max-w-[55%] lg:max-w-[50%]">
          <div className="w-full md:pb-8">
            <h1
              id="hero-title"
              className="mb-3 text-4xl font-extrabold leading-tight md:mb-4 md:text-5xl lg:text-6xl"
            >
              Está com fome na Uni?
            </h1>
            <p className="text-md md:text-lg lg:text-xl">
              Com apenas alguns cliques, encontre rangos deliciosos e acessíveis
              feitos pela galera da facul e cantinas parceiras!
            </p>
          </div>

          <div className="mt-8 md:mt-6 md:rounded-[var(--radius-large)] md:bg-[hsl(var(--card))] md:p-5 md:shadow-[var(--shadow-medium)]">
            {/* O componente Search PRECISA SER TOTALMENTE REESTILIZADO INTERNAMENTE */}
            <Search />
          </div>
        </div>

        <div className="mt-10 hidden items-center justify-center md:mt-0 md:flex md:max-w-[40%] lg:max-w-[45%]">
          <div className="relative aspect-square w-full max-w-md drop-shadow-[0_15px_20px_rgba(74,63,53,0.25)] 2xl:max-w-lg">
            <Image
              src={"/cupnoodles.png"}
              fill
              alt="Lanche UniEats"
              className="object-contain"
              sizes="(max-width: 768px) 80vw, 40vw"
              priority
            />
          </div>
        </div>
      </section>
      {/* Container para as seções de conteúdo com espaçamento uniforme */}
      <div className="space-y-10 px-5 pt-8 md:space-y-16 md:px-20 md:pt-12 lg:px-32">
        <section aria-labelledby="categories-title">
          <h2 id="categories-title" className="sr-only">
            Categorias
          </h2>
          {/* O componente CategoryList e seus CategoryItem precisam ser estilizados internamente */}
          <CategoryList />
        </section>

        <section aria-labelledby="promo-and-recommended-title">
          <h2 id="promo-and-recommended-title" className="sr-only">
            Promoções e Pedidos Recomendados
          </h2>
          <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1 lg:space-y-8">
              {/* O componente PromoBanner e suas SVGs precisam ser adaptados ao estilo UniEats */}
              <PromoBanner src={"/promo_banner.svg"} alt="Promoção de Pizza" />
              <PromoBanner
                src={"/promo_banner_2.svg"}
                alt="Promoção de Lanches"
              />
            </div>

            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[hsl(var(--foreground))] md:text-2xl">
                  Pedidos Recomendados 🍕
                </h3>
                <Button
                  asChild
                  variant={"ghost"}
                  size="sm"
                  className="rounded-[var(--radius)] px-3 py-1 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-foreground))]"
                >
                  <Link href={"/products/recommended"}>
                    Ver todos
                    <ChevronRightIcon size={16} className="ml-1" />
                  </Link>
                </Button>
              </div>
              {/* O ProductList e seus ProductItem (cards) precisam ser estilizados internamente */}
              <ProductList products={prismaDecimalParse(productsInDiscount)} />
            </div>
          </div>
        </section>

        <section aria-labelledby="featured-sellers-title" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2
              id="featured-sellers-title"
              className="text-xl font-bold text-[hsl(var(--foreground))] md:text-2xl"
            >
              Vendedores em Destaque ✨ {/* Título para vendedores */}
            </h2>
            <Button
              asChild
              variant={"ghost"}
              size="sm"
              className="rounded-[var(--radius)] px-3 py-1 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-foreground))]"
            >
              {/* ================================================== */}
              {/* LINK CORRIGIDO PARA /restaurants                  */}
              {/* ================================================== */}
              <Link href="/restaurants">
                Ver todos
                <ChevronRightIcon size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
          {/* RestaurantList renderizará os RestaurantItem/SellerItem estilizados. 
              Passe a lista correta de 'sellers' (ou 'restaurants').
          */}
          <RestaurantList
            restaurants={prismaDecimalParse(featuredSellers)}
            userId={session?.user?.id}
            userFavoritedRestaurants={prismaDecimalParse(
              userFavoriteRestaurants,
            )}
          />
        </section>
      </div>
    </main>
  );
}
