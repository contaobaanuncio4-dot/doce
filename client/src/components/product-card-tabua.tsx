import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { CartSidebar } from "./cart-sidebar-new";
import ImageSkeleton from "@/components/image-skeleton";

interface Product {
  id: number;
  name: string;
  description: string;
  price?: string;
  price500g?: string;
  price1kg?: string;
  originalPrice?: string;
  originalPrice500g?: string;
  originalPrice1kg?: string;
  imageUrl: string;
  category: string;
  discount?: number;
  featured?: boolean;
  rating?: string;
  reviews?: number;
}

interface ProductCardTabuaProps {
  product: Product;
}

export default function ProductCardTabua({ product }: ProductCardTabuaProps) {
  const [quantity, setQuantity] = useState(1);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const queryClient = useQueryClient();
  
  const addToCartDirectMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/cart", {
        method: "POST",
        body: {
          productId: product.id,
          quantity: 1,
          weight: "500g",
          price: product.price500g || product.price,
          sessionId: 'default-session'
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const discountPercent = product.discount || 20;
  const currentPrice = product.price500g || product.price;
  const priceValue = (product.price500g || product.price) || 'R$ 0,00';
  const originalPrice = product.originalPrice500g || product.originalPrice || `R$ ${(parseFloat(priceValue.replace('R$ ', '').replace(',', '.')) * 1.3).toFixed(2).replace('.', ',')}`;
  const installmentValue = (parseFloat(priceValue.replace('R$ ', '').replace(',', '.')) / 12).toFixed(2).replace('.', ',');

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden">
        {/* Labels/Badges */}
        <div className="labels js-labels-floating-group labels-floating absolute top-2 left-2 z-10">
          {discountPercent > 0 && (
            <div className="label label-circle text-white text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#0F2E51' }}>
              {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Container da imagem */}
        <div className="relative aspect-square overflow-hidden">
          <ImageSkeleton
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Container das informações */}
        <div className="p-3 sm:p-4">
          <div>
            {/* Nome do produto */}
            <h3 className="text-sm sm:text-base font-medium mb-2 leading-tight line-clamp-2 transition-colors hover:opacity-75" style={{ color: '#0F2E51' }}>
              {product.name}
            </h3>

            {/* Container de preços */}
            <div className="mb-3">
              {/* Preço principal */}
              <div className="text-lg sm:text-xl font-bold mb-1" style={{ color: '#DDAF36' }}>
                R$ {currentPrice}
              </div>

              {/* Desconto */}
              <div className="text-xs sm:text-sm text-green-600 font-medium">
                {discountPercent}% OFF
              </div>
            </div>

            {/* Botão de adicionar */}
            <Button
              className="w-full text-white font-medium py-2 px-3 text-xs sm:text-sm rounded-md transition-colors hover:opacity-90"
              style={{ backgroundColor: addToCartDirectMutation.isSuccess ? '#059669' : '#0F2E51' }}
              onClick={() => addToCartDirectMutation.mutate()}
              disabled={addToCartDirectMutation.isPending}
            >
              {addToCartDirectMutation.isPending 
                ? "Adicionando..." 
                : addToCartDirectMutation.isSuccess 
                ? "✓ Adicionado ao Carrinho" 
                : "Adicionar ao Carrinho"
              }
            </Button>
          </div>
        </div>
      </div>
      
      <CartSidebar
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
        product={product}
      />
    </div>
  );
}