// app/_components/restaurant-list.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth"; // Ajuste o caminho se necessário
import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurant-item";
import { prismaDecimalParse } from "../_helpers/prisma";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";

// Removida a interface RestaurantListProps se props não for usado

async function RestaurantList() {
  // Removido 'props: RestaurantListProps'
  const session = await getServerSession(authOptions);

  const restaurants: Restaurant[] = await db.restaurant.findMany({
    orderBy: {
      name: "asc", // Ou rating: "desc", ou createdAt: "asc" (se você adicionou o campo)
    },
    take: 10,
    // Lembre-se de incluir quaisquer campos ou relações que RestaurantItem espera aqui
    // ex: include: { categories: true }
  });

  const userFavoriteRestaurants: UserFavoriteRestaurant[] = session?.user?.id
    ? await db.userFavoriteRestaurant.findMany({
        where: {
          userId: session.user.id,
        },
      })
    : [];

  return (
    <div className="flex gap-4 overflow-x-scroll px-5 pb-3 md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
      {restaurants.map((restaurant) => (
        <RestaurantItem
          key={restaurant.id}
          restaurant={prismaDecimalParse(restaurant)}
          userId={session?.user?.id}
          userFavoriteRestaurants={prismaDecimalParse(userFavoriteRestaurants)}
          className="min-w-[150px] max-w-[150px] lg:min-w-[180px] lg:max-w-[180px]" // Largura ajustada no exemplo anterior
        />
      ))}
    </div>
  );
}

export default RestaurantList;
