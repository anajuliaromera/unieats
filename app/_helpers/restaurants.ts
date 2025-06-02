import { UserFavoriteRestaurant } from "@prisma/client";

export const isFavoriteRestaurant = (
  userFavoritedRestaurants: UserFavoriteRestaurant[] | undefined,
  restaurantId: string,
): boolean => {
  return (userFavoritedRestaurants || []).some(
    (favoriteRestaurant) => favoriteRestaurant.restaurantId === restaurantId,
  );
};