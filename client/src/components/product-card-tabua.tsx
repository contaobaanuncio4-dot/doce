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
    <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Badge de desconto */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-discount-bg text-white font-bold px-2 py-1 text-sm">
            -{discountPercent}%
          </Badge>
        </div>
      )}

      <CardContent className="p-0">
        {/* Imagem do produto */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Overlay com botões de ação */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-white text-gray-900 hover:bg-gray-100"
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        {/* Informações do produto */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-3 line-clamp-2">
            {product.name}
          </h3>

          {/* Preços */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-tabua-green">
                Preço promocional {product.price}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  Preço normal {originalPrice}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">
              Até 12x de R$ {installmentValue}
            </p>
          </div>

          {/* Botão principal */}
          <Button
            className="w-full bg-tabua-green hover:bg-tabua-green/90 text-white font-medium py-2 text-sm"
            onClick={() => addToCartMutation.mutate()}
            disabled={addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? "Adicionando..." : "Adicionar à sacola"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}