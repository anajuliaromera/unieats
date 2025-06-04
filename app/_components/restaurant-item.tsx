
// app/_components/restaurant-item.tsx
"use client";
import { Restaurant, UserFavoriteRestaurant, Prisma} from "@prisma/client";
import {
  BikeIcon,
  HeartIcon,
  StarIcon,
  TimerIcon,
  StoreIcon,
  UserIcon,
  UtensilsCrossedIcon,
  HomeIcon, // HomeIcon adicionado à importação
} from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price"; // Ajuste o caminho se necessário
import { Button } from "@/components/ui/button"; // Caminho padrão ShadCN/UI
import Link from "next/link";
import { cn } from "../_lib/utils"; // Ajuste o caminho se necessário
import useHandleFavoriteRestaurant from "../_hooks/use-favorite-restaurant"; // Ajuste o caminho se necessário
import { isFavoriteRestaurant } from "../_helpers/restaurants"; // Ajuste o caminho se necessário
import React from "react";

interface ExtendedRestaurant extends Restaurant {
  type?: "Cantina" | "Aluno Vendedor" | "República" | "Food Bike" | string;
  specialty?: string;
  course?: string;
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
      case "República": // Assumindo que República usa HomeIcon
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

  const vendedoresUniEats: { [key: string]: Partial<ExtendedRestaurant> } = {
    ID_DO_SEU_RESTAURANTE_1: {
      name: "Cantina Central Uni",
      deliveryFee: new Prisma.Decimal(1.5),
      deliveryTimeMinutes: 20,
      type: "Cantina",
      specialty: "Pratos do dia e lanches rápidos",
      rating: new Prisma.Decimal (4.5),
    },
    ID_DO_SEU_RESTAURANTE_2: {
      name: "Doces da Bia (ADM)",
      deliveryFee: new Prisma.Decimal(0),
      deliveryTimeMinutes: 15,
      type: "Aluno Vendedor",
      specialty: "Bolos caseiros e brigadeiros",
      course: "ADM",
      rating: new Prisma.Decimal (4.8),
    },
    // ... (adicione os outros vendedores fictícios com IDs REAIS do seu DB)
  };

  const originalInfo = {
    id: restaurant.id,
    name: restaurant.name,
    imageUrl: restaurant.imageUrl,
    deliveryFee: restaurant.deliveryFee,
    deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
    rating: restaurant.rating,
    type: restaurant.type || "Vendedor",
    specialty: restaurant.specialty || "Variedades",
    course: restaurant.course || undefined,
  };

  const vendedorDisplayInfo = vendedoresUniEats[restaurant.id]
    ? { ...originalInfo, ...vendedoresUniEats[restaurant.id] }
    : originalInfo;

  if (typeof window !== "undefined") {
    console.log(
      `ID do Restaurante/Vendedor: ${restaurant.id} - Nome Original: ${restaurant.name} - Info Usada:`,
      vendedorDisplayInfo,
    );
    if (!vendedoresUniEats[restaurant.id]) {
      console.warn(
        `ID ${restaurant.id} (Nome Original: ${restaurant.name}) não encontrado em vendedoresUniEats. Usando dados originais.`,
      );
    }
  }

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

        {typeof vendedorDisplayInfo.rating === "number" && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[hsl(var(--uni-accent-playful))] px-2 py-0.5 text-[0.6rem] font-bold text-[hsl(var(--foreground))] shadow-sm md:py-1 md:text-xs">
            <StarIcon
              size={10}
              className="fill-current text-current md:size-12"
            />
            <span>{vendedorDisplayInfo.rating.toFixed(1)}</span>
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
              size={14}
              className={cn(
                "transition-colors md:size-16",
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
              {Number(vendedorDisplayInfo.deliveryFee) === 0 ||
              vendedorDisplayInfo.deliveryFee === "Grátis"
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
