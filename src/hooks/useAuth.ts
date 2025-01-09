import { useToast } from "@/components/ui/hooks/use-toast";
import { TOAST_MESSAGES } from "@/constants/toastMessages";
import { generateSiweMessage } from "@/lib/siwe";
import { config } from "@/lib/wagmi";
import { useAuthStore } from "@/states/useAuthStore";
import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback } from "react";
import { useAccount, useSignMessage } from "wagmi";

export function useAuth() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { setAddress, setIsAuthenticated, setIsLoading, reset } =
    useAuthStore();

  const handleSignIn = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!address) {
        throw new Error("Wallet not connected");
      }

      const chainId = config.chains[0].id;
      const siweMessage = generateSiweMessage(address, chainId);

      const messageToSign = siweMessage.prepareMessage();

      const signature = await signMessageAsync({
        message: messageToSign,
      });

      const response = await signIn("siwe", {
        message: messageToSign,
        signature,
        redirect: false,
        callbackUrl: "/",
      });

      if (response?.error) {
        throw new Error("Error signing in");
      }

      setAddress(address);
      setIsAuthenticated(true);
      toast(TOAST_MESSAGES.success.siwe);
    } catch (error) {
      toast(TOAST_MESSAGES.error.siwe);
      reset();
    } finally {
      setIsLoading(false);
    }
  }, [
    address,
    signMessageAsync,
    setAddress,
    setIsAuthenticated,
    setIsLoading,
    reset,
    toast,
  ]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      reset();
      toast({
        title: "Success",
        description: "Successfully signed out",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    }
  }, [reset, toast]);

  return {
    address: session?.user?.address,
    isAuthenticated: !!session?.user?.address,
    isLoading: status === "loading",
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
