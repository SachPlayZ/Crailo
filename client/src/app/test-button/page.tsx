"use client";

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectKitButton } from 'connectkit';

export default function TestButton() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    return (
        <div>
            <h1>Test Button</h1>
            {isConnected ? (
                <div>
                    <p>Connected to: {address}</p>
                    <button onClick={() => disconnect()}>Disconnect</button>
                </div>
            ) : (
                <div>
                    <p>Not connected</p>
                    <ConnectKitButton />
                </div>
            )}
        </div>
    );
}