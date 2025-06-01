"use client";

import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchForRestaurant } from "../_actions/search";
import { Header } from "@/app/_components/header"; // Estilizar internamente
import RestaurantItem from "@/app/_components/restaurant-item"; // ESTE COMPONENTE PRECISA SER MUITO ESTILIZADO (CARD)
// import { SomeFriendlyIcon } from "lucide-react"; // Exemplo, se for usar um ícone
// import Button from "@/app/_components/Button/Button"; // Se for usar seu botão UniEats customizado

interface RestaurantsProps {
  favoritedrestaurants: UserFavoriteRestaurant[];
}

const Restaurants = ({ favoritedrestaurants }: RestaurantsProps) => {
  const session = useSession();
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const searchFor = searchParams.get("search"); // Mover para cima para usar no título

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!searchFor) return; // Já checado abaixo, mas bom ter aqui também
      const foundRestaurants = await searchForRestaurant(searchFor);
      setRestaurants(foundRestaurants);
    };

    if (searchFor) {
      fetchRestaurants();
    }
  }, [searchParams, searchFor]);

  if (!searchFor && !restaurants.length) {
    // Se não há busca e não carregou nada ainda (ou se a busca for vazia e não houver resultados)
    // Se a busca é obrigatória e não existe, pode retornar notFound()
    // Se a página puder existir sem busca inicial, ajuste a lógica
    return notFound();
  }

  return (
    <>
      {/* O Header precisa ser estilizado internamente. 
          A searchbar dentro dele também precisa do look UniEats. */}
      <Header haveSearchbar={true} />

      <div className="min-h-[calc(100vh-var(--header-height,80px))] bg-[var(--uni-beige-bg)] px-5 py-8 md:px-20 lg:px-32">
        {" "}
        {/* Adiciona fundo bege e padding geral */}
        <h2 className="mb-8 text-center text-2xl font-bold text-[var(--uni-text-dark)] md:text-left md:text-3xl lg:text-4xl">
          {searchFor ? `Resultados para "${searchFor}"` : "Restaurantes"}
        </h2>
        {/* Ajuste no container da lista para melhor responsividade e espaçamento */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantItem
                key={restaurant.id}
                userId={session.data?.user?.id}
                // A função prismaDecimalParse já deve estar sendo usada se necessário
                restaurant={restaurant}
                userFavoritedRestaurants={favoritedrestaurants}
                // A prop 'classname' aqui pode ser usada para classes de largura/grid se o RestaurantItem não controlar isso
                // Ex: classname="w-full"
              />
            ))
          ) : (
            // Mensagem de "Nenhum resultado" mais amigável e ocupando o espaço do grid
            <div className="col-span-full mt-10 flex flex-col items-center justify-center py-10 text-center">
              {/* <SomeFriendlyIcon className="mb-4 h-20 w-20 text-[var(--uni-orange-light)]" /> */}
              <p className="text-xl font-semibold text-[var(--uni-text-dark)]">
                {searchFor
                  ? `Oops! Nenhum resultado para "${searchFor}".`
                  : "Nenhum restaurante encontrado."}
              </p>
              <p className="mt-2 text-[var(--uni-text-medium)]">
                Tente uma busca diferente ou explore nossas delícias!
              </p>
              {/* <Link href="/#categories" passHref> // Supondo que tenha um link para categorias na home
                <Button variant="primary" className="mt-6">
                  Ver Categorias
                </Button>
              </Link> 
              */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Restaurants;
