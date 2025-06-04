// app/restaurants/_components/restaurants.tsx
"use client"; // ESSENCIAL para hooks como useSession, useState, useEffect

import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // IMPORTAR useSession
import { searchForRestaurant } from "../_actions/search"; // Ajuste o caminho se "../_actions/" for relativo a "app" e não "app/restaurants"
import { Header } from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";
// import { SomeFriendlyIcon } from "lucide-react";
// import Button from "@/app/_components/Button/Button";
// import Link from "next/link"; // Descomente se for usar o Link para categorias

interface RestaurantsProps {
  favoritedrestaurants: UserFavoriteRestaurant[]; // Nome da prop em minúsculas, conforme seu código
}

const Restaurants = ({ favoritedrestaurants }: RestaurantsProps) => {
  // Ajustar como o session é pego e usado
  const { data: session, status } = useSession(); // 'data' contém a sessão, 'status' o estado da autenticação
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
        setRestaurants([]); // Limpa os restaurantes em caso de erro
      }
    };

    if (searchFor) {
      fetchRestaurants();
    } else {
      // Se não houver termo de busca, limpar os restaurantes ou definir um estado inicial
      setRestaurants([]);
    }
  }, [searchFor]); // Removido searchParams da dependência, pois searchFor já deriva dele e é mais estável

  // Se a busca foi feita, mas não retornou resultados, não chamamos notFound() aqui,
  // pois queremos mostrar a mensagem "Nenhum resultado para..."
  // notFound() é mais para quando a página em si não deve existir (ex: ID inválido em uma página de detalhes)
  // Se a intenção é que uma busca seja OBRIGATÓRIA para esta página existir,
  // e não há 'searchFor', então notFound() pode ser apropriado ANTES do useEffect.
  // Mas a lógica atual parece querer mostrar a página mesmo com busca vazia, para exibir a msg.

  // Lógica para estado de carregamento (opcional, mas bom para UX)
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

  // Se não há termo de busca E o useEffect já limpou os restaurantes
  if (!searchFor && restaurants.length === 0) {
    // Considere o que mostrar se a página for acessada sem o parâmetro 'search'
    // Pode ser uma mensagem, um redirecionamento, ou os mais populares, etc.
    // A lógica atual com notFound() abaixo (comentada) pode ser usada se for o caso.
    // return notFound(); // Descomente se a página não deve existir sem um termo de busca inicial.
    // Ou mostre uma mensagem para o usuário iniciar uma busca:
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
          {searchFor ? `Resultados para "${searchFor}"` : "Restaurantes"}
        </h2>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantItem
                key={restaurant.id}
                // `session.user.id` só existe se session não for null e user não for null.
                // O `status` pode ser usado para garantir que a sessão já carregou.
                userId={session?.user?.id} // Acesso correto ao ID do usuário da sessão
                restaurant={restaurant} // Assumindo que prismaDecimalParse não é necessário aqui se já foi feito antes ou RestaurantItem lida com Decimal
                userFavoritedRestaurants={favoritedrestaurants}
              />
            ))
          ) : (
            searchFor && ( // Mostrar apenas se houve uma tentativa de busca
              <div className="col-span-full mt-10 flex flex-col items-center justify-center py-10 text-center">
                {/* <SomeFriendlyIcon className="mb-4 h-20 w-20 text-[var(--uni-orange-light)]" /> */}
                <p className="text-xl font-semibold text-[var(--uni-text-dark)]">
                  Oops! Nenhum resultado para "{searchFor}".
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