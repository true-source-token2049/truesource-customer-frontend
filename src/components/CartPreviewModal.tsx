"use client";

import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/CartContext";
import { useUser, useSignerStatus } from "@account-kit/react";

interface CartPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartPreviewModal = ({ isOpen, onClose }: CartPreviewModalProps) => {
  const router = useRouter();
  const user = useUser();
  const signerStatus = useSignerStatus();
  const { cart, incrementQuantity, decrementQuantity, removeFromCart, getTotalPrice } = useCart();

  const handleCheckout = () => {
    onClose();

    // Check if user is logged in
    if (!signerStatus.isInitializing && !user) {
      // Not logged in, redirect to login with referrer
      router.push("/login?referrer=/checkout");
    } else {
      // Logged in, go to checkout
      router.push("/checkout");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shopping Cart</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-4 border-b pb-3"
                  >
                    {item.product.product_assets?.[0]?.url && (
                      <img
                        src={item.product.product_assets[0].url}
                        alt={item.product.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {item.product.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ${item.product.price.toFixed(2)} each
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          onClick={() => decrementQuantity(item.product.id)}
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() => incrementQuantity(item.product.id)}
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          disabled={item.quantity >= item.available_inventory}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => removeFromCart(item.product.id)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};