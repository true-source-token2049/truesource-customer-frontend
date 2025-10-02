"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import ClaimButton from "@/components/verify/ClaimButton";
import TrueSourceAPI from "@/lib/trueSourceApi";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/Spinner";
import {
  AlertCircle,
  Clock,
  ExternalLink,
  Package,
  TrendingUp,
} from "lucide-react";

export default function ProductPage() {
  const [productData, setProduct] = useState<any>("");
  const [historyData, setHistoryData] = useState<any>(null);
  const params = useParams();
  const authcode = params.authcode as string;

  const getAuth = async () => {
    const res = await TrueSourceAPI.getAuthProduct(authcode);
    if (res?.success) {
      setProduct(res?.result);
      fetchHistory(res?.result?.nft_token_id);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  const fetchHistory = async (id: string) => {
    try {
      // Step 2: Fetch NFT history using token ID
      const response = await fetch(`/api/nft-history?tokenId=${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch NFT history");
      }

      setHistoryData(data);
    } catch (err: any) {
    } finally {
    }
  };

  const product = productData?.product;

  const Trail = () => {
    return (
      <div className="space-y-6 p-2 mx-auto w-full max-w-[500px]">
        {/* Page Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products Trail 🔍</h1>
          <p className="text-gray-600 mt-1">
            Track the complete history and ownership trail of any NFT
          </p>
        </div>

        {/* History Data Display */}
        {historyData && (
          <div className="space-y-6">
            {/* Current Owner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-300 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                Current Owner
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-mono text-sm text-gray-800 break-all">
                  {historyData.currentOwner}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>
                    Token ID:{" "}
                    <span className="font-bold">#{historyData.tokenId}</span>
                  </span>
                </div>
                {historyData.totalTransfers > 0 && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>
                      Total Transfers:{" "}
                      <span className="font-bold">
                        {historyData.totalTransfers}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Previous Owners */}
            {historyData.previousOwners &&
            historyData.previousOwners.length > 0 ? (
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-gray-600" />
                  Previous Owners
                  <span className="ml-3 bg-gray-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {historyData.previousOwners.length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {historyData.previousOwners.map(
                    (owner: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center bg-white p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-600 mr-4 min-w-[40px] text-center bg-gray-100 px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <span className="font-mono text-sm text-gray-800 break-all">
                          {owner}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border-2 border-blue-200 text-blue-800 px-6 py-4 rounded-lg">
                <p className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    No previous owners found.
                  </span>
                </p>
                <p className="text-sm mt-1 ml-7">
                  This NFT may have been recently minted or has not been
                  transferred yet.
                </p>
              </div>
            )}

            {/* Transfer Details */}
            {historyData.transfers && historyData.transfers.length > 0 && (
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-gray-600" />
                  Transfer Details
                </h2>
                <div className="space-y-3">
                  {historyData.transfers.map((transfer: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700 bg-emerald-100 px-3 py-1 rounded-full">
                          Transfer #{index + 1}
                        </span>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                          Block: {transfer.blockNumber}
                        </span>
                      </div>
                      <div className="text-sm space-y-2">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <span className="text-gray-600 font-medium">
                            From:
                          </span>
                          <span className="font-mono text-xs ml-2 block mt-1 break-all">
                            {transfer.from ===
                            "0x0000000000000000000000000000000000000000" ? (
                              <span className="text-emerald-600 font-semibold">
                                🌟 Minted
                              </span>
                            ) : (
                              transfer.from
                            )}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <span className="text-gray-600 font-medium">To:</span>
                          <span className="font-mono text-xs ml-2 block mt-1 break-all">
                            {transfer.to}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${transfer.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:text-emerald-800 font-medium mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        View on Etherscan
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            {historyData.note && (
              <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Note</p>
                  <p className="text-sm mt-1">{historyData.note}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
        <Trail />

        <ClaimButton
          canClaim={productData?.can_claim_nft}
          random_key={productData?.random_key}
        />
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center w-[100svw] min-h-[100svh]">
      <Spinner />
    </div>
  );
}
