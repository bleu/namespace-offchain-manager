import { addEnsContracts } from "@ensdomains/ensjs";
import { getDefaultConfig } from "connectkit";
import { http, createConfig, fallback } from "wagmi";
import { goerli, mainnet, sepolia } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    appName: "NamespaceOffchainManager",
    chains: [addEnsContracts(sepolia), addEnsContracts(mainnet)],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: fallback([
        http("https://rpc.ankr.com/eth_sepolia"),
        http("https://eth-sepolia.public.blastapi.io"),
      ]),
      [goerli.id]: http(),
    },
    walletConnectProjectId: "ABXC",
  })
);
