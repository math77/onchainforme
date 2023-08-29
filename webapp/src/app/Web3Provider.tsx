"use client";

import { FC, PropsWithChildren } from "react";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { baseGoerli, base } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
const PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;
const { chains, publicClient } = configureChains(
  [base],
  [
    alchemyProvider({ apiKey: ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Onchain For Me...",
  projectId: PROJECT_ID,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const Web3Provider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider theme={darkTheme()} chains={chains}>{children}</RainbowKitProvider>
  </WagmiConfig>
);

export default Web3Provider;