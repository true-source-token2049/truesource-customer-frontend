"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@account-kit/react";
import { NavBar } from "@/components/NavBar";
import { getOrder, Order } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    if (user === null) {
      router.push("/?login=true");
      return;
    }

    if (params.id) {
      fetchOrder(Number(params.id));
    }
  }, [params.id, user, router]);

  const fetchOrder = async (orderId: number) => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await getOrder(orderId);
      setOrder(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
            {error}
          </div>
          <div className="text-center mt-4">
            <Button onClick={() => router.push("/shop")}>Back to Shop</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/profile")}
            className="mb-4"
          >
            ← Back to Orders
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>

        {order && (
          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{order.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium text-lg">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="font-medium">
                      {Object.values(order.shipping_address).join(", ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
                    >
                      {item.product?.product_assets?.[0]?.url && (
                        <img
                          src={item.product.product_assets[0].url}
                          alt={item.product.title}
                          className="h-24 w-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">
                          {item.product?.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.product?.brand}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Message */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-green-600 text-5xl mb-2">✓</div>
                  <h3 className="text-xl font-semibold text-green-900 mb-2">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-green-700">
                    Thank you for your purchase. You will receive a confirmation
                    email shortly.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/shop")}>
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => router.push("/profile")}>
                View All Orders
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
