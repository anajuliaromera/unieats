// app/restaurants/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth"; // Ajuste o caminho se o seu authOptions estiver em outro lugar
import { db } from "@/app/_lib/prisma";
import { Header } from "@/app/_components/header"; // Seu componente Header global
import RestaurantItem from "@/app/_components/restaurant-item"; // Seu card de vendedor/restaurante
import { prismaDecimalParse } from "@/app/_helpers/prisma";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  // Adicionando metadata para esta página específica
  title: "Todos os Vendedores",
};

export default async function AllRestaurantsPage() {
  // Renomeei a função para clareza
  const session = await getServerSession(authOptions);

  const allSellersOrRestaurants: Restaurant[] = await db.restaurant.findMany({
    orderBy: {
      name: "asc", // Ordenando por nome como exemplo, pode mudar ou remover
    },
    // Inclua quaisquer relações que seu RestaurantItem possa precisar aqui
    // Ex: include: { categories: true }
  });

  const userFavoriteRestaurants: UserFavoriteRestaurant[] = session?.user?.id
    ? await db.userFavoriteRestaurant.findMany({
        where: {
          userId: session.user.id,
        },
      })
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
      <Header haveSearchbar={true} />{" "}
      {/* Header com barra de busca, se desejar */}
      <main className="flex-grow px-5 py-8 md:px-20 lg:px-32">
        <div className="mb-6 md:mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-[hsl(var(--primary))] hover:opacity-80"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            Voltar para Início
          </Link>
        </div>

        <h1 className="mb-8 text-center text-2xl font-bold text-[hsl(var(--foreground))] md:text-left md:text-3xl lg:text-4xl">
          Conheça Nossos Vendedores e Cantinas
        </h1>

        {allSellersOrRestaurants.length > 0 ? (
          // Grid responsivo para os cards
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {allSellersOrRestaurants.map((item) => (
              <RestaurantItem
                key={item.id}
                restaurant={prismaDecimalParse(item)}
                userId={session?.user?.id}
                userFavoritedRestaurants={prismaDecimalParse(
                  userFavoriteRestaurants,
                )}
                className="h-full" // Para ajudar na consistência da altura no grid
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[var(--radius-large)] bg-[hsl(var(--card))] p-10 text-center shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
              Ops! Nenhum vendedor por aqui ainda.
            </h2>
            <p className="mt-2 text-[hsl(var(--muted-foreground))]">
              Fique de olho, novidades em breve!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
