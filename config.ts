// @noErrors
import { createConfig, cookieStorage } from "@account-kit/react";
import { QueryClient } from "@tanstack/react-query";
import { sepolia, alchemy } from "@account-kit/infra"; // Changed from arbitrumSepolia to sepolia

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_ALCHEMY_API_KEY: string;
      NEXT_PUBLIC_ALCHEMY_GAS_POLICY_ID: string;
    }
  }
}

export const config = createConfig(
  {
    transport: alchemy({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    }),
    chain: sepolia, // Changed to Ethereum Sepolia testnet
    ssr: true,
    storage: cookieStorage,
    enablePopupOauth: true,
    policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID,
  },
  {
    auth: {
      sections: [
        [{ type: "email" }],
        [
          { type: "passkey" },
          { type: "social", authProviderId: "google", mode: "popup" },
        ],
      ],
      addPasskeyOnSignup: true,
    },
  }
);

export const queryClient = new QueryClient();
