import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  discount?: number;
  originalPrice?: string;
  installments?: string;
}

interface ProductCardTabuaProps {
  product: Product;
}

export default function ProductCardTabua({ product }: ProductCardTabuaProps) {
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/cart/add", "POST", {
        productId: product.id,
        quantity: quantity
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const discountPercent = product.discount || Math.floor(Math.random() * 50) + 20;
  const originalPrice = product.originalPrice || `R$ ${(parseFloat(product.price.replace('R$ ', '').replace(',', '.')) * 1.5).toFixed(2).replace('.', ',')}`;
  const installmentValue = (parseFloat(product.price.replace('R$ ', '').replace(',', '.')) / 12).toFixed(2).replace('.', ',');

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
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
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
                R$ {product.price}
              </div>

              {/* Parcelamento */}
              <div className="text-xs sm:text-sm text-gray-600">
                <span>12</span>
                <span> x de </span>
                <span className="font-medium">
                  R$ {installmentValue}
                </span>
              </div>
            </div>

            {/* Botão de adicionar */}
            <Button
              className="w-full text-white font-medium py-2 px-3 text-xs sm:text-sm rounded-md transition-colors hover:opacity-90"
              style={{ backgroundColor: '#0F2E51' }}
              onClick={() => addToCartMutation.mutate()}
              disabled={addToCartMutation.isPending}
            >
              {addToCartMutation.isPending ? "Adicionando..." : "Adicionar à sacola"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}