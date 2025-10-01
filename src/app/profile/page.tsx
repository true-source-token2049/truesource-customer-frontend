"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@account-kit/react";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Placeholder types for NFTs and extended Order
interface NFT {
  id: number;
  tokenId: string;
  name: string;
  imageUrl: string;
  product?: {
    title: string;
    brand: string;
  };
}

interface OrderSummary {
  id: number;
  total_amount: number;
  status: string;
  createdAt: string;
  order_items: Array<{
    product?: {
      title: string;
    };
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useUser();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    if (user === null) {
      router.push("/?login=true");
      return;
    }

    setLoading(false);
    // TODO: Fetch user orders and NFTs
    // For now, using placeholder data
  }, [user, router]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">User Profile</TabsTrigger>
            <TabsTrigger value="nfts">My NFTs</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <Button onClick={() => router.push("/shop")}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/order/${order.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${order.total_amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                              {order.status}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.order_items.length} item(s)
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {user.email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Wallet Address</p>
                        <p className="font-medium font-mono text-sm break-all">
                          {user.address || "Not connected"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="font-medium font-mono text-sm">
                          {user.userId || "N/A"}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts">
            <Card>
              <CardHeader>
                <CardTitle>My NFTs</CardTitle>
              </CardHeader>
              <CardContent>
                {nfts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-2">
                      No NFTs in your collection yet
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Purchase products to receive authenticity NFTs
                    </p>
                    <Button onClick={() => router.push("/shop")}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nfts.map((nft) => (
                      <div
                        key={nft.id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <img
                          src={nft.imageUrl}
                          alt={nft.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold mb-1">{nft.name}</h4>
                          {nft.product && (
                            <p className="text-sm text-gray-600">
                              {nft.product.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2 font-mono">
                            Token #{nft.tokenId}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}