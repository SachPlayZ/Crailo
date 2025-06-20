"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from "connectkit";
import { WagmiProvider } from "wagmi";
import { config } from './wagmi';
import { theme } from '@/constants/theme';
import "dotenv/config";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider
                    customTheme={theme}
                // mode='dark'
                >
                    {children}
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}