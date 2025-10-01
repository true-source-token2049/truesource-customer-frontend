import { AlchemyAccountsUIConfig, createConfig } from "@account-kit/react";
import { sepolia, mainnet } from "@account-kit/infra";
import { alchemy } from "@account-kit/infra";

const uiConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        { type: "passkey" },
        { type: "social", authProviderId: "google" },
        { type: "social", authProviderId: "facebook" },
      ],
    ],
    addPasskeyOnSignup: false,
  },
};

export const config = createConfig(
  {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chain: sepolia,
    ssr: true,
  },
  uiConfig
);
