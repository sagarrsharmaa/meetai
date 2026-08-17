"use client";

import { useRouter } from "next/navigation";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const DashboardUserButton = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { data, isPending } = authClient.useSession();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };

  const onBilling = () => {
    // Opens the Polar customer portal for the signed-in customer.
    authClient.customer.portal();
  };

  if (isPending || !data?.user) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="flex w-full items-center justify-between gap-x-2 overflow-hidden rounded-lg border border-border/10 bg-white/5 p-3 hover:bg-white/10">
          <UserButtonInner
            image={data.user.image}
            name={data.user.name}
            email={data.user.email}
          />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline" onClick={onBilling}>
              <CreditCardIcon className="size-4 text-black" />
              Billing
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOutIcon className="size-4 text-black" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center justify-between gap-x-2 overflow-hidden rounded-lg border border-border/10 bg-white/5 p-3 hover:bg-white/10">
        <UserButtonInner
          image={data.user.image}
          name={data.user.name}
          email={data.user.email}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="truncate font-medium">{data.user.name}</span>
            <span className="truncate text-sm font-normal text-muted-foreground">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onBilling}
          className="flex cursor-pointer items-center justify-between"
        >
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="flex cursor-pointer items-center justify-between"
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserButtonInner = ({
  image,
  name,
  email,
}: {
  image?: string | null;
  name: string;
  email: string;
}) => (
  <>
    {image ? (
      <Avatar>
        <AvatarImage src={image} />
      </Avatar>
    ) : (
      <GeneratedAvatar seed={name} variant="initials" className="mr-3 size-9" />
    )}
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
      <p className="w-full truncate text-sm">{name}</p>
      <p className="w-full truncate text-xs">{email}</p>
    </div>
    <ChevronDownIcon className="size-4 shrink-0" />
  </>
);
