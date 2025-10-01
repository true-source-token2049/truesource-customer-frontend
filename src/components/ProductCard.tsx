"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Product } from "@/lib/api";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, incrementQuantity, decrementQuantity, getCartItem } = useCart();

  const cartItem = getCartItem(product.id);
  const activeBatch = product.batches?.[0];
  const availableInventory = activeBatch?.available_units || 0;
  const isOutOfStock = availableInventory === 0;

  const handleAddToCart = () => {
    if (!activeBatch || isOutOfStock) return;
    addToCart(product, activeBatch.id, availableInventory);
  };

  const handleIncrement = () => {
    incrementQuantity(product.id);
  };

  const handleDecrement = () => {
    decrementQuantity(product.id);
  };

  const imageUrl = product.product_assets?.[0]?.url || "/placeholder-product.jpg";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Out of Stock</span>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div className="mb-1">
          <h3 className="font-semibold text-sm line-clamp-1">{product.title}</h3>
          <p className="text-xs text-gray-500">{product.brand}</p>
        </div>

        <div className="mb-2">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          {!isOutOfStock && (
            <p className="text-xs text-gray-500">
              {availableInventory} available
            </p>
          )}
        </div>

        {cartItem ? (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1.5">
            <Button
              onClick={handleDecrement}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="font-semibold text-sm px-2">{cartItem.quantity}</span>
            <Button
              onClick={handleIncrement}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              disabled={cartItem.quantity >= availableInventory}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            size="sm"
            className="w-full flex items-center justify-center gap-1 text-xs h-8"
          >
            <ShoppingCart className="h-3 w-3" />
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  );
};