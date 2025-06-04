// app/restaurants/_components/restaurants.tsx
"use client";

import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
// Removido 'notFound' da importação se não for utilizado
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { searchForRestaurant } from "../_actions/search";
import { Header } from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";
// import { SomeFriendlyIcon } from "lucide-react";
// import Link from "next/link";

interface RestaurantsProps {
  favoritedrestaurants: UserFavoriteRestaurant[];
}

const Restaurants = ({ favoritedrestaurants }: RestaurantsProps) => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const searchFor = searchParams.get("search");

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!searchFor) return;
      try {
        const foundRestaurants = await searchForRestaurant(searchFor);
        setRestaurants(foundRestaurants);
      } catch (error) {
        console.error("Erro ao buscar restaurantes:", error);
        setRestaurants([]);
      }
    };

    if (searchFor) {
      fetchRestaurants();
    } else {
      setRestaurants([]);
    }
  }, [searchFor]);

  if (status === "loading" && searchFor) {
    return (
      <>
        <Header haveSearchbar={true} />
        <div className="flex min-h-[calc(100vh-var(--header-height,80px))] items-center justify-center bg-[var(--uni-beige-bg)] px-5 py-8 md:px-20 lg:px-32">
          <p className="text-xl">Carregando resultados...</p>
        </div>
      </>
    );
  }

  if (!searchFor && restaurants.length === 0 && status !== "loading") {
    return (
      <>
        <Header haveSearchbar={true} />
        <div className="flex min-h-[calc(100vh-var(--header-height,80px))] flex-col items-center justify-center bg-[var(--uni-beige-bg)] px-5 py-8 text-center md:px-20 lg:px-32">
          <h2 className="mb-8 text-2xl font-bold text-[var(--uni-text-dark)] md:text-3xl lg:text-4xl">
            Buscar Restaurantes
          </h2>
          <p className="text-lg text-[var(--uni-text-medium)]">
            Utilize a barra de pesquisa acima para encontrar seus restaurantes
            favoritos!
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header haveSearchbar={true} />

      <div className="min-h-[calc(100vh-var(--header-height,80px))] bg-[var(--uni-beige-bg)] px-5 py-8 md:px-20 lg:px-32">
        <h2 className="mb-8 text-center text-2xl font-bold text-[var(--uni-text-dark)] md:text-left md:text-3xl lg:text-4xl">
          {searchFor ? `Resultados para "${searchFor}"` : "Restaurantes"} {/* Aspas aqui são OK porque estão em template string JS */}
        </h2>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantItem
                key={restaurant.id}
                userId={session?.user?.id}
                restaurant={restaurant}
                userFavoritedRestaurants={favoritedrestaurants}
              />
            ))
          ) : (
            searchFor && (
              <div className="col-span-full mt-10 flex flex-col items-center justify-center py-10 text-center">
                {/* <SomeFriendlyIcon className="mb-4 h-20 w-20 text-[var(--uni-orange-light)]" /> */}
                <p className="text-xl font-semibold text-[var(--uni-text-dark)]">
                  {/* CORREÇÃO APLICADA AQUI */}
                  Oops! Nenhum resultado para &quot;{searchFor}&quot;.
                </p>
                <p className="mt-2 text-[var(--uni-text-medium)]">
                  Tente uma busca diferente ou explore nossas delícias!
                </p>
                {/* <Link href="/#categories" passHref>
                  <Button variant="primary" className="mt-6">
                    Ver Categorias
                  </Button>
                </Link> 
                */}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Restaurants;