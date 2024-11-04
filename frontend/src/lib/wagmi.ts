import { addEnsContracts } from "@ensdomains/ensjs";
import { getDefaultConfig } from "connectkit";
import { http, createConfig } from "wagmi";
import { goerli, mainnet, sepolia } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    appName: "NamespaceOffchainManager",
    chains: [addEnsContracts(mainnet), addEnsContracts(sepolia)],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http("https://rpc.ankr.com/eth_sepolia"),
      [goerli.id]: http(),
    },
    walletConnectProjectId: "ABXC",
  }),
);
