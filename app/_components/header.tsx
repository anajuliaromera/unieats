"use client";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button"; // Seu componente Button da lib de UI
import {
  HeartIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ScrollTextIcon,
} from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"; // Seus componentes Sheet da lib de UI
import { Avatar, AvatarImage } from "./ui/avatar"; // Seus componentes Avatar da lib de UI
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "./ui/separator"; // Seu componente Separator da lib de UI
import Search from "./search"; // Seu componente Search

interface HeaderProps {
  haveSearchbar: boolean;
}

export const Header = ({ haveSearchbar }: HeaderProps) => {
  const { data } = useSession();

  const handleSignOutClick = () => signOut();
  const handleSignInClick = () => signIn();

  return (
    // A MODIFICAÇÃO ESTÁ AQUI: bg-[#FAFAFA] (um tom de off-white)
    <div className="flex items-center justify-between bg-[#FAFAFA] px-5 py-4 shadow-[var(--shadow-soft)] md:px-20 lg:px-32">
      <Link href={"/"} className="inline-block">
        <Image
          src="/unieats.png" // Caminho para o logo na pasta public
          alt="UniEats Logo"
          width={140} // AJUSTE PARA A LARGURA IDEAL DO SEU LOGO
          height={48} // AJUSTE PARA A ALTURA IDEAL DO SEU LOGO (mantendo proporção)
          priority // Importante para LCP (Largest Contentful Paint)
          className="h-auto"
        />
      </Link>

      {haveSearchbar && (
        <div className="hidden w-2/5 md:block">
          {/* O componente Search precisa ser estilizado internamente com o visual UniEats */}
          <Search />
        </div>
      )}

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="border-none text-[hsl(var(--foreground))] hover:bg-[hsl(var(--uni-orange-light))] hover:text-[hsl(var(--primary))]"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-[hsl(var(--background))] p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-left text-xl font-bold text-[hsl(var(--foreground))]">
              Menu UniEats
            </SheetTitle>
          </SheetHeader>

          {data?.user ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={data?.user?.image as string | undefined}
                      alt={`${data?.user?.name}'s avatar`}
                    />
                    <AvatarFallback className="bg-[hsl(var(--uni-orange-light))] text-[hsl(var(--primary))]">
                      {data?.user?.name?.split(" ")[0][0]}
                      {data?.user?.name?.split(" ")?.[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">
                      {data.user.name}
                    </h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {data.user.email}
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="bg-[hsl(var(--border))]" />
              <div className="space-y-2">
                {[
                  { href: "/", icon: <HomeIcon size={18} />, label: "Início" },
                  {
                    href: "/my-orders",
                    icon: <ScrollTextIcon size={18} />,
                    label: "Meus Pedidos",
                  },
                  {
                    href: "/favorites-restaurants",
                    icon: <HeartIcon size={18} />,
                    label: "Restaurantes Favoritos",
                  },
                ].map((item) => (
                  <Button
                    key={item.href}
                    variant={"ghost"}
                    className="flex w-full justify-start gap-3 rounded-full px-4 py-5 text-sm font-normal text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--uni-orange-light))] hover:text-[hsl(var(--primary))]"
                    asChild
                  >
                    <Link href={item.href}>
                      {item.icon}
                      <p>{item.label}</p>
                    </Link>
                  </Button>
                ))}
                <Separator className="my-5 bg-[hsl(var(--border))]" />
                <Button
                  variant={"ghost"}
                  className="flex w-full justify-start gap-3 rounded-full px-4 py-5 text-sm font-normal text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--uni-orange-light))] hover:text-[hsl(var(--primary))]"
                  onClick={handleSignOutClick}
                >
                  <LogOutIcon size={18} />
                  <p>Sair da conta</p>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 pt-8 text-center">
              <h2 className="font-semibold text-[hsl(var(--foreground))]">
                Entre ou crie sua conta!
              </h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Acesse seus pedidos, favoritos e aproveite o UniEats ao máximo.
              </p>
              <Button
                className="mt-4 w-full rounded-[var(--radius-large)] bg-[hsl(var(--primary))] py-3 text-base text-[hsl(var(--primary-foreground))] hover:opacity-90" // Aumentei padding e font-size
                onClick={handleSignInClick}
              >
                <LogInIcon size={18} className="mr-2" />
                Fazer Login ou Cadastrar
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
