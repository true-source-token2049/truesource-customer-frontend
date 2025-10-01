"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthModal, useSignerStatus, useUser } from "@account-kit/react";
import { loginCustomer } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const referrer = searchParams.get("referrer");

  // Auto-open auth modal when not logged in
  useEffect(() => {
    if (!signerStatus.isInitializing && !user) {
      openAuthModal();
    }
  }, [signerStatus.isInitializing, user, openAuthModal]);

  // Call loginCustomer API after successful OAuth
  useEffect(() => {
    if (user?.userId && !isLoggingIn) {
      setIsLoggingIn(true);

      const loginPayload = {
        userId: user.userId,
        email: user.email || "",
        address: user.address || "",
        clientAddress: user.address || "",
        orgId: user.orgId || "",
        type: user.type || "alchemy",
      };

      loginCustomer(loginPayload)
        .then(() => {
          console.log("Login successful, tokens stored");
          router.push(referrer || "/");
        })
        .catch((error) => {
          console.error("Login failed:", error);
          setIsLoggingIn(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 justify-center text-center">
      {signerStatus.isInitializing ? (
        <>Loading...</>
      ) : user ? (
        <div className="text-gray-500">Redirecting...</div>
      ) : (
        <div className="text-gray-500">Opening login...</div>
      )}
    </main>
  );
}
