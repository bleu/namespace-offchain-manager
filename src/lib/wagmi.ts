import { addEnsContracts } from "@ensdomains/ensjs";
import { getDefaultConfig } from "connectkit";
import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

const NEXT_PUBLIC_SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
  "https://api.thegraph.com/subgraphs/name/ensdomains/ens";

export const config = createConfig(
  getDefaultConfig({
    appName: "NamespaceOffchainManager",
    chains: [
      addEnsContracts(sepolia),
      {
        ...addEnsContracts(mainnet),
        // @ts-expect-error test
        subgraphs: { ens: { url: NEXT_PUBLIC_SUBGRAPH_URL } },
      },
    ],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  }),
);
