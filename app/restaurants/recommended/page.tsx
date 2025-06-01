// app/restaurants/recommended/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth"; // Ajuste o caminho
import { db } from "@/app/_lib/prisma";
import { Header } from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";
import { prismaDecimalParse } from "@/app/_helpers/prisma";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button"; // IMPORTAÇÃO DO BOTÃO ADICIONADA
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendedores Recomendados | UniEats", // Título UniEats
};

export default async function RecommendedRestaurantsPage() {
  const session = await getServerSession(authOptions);

  const recommendedSellers: Restaurant[] = await db.restaurant.findMany({
    where: {
      rating: {
        // Exemplo de critério para "recomendado"
        gte: 4,
      },
    },
    orderBy: {
      rating: "desc",
    },
    take: 15,
    // Inclua quaisquer relações que seu RestaurantItem possa precisar
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
      <Header haveSearchbar={true} />

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
          Nossas Recomendações Especiais Para Você! 🌟
        </h1>

        {recommendedSellers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {recommendedSellers.map((item) => (
              <RestaurantItem
                key={item.id}
                restaurant={prismaDecimalParse(item)}
                userId={session?.user?.id}
                userFavoritedRestaurants={prismaDecimalParse(
                  userFavoriteRestaurants,
                )}
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[var(--radius-large)] bg-[hsl(var(--card))] p-10 text-center shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
              Ainda estamos preparando nossas recomendações!
            </h2>
            <p className="mt-2 text-[hsl(var(--muted-foreground))]">
              Enquanto isso, que tal explorar todos os nossos vendedores?
            </p>
            <Link href="/restaurants" className="mt-4">
              <Button
                variant="outline"
                className="rounded-[var(--radius)] border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--uni-orange-light))]"
              >
                Ver Todos os Vendedores
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
