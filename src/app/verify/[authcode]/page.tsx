"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import ClaimButton from "@/components/verify/ClaimButton";
import TrueSourceAPI from "@/lib/trueSourceApi";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/Spinner";

export default function ProductPage() {
  const [productData, setProduct] = useState<any>("");
  const params = useParams();
  const authcode = params.authcode as string;

  const getAuth = async () => {
    const res = await TrueSourceAPI.getAuthProduct(authcode);
    if (res?.success) {
      setProduct(res?.result);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  const product = productData?.batch?.product;

  if (product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative mb-[60px]">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="w-full">
              <Card className="overflow-hidden border-0 shadow-lg p-0">
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={product.product_assets?.[0].url}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </Card>
            </div>

            <div className="flex flex-col justify-center space-y-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider ">
                  {product.brand}
                </p>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              <p
                style={{ lineHeight: "1.2" }}
                className="text-md md:text-lg text-gray-600 leading-relaxed"
              >
                {product.description}
              </p>

              <div className="text-3xl font-bold text-gray-900">$49.99</div>
            </div>
          </div>
        </div>
        <ClaimButton />
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center w-[100svw] min-h-[100svh]">
      <Spinner />
    </div>
  );
}
