"use client";

import { config } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { WagmiProvider } from "wagmi";
import Header from "./header";
import { Toaster } from "./ui/toaster";

export const queryClient = new QueryClient();

const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider refetchOnWindowFocus={false} refetchInterval={5 * 60}>
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname === "/api-doc") {
    return children;
  }

  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
          <Toaster />
        </main>
      </div>
    </Providers>
  );
}
