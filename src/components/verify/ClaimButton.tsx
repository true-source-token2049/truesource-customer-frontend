"use client";
import React, { use, useState } from "react";
import { Button } from "../ui/button";
import ResponsiveModal from "./ResponsiveModal";

import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";

const ClaimButton = () => {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();
  const [open, setOpen] = useState(false);

  console.log("user iss", user);

  const handleClaimNFTClick = () => {
    if (user) {
      return;
    } else {
      openAuthModal();
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
        }}
        className="flex flex-col justify-center sm:flex-row gap-3 pt-4  bottom-0 w-full p-4 bg-white"
      >
        <Button
          onClick={() => handleClaimNFTClick()}
          className="flex-1 text-base font-semibold h-[48px] max-w-[600px]"
        >
          CLAIM NFT
        </Button>
      </div>
    </>
  );
};

export default ClaimButton;
