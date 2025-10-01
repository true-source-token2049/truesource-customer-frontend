"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cart.length === 0) {
      setError("Your cart is empty. Add some items before checking out.");
    }
  }, [cart.length]);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Convert cart items to order items format
      const orderItems = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));

      // Create order with items and shipping address
      const order = await createOrder({
        items: orderItems,
        shipping_address: {
          street: "123 Main St", // TODO: Get from form
          city: "Singapore",
          postal_code: "123456",
          country: "Singapore",
        },
      });

      // Clear cart after successful order
      clearCart();

      // Redirect to order detail page
      router.push(`/order/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length > 0 ? (
              <>
                <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center space-x-4 border-b pb-4"
                    >
                      {item.product.product_assets?.[0]?.url && (
                        <img
                          src={item.product.product_assets[0].url}
                          alt={item.product.title}
                          className="h-20 w-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.title}</h4>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          ${item.product.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={submitting || cart.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? "Placing Order..." : "Place Order"}
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Your cart is empty
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}