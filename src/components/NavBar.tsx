"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";
import { CartPreviewModal } from "./CartPreviewModal";
import { useCart } from "@/contexts/CartContext";
import { useUser, useSignerStatus } from "@account-kit/react";

export const NavBar = () => {
  const router = useRouter();
  const user = useUser();
  const signerStatus = useSignerStatus();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!signerStatus.isInitializing && !user) {
      router.push("/login?referrer=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">TruSrc</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/checkout"
              onClick={handleCheckoutClick}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Checkout
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Orders
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Profile Icon */}
            <Link
              href="/profile"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <User className="h-6 w-6 text-gray-700" />
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Preview Modal */}
      <CartPreviewModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </>
  );
};
