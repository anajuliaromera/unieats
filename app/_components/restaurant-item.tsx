// app/_components/restaurant-item.tsx
"use client";
import { Restaurant, UserFavoriteRestaurant, Prisma } from "@prisma/client";
import {
  BikeIcon,
  HeartIcon,
  StarIcon,
  TimerIcon,
  StoreIcon,
  UserIcon,
  UtensilsCrossedIcon,
  HomeIcon,
} from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "../_lib/utils";
import useHandleFavoriteRestaurant from "../_hooks/use-favorite-restaurant";
import { isFavoriteRestaurant } from "../_helpers/restaurants";
import React from "react";

interface ExtendedRestaurant extends Restaurant {
  type?: "Cantina" | "Aluno Vendedor" | "República" | "Food Bike" | string;
  specialty?: string;
  course?: string;
  // rating já vem de Restaurant, que é Prisma.Decimal | null
}

interface RestaurantItemProps {
  restaurant: ExtendedRestaurant;
  className?: string;
  userId?: string;
  userFavoritedRestaurants: UserFavoriteRestaurant[];
}

const RestaurantItem = ({
  restaurant,
  className,
  userId,
  userFavoritedRestaurants,
}: RestaurantItemProps) => {
  const isFavorite = isFavoriteRestaurant(
    userFavoritedRestaurants,
    restaurant.id,
  );

  const { handleFavoriteClick } = useHandleFavoriteRestaurant({
    restaurantId: restaurant.id,
    userId,
    isFavoriteRestaurant: isFavorite,
  });

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "Cantina":
        return <StoreIcon size={13} className="mr-1.5 opacity-80" />;
      case "Aluno Vendedor":
        return <UserIcon size={13} className="mr-1.5 opacity-80" />;
      case "República":
        return <HomeIcon size={13} className="mr-1.5 opacity-80" />;
      case "Food Bike":
        return (
          <BikeIcon
            size={13}
            className="mr-1.5 text-[hsl(var(--primary))] opacity-80"
          />
        );
      default:
        return <UtensilsCrossedIcon size={13} className="mr-1.5 opacity-80" />;
    }
  };

  // IDs devem ser os IDs reais do seu banco de dados para que a lógica de merge funcione
  const vendedoresUniEats: { [key: string]: Partial<ExtendedRestaurant> } = {
    ID_DO_SEU_RESTAURANTE_1: { // Substitua pelo ID real
      name: "Cantina Central Uni",
      deliveryFee: new Prisma.Decimal(1.5),
      deliveryTimeMinutes: 20,
      type: "Cantina",
      specialty: "Pratos do dia e lanches rápidos",
      rating: new Prisma.Decimal(4.5),
    },
    ID_DO_SEU_RESTAURANTE_2: { // Substitua pelo ID real
      name: "Doces da Bia (ADM)",
      deliveryFee: new Prisma.Decimal(0),
      deliveryTimeMinutes: 15,
      type: "Aluno Vendedor",
      specialty: "Bolos caseiros e brigadeiros",
      course: "ADM",
      rating: new Prisma.Decimal(4.8),
    },
    // Adicione outros vendedores com seus IDs reais do banco de dados
  };

  const originalInfo = {
    id: restaurant.id,
    name: restaurant.name,
    imageUrl: restaurant.imageUrl,
    deliveryFee: restaurant.deliveryFee,
    deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
    rating: restaurant.rating, // Prisma.Decimal | null
    type: restaurant.type || "Vendedor",
    specialty: restaurant.specialty || "Variedades",
    course: restaurant.course || undefined,
  };

  const vendedorDataOverrides = vendedoresUniEats[restaurant.id];
  const vendedorDisplayInfo = vendedorDataOverrides
    ? { ...originalInfo, ...vendedorDataOverrides }
    : originalInfo;

  // Para depuração no cliente:
  // if (typeof window !== "undefined") {
  //   console.log(
  //     `ID: ${restaurant.id} - Nome Original: ${restaurant.name} - Info Usada:`,
  //     vendedorDisplayInfo,
  //     `Rating Type: ${typeof vendedorDisplayInfo.rating}`,
  //     `Rating Value: ${vendedorDisplayInfo.rating}`
  //   );
  //   if (!vendedorDataOverrides) {
  //     console.warn(
  //       `ID ${restaurant.id} (Nome: ${restaurant.name}) não encontrado em vendedoresUniEats. Usando dados originais.`,
  //     );
  //   }
  // }

  // Converte o rating para número para exibição
  const ratingAsNumber =
    vendedorDisplayInfo.rating !== null &&
    vendedorDisplayInfo.rating !== undefined
      ? Number(vendedorDisplayInfo.rating) // Converte Prisma.Decimal para number
      : null;

  return (
    <div
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius-large)] bg-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-medium)]",
        "w-[150px] min-w-[150px] lg:w-[180px] lg:min-w-[180px]",
        className,
      )}
    >
      <div className="relative h-[120px] w-full lg:h-[140px]">
        <Link
          href={`/restaurants/${vendedorDisplayInfo.id}`}
          className="block h-full w-full"
        >
          {vendedorDisplayInfo.imageUrl ? (
            <Image
              src={vendedorDisplayInfo.imageUrl}
              fill
              alt={vendedorDisplayInfo.name}
              sizes="(max-width: 640px) 40vw, 180px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[hsl(var(--uni-neutral-light))]">
              {React.cloneElement(getTypeIcon(vendedorDisplayInfo.type), {
                size: 40,
                className: "text-[hsl(var(--muted-foreground))] opacity-50",
              })}
            </div>
          )}
        </Link>

        
        {ratingAsNumber !== null && !isNaN(ratingAsNumber) && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[hsl(var(--uni-accent-playful))] px-2 py-0.5 text-[0.6rem] font-bold text-[hsl(var(--foreground))] shadow-sm md:py-1 md:text-xs">
            <StarIcon
              size={10} // Ajuste o tamanho do ícone conforme necessário
              className="fill-current text-current md:size-3" // Ajustado md:size-3 para ser proporcional
            />
            <span>{ratingAsNumber.toFixed(1)}</span>
          </div>
        )}
        

        {userId && (
          <Button
            size="icon"
            className={cn(
              "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full p-0 shadow-md transition-all hover:scale-110 md:h-8 md:w-8",
              isFavorite
                ? "bg-[hsl(var(--primary))]"
                : "bg-gray-100/80 hover:bg-gray-200/90",
            )}
            onClick={(e) => {
              e.preventDefault();
              handleFavoriteClick();
            }}
          >
            <HeartIcon
              size={14} // Ajuste o tamanho do ícone conforme necessário
              className={cn(
                "transition-colors md:size-4", // Ajustado md:size-4
                isFavorite
                  ? "fill-white text-white"
                  : "fill-current text-gray-500 group-hover:fill-[hsl(var(--primary))] group-hover:text-[hsl(var(--primary))]",
              )}
            />
          </Button>
        )}
      </div>

      <div className="flex flex-grow flex-col p-3">
        <Link href={`/restaurants/${vendedorDisplayInfo.id}`} className="block">
          <h3 className="mb-0.5 line-clamp-2 text-sm font-semibold text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--primary))] md:text-base">
            {vendedorDisplayInfo.name}
          </h3>
        </Link>

        {vendedorDisplayInfo.type && (
          <div className="mb-1.5 flex items-center text-[0.7rem] text-[hsl(var(--muted-foreground))] md:text-xs">
            {getTypeIcon(vendedorDisplayInfo.type)}
            <span className="line-clamp-1">{vendedorDisplayInfo.type}</span>
            {vendedorDisplayInfo.course && <span className="mx-1">·</span>}
            {vendedorDisplayInfo.course && (
              <span className="line-clamp-1">{vendedorDisplayInfo.course}</span>
            )}
          </div>
        )}
        {vendedorDisplayInfo.specialty && !vendedorDisplayInfo.course && (
          <p className="mb-1.5 line-clamp-1 text-[0.7rem] text-[hsl(var(--muted-foreground))] md:text-xs">
            {vendedorDisplayInfo.specialty}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-[0.7rem] text-[hsl(var(--muted-foreground))] md:text-xs">
          <div className="flex items-center gap-1">
            <BikeIcon className="text-[hsl(var(--primary))]" size={12} />
            <span>
              {Number(vendedorDisplayInfo.deliveryFee) === 0
                ? "Entrega Grátis"
                : formatCurrency(Number(vendedorDisplayInfo.deliveryFee))}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TimerIcon className="text-[hsl(var(--primary))]" size={12} />
            <span>{vendedorDisplayInfo.deliveryTimeMinutes} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantItem;