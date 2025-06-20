import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { coreTestnet2 } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

export function getConfig(connectors: ReturnType<typeof connectorsForWallets>) {
    return createConfig({
        chains: [coreTestnet2],
        connectors,
        storage: createStorage({
            storage: cookieStorage,
        }),
        ssr: true,
        transports: {
            [coreTestnet2.id]: http(),
        },
    });
}

declare module "wagmi" {
    interface Register {
        config: ReturnType<typeof getConfig>;
    }
}