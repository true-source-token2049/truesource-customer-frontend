"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import ResponsiveModal from "./ResponsiveModal";

import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from "ethers";

const CLAIM_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CLAIM_CONTRACT_ADDRESS;
const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const CLAIM_CONTRACT_ABI = [
  "function executeClaim(string memory claimCode, address customerAddress) external",
  "function checkClaim(string memory claimCode) external view returns (bool isValid, uint256 tokenId, address retailer, bool isClaimed)",
];

const ClaimButton = ({ canClaim, random_key }: any) => {
  const [txHash, setTxHash] = useState("");
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();
  const [open, setOpen] = useState(false);

  const account = user?.address;

  const handleClaimNFTClick = () => {
    console.log("claiming nft", user, random_key);
    if (user) {
      if (random_key) handleClaim();
      return;
    } else {
      openAuthModal();
    }
  };

  const checkClaimCode = async () => {
    try {
      if (typeof window !== "undefined" && !(window as any).ethereum) {
        throw new Error("MetaMask not found");
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const claimContract = new ethers.Contract(
        CLAIM_CONTRACT_ADDRESS!,
        CLAIM_CONTRACT_ABI,
        provider
      );

      const [isValid, tokenId, retailer, isClaimed] =
        await claimContract.checkClaim(random_key.trim());
    } catch (err: any) {
      console.error("Error checking claim:", err);
    } finally {
    }
  };

  const handleClaim = async () => {
    try {
      if (typeof window !== "undefined" && !(window as any).ethereum) {
        throw new Error("MetaMask not found");
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const claimContract = new ethers.Contract(
        CLAIM_CONTRACT_ADDRESS!,
        CLAIM_CONTRACT_ABI,
        signer
      );

      const tx = await claimContract.executeClaim(random_key.trim(), account);

      const receipt = await tx.wait();
      setTxHash(receipt.hash);
    } catch (err: any) {
      console.error("Claim error:", err);

      let errorMsg = "Failed to claim NFT: ";
      if (err.message.includes("user rejected")) {
        errorMsg += "Transaction rejected";
      } else if (err.reason) {
        errorMsg += err.reason;
      } else {
        errorMsg += err.message || "Unknown error";
      }
    } finally {
    }
  };

  useEffect(() => {
    if (random_key && canClaim) {
      checkClaimCode();
    }
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        }}
        className="flex flex-col justify-center sm:flex-row gap-3 pt-4  bottom-0 w-full p-4 bg-white"
      >
        <Button
          onClick={() => handleClaimNFTClick()}
          disabled={!canClaim}
          className="flex-1 text-base font-semibold h-[48px] max-w-[600px]"
        >
          {canClaim ? "CLAIM NFT" : "You can not claim yet"}
        </Button>
      </div>
    </>
  );
};

export default ClaimButton;
