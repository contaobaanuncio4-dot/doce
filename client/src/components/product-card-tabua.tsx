import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { CartSidebar } from "./cart-sidebar-new";

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
  const [selectedSize, setSelectedSize] = useState<"500g" | "1kg">("500g");
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const queryClient = useQueryClient();
  
  const addToCartDirectMutation = useMutation({
    mutationFn: async () => {
      const price = selectedSize === "500g" 
        ? (product.price500g || product.price)
        : (product.price1kg || product.price);
        
      return await apiRequest("/api/cart", {
        method: "POST",
        body: {
          productId: product.id,
          quantity: quantity,
          size: selectedSize,
          price: price,
          sessionId: 'default-session'
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      setShowCartSidebar(true);
    },
  });

  const discountPercent = product.discount || 20;

  return (
    <div className="group">
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white rounded-3xl overflow-hidden">
        <div className="relative">
          {/* Badge de desconto */}
          {product.featured && (
            <div className="absolute top-4 left-4 z-10">
              <Badge 
                variant="destructive" 
                className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full shadow-md"
              >
                -{discountPercent}%
              </Badge>
            </div>
          )}

          {/* Badge "Mais Vendido" */}
          {product.featured && (
            <div className="absolute top-4 right-4 z-10">
              <Badge 
                variant="secondary" 
                className="bg-[#DDAF36] text-[#0F2E51] px-3 py-1 text-xs font-bold rounded-full shadow-md"
              >
                MAIS VENDIDO
              </Badge>
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
            decoding="async"
            onError={(e) => {
              if (!e.currentTarget.src.includes('fallback')) {
                e.currentTarget.src = product.imageUrl + '?fallback=1';
              }
            }}
          />
        </div>

        <CardContent className="p-6">
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 fill-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                {product.rating} ({product.reviews || 0})
              </span>
            </div>
          )}

          {/* Nome do produto */}
          <h3 className="font-bold text-lg text-[#0F2E51] mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Descrição */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Seleção de tamanho */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Escolha o tamanho:</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedSize("500g")}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  selectedSize === "500g"
                    ? "border-[#DDAF36] bg-[#DDAF36]/10 text-[#0F2E51]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium">500g</div>
                  <div className="text-lg font-bold text-[#0F2E51]">
                    R$ {product.price500g || product.price}
                  </div>
                  {product.featured && product.originalPrice500g && (
                    <div className="text-xs text-gray-400 line-through">
                      R$ {product.originalPrice500g}
                    </div>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setSelectedSize("1kg")}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  selectedSize === "1kg"
                    ? "border-[#DDAF36] bg-[#DDAF36]/10 text-[#0F2E51]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium">1kg</div>
                  <div className="text-lg font-bold text-[#0F2E51]">
                    R$ {product.price1kg || product.price}
                  </div>
                  {product.featured && product.originalPrice1kg && (
                    <div className="text-xs text-gray-400 line-through">
                      R$ {product.originalPrice1kg}
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Seleção de quantidade */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quantidade:</h4>
            <div className="flex items-center justify-center border border-gray-200 rounded-xl w-24 mx-auto">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:text-[#0F2E51] transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium text-[#0F2E51]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:text-[#0F2E51] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Botão de adicionar ao carrinho */}
          <Button
            onClick={() => addToCartDirectMutation.mutate()}
            disabled={addToCartDirectMutation.isPending}
            className="w-full bg-[#DDAF36] hover:bg-[#c49a2b] text-[#0F2E51] font-bold py-3 rounded-2xl transition-colors duration-300"
          >
            {addToCartDirectMutation.isPending ? "Adicionando..." : `Adicionar ${quantity}x ao Carrinho`}
          </Button>
        </CardContent>
      </Card>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={showCartSidebar} 
        onClose={() => setShowCartSidebar(false)} 
      />
    </div>
  );
}