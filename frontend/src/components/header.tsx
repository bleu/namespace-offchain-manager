"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, truncateAddress } from "@/lib/utils";
import type { GetNamesForAddressReturnType } from "@ensdomains/ensjs/subgraph";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ConnectKitButton } from "connectkit";
import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useAccount, useEnsName } from "wagmi";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { usePathname } from "next/navigation";
import { useEnsAvatar } from "wagmi";
import { normalize } from "viem/ens";
import { useEnsNames } from "@/hooks/useEnsNames";

const LINKS = [
  {
    href: "/",
    text: "Manage Subnames",
  },
  {
    href: "/manage-subscription",
    text: "Manage Subscription",
  },
  {
    href: "/setup-resolver",
    text: "Setup Resolver",
  },
];

export const CustomConnectButton = ({ className }: { className?: string }) => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show }) => {
        return (
          <Button onClick={show} variant={"outline"} className={className}>
            {isConnected ? "Manage Connection" : "Connect Connect"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4">
      {LINKS.map(({ href, text }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "text-foreground hover:text-primary transition-colors",
            pathname === href ? "border-b-2" : "border-0",
          )}
        >
          {text}
        </Link>
      ))}
    </nav>
  );
};

export default function Header() {
  const { isConnected, address, chainId } = useAccount();

  const [open, setOpen] = useState(false);
  const { data: primaryEns } = useEnsName({
    address,
    chainId,
  });

  const ensNames = useEnsNames(address, chainId);

  const [selectedEns, setSelectedEns] = useState<
    GetNamesForAddressReturnType[0] | undefined
  >(ensNames?.find((ens) => ens.name === primaryEns));

  const { data: avatar } = useEnsAvatar({
    name: normalize(selectedEns?.name || ""),
    chainId,
  });

  useEffect(() => {
    if (ensNames && primaryEns && !selectedEns) {
      setSelectedEns(ensNames.find((ens) => ens.name === primaryEns));
    }
  }, [ensNames, primaryEns, selectedEns]);

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Navigation />
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-full justify-start text-left font-normal p-1 rounded-full"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={avatar as string} alt="User" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid px-2">
                      <div className="font-medium"> {selectedEns?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {truncateAddress(address)}
                      </div>
                    </div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search ENS name..." />
                  <CommandList>
                    <CommandEmpty>No ENS name found.</CommandEmpty>
                    <CommandGroup heading="ENS Names">
                      {ensNames?.map((ens) => (
                        <CommandItem
                          key={ens.id}
                          onSelect={() => {
                            setSelectedEns(ens);
                            setOpen(false);
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {ens.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  <CommandSeparator />
                  <CustomConnectButton className="border-0" />
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <CustomConnectButton />
          )}
        </div>
      </div>
    </header>
  );
}
