"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAuth } from "@/hooks/useAuth";
import { cn, truncateAddress } from "@/lib/utils";
import { useEnsStore } from "@/states/useEnsStore";
import { ConnectKitButton, useSIWE } from "connectkit";
import { User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

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
  const { isAuthenticated, signIn, signOut } = useAuth();
  const { isConnected } = useAccount();

  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet";
    if (isAuthenticated) return "Sign Out";
    return "Sign-In with Ethereum";
  };

  const handleAuth = async () => {
    if (!isConnected) {
      // This will open the ConnectKit modal
      return;
    }
    if (!isAuthenticated) {
      await signIn();
    } else {
      await signOut();
    }
  };

  return (
    <ConnectKitButton.Custom>
    {({ isConnecting, show }) => (
      <Button
        variant="outline"
        onClick={isConnected ? handleAuth : show}
        disabled={isConnecting}
        className={className}
        loading={isConnecting}
      >
        {getButtonText()}
      </Button>
    )}
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
  const [popoverOpen, setPopoverOpen] = useState(false);
  const {
    ensNames,
    selectedEns,
    avatar,
    setAddress,
    setSelectedEns,
    fetchEnsNames,
  } = useEnsStore();

  useEffect(() => {
    if (isConnected && address && chainId) {
      setAddress(address, chainId);
      fetchEnsNames();
    }
  }, [isConnected, address, chainId, setAddress, fetchEnsNames]);

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Navigation />
        <div className="flex items-center space-x-4">
          {isConnected && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                      <div className="font-medium">{selectedEns?.name}</div>
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
                            setPopoverOpen(false);
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
          )}
          <CustomConnectButton />
        </div>
      </div>
    </header>
  );
}
