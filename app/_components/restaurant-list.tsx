// app/_components/restaurant-list.tsx

import RestaurantItem from "./restaurant-item";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client"; 
import React from 'react';


interface RestaurantListProps {
  restaurants: Restaurant[]; 
  userId?: string; 
  userFavoritedRestaurants: UserFavoriteRestaurant[];
  title?: string; 
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  userId,
  userFavoritedRestaurants,
  title, 
}) => {
 
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="px-5 py-3">
        {title && <h2 className="mb-2 text-lg font-semibold">{title}</h2>}
        <p>Nenhum restaurante para exibir no momento.</p>
      </div>
    );
    
  }

  return (
    <div className="px-5 py-3 md:px-0"> {/* Ajustei o padding para consistência */}
      {title && <h2 className="mb-3 text-lg font-semibold md:mb-4">{title}</h2>}
      <div className="flex gap-4 overflow-x-scroll pb-3 md:pb-0 [&::-webkit-scrollbar]:hidden">
        {/* Usa os 'restaurants' das props */}
        {restaurants.map((restaurant) => (
          <RestaurantItem
            key={restaurant.id}
            restaurant={restaurant} 
            userId={userId} // Usa o 'userId' das props
            // Mesmo para userFavoritedRestaurants: assumindo que já foi processado em page.tsx
            userFavoritedRestaurants={userFavoritedRestaurants}
            className="min-w-[150px] max-w-[150px] lg:min-w-[180px] lg:max-w-[180px]"
          />
        ))}
      </div>
    </div>
  );
}

export default RestaurantList;