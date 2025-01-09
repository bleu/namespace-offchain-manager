import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { mainnet, sepolia } from "viem/chains";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

const SUPPORTED_CHAINS = [
  {
    ...mainnet,
    name: "Ethereum",
    icon: "eth.svg",
  },
  {
    ...sepolia,
    name: "Sepolia",
    icon: "eth.svg",
  },
];

export function ChainSwitcher() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain, isPending, variables } = useSwitchChain();

  if (!isConnected) return null;

  const currentChain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-none w-full"
          disabled={isPending}
        >
          {currentChain && (
            <Image
              src={currentChain.icon}
              alt={currentChain.name}
              width={20}
              height={20}
              className="rounded-full"
            />
          )}
          <span>{currentChain?.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {SUPPORTED_CHAINS.map((supportedChain) => (
          <DropdownMenuItem
            key={supportedChain.id}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              chainId === supportedChain.id && "bg-accent",
            )}
            disabled={chainId === supportedChain.id || isPending}
            onClick={() => switchChain({ chainId: supportedChain.id })}
          >
            <Image
              src={supportedChain.icon}
              alt={supportedChain.name}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="flex-1">{supportedChain.name}</span>
            {isPending && variables?.chainId === supportedChain.id && (
              <span className="text-xs text-muted-foreground">
                Switching...
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
