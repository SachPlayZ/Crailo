"use client";

import { createConfig, http } from "wagmi";
import { cookieStorage, createStorage } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { sepolia } from "wagmi/chains";

export const config = createConfig(
    getDefaultConfig({
        enableFamily: false,
        chains: [sepolia],
        transports: {
            // RPC URL for each chain
            [sepolia.id]: http(),
        },
        storage: createStorage({
            storage: cookieStorage,
        }),

        // Required API Keys
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default_project_id",

        // Required App Info
        appName: "AltNode",

        // Optional App Info
        appDescription: "Decentralised AI Ecosystem",
        // appUrl: "https://family.co", // your app's url
        // appIcon: "https://family.co/logo.png",
    })
);