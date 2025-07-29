import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

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
  checkout500g?: string;
  checkout1kg?: string;
}

interface ProductCardTabuaProps {
  product: Product;
}

export default function ProductCardTabua({ product }: ProductCardTabuaProps) {
  const [selectedSize, setSelectedSize] = useState<"500g" | "1kg">("500g");
  
  const addToCart = async () => {
    try {
      const sessionId = sessionStorage.getItem('sessionId') || 
        Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('sessionId', sessionId);

      const currentPrice = selectedSize === "500g" 
        ? (product.price500g || product.price)
        : (product.price1kg || product.price);

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          productId: product.id,
          quantity: 1,
          size: selectedSize,
          price: currentPrice || '0'
        }),
      });

      if (response.ok) {
        // Disparar evento personalizado para atualizar o carrinho
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  const discountPercent = product.discount || 20;

  if (!product) {
    return (
      <div className="group">
        <Card className="h-full border border-red-200 rounded-3xl overflow-hidden bg-red-50">
          <CardContent className="p-4 text-center">
            <p className="text-red-600 font-medium">Produto não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPrice = selectedSize === "500g" 
    ? (product.price500g || product.price)
    : (product.price1kg || product.price);

  const originalPrice = selectedSize === "500g" 
    ? (product.originalPrice500g || product.originalPrice)
    : (product.originalPrice1kg || product.originalPrice);

  return (
    <div className="group">
      <Card className="h-full border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] relative bg-white">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 space-y-1">
          {product.featured && (
            <Badge className="bg-[#0F2E51] text-white text-xs px-2 py-1 rounded-lg">
              Mais Vendido
            </Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3 z-10">
          {discountPercent > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Imagem do produto */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 group-hover:scale-105 transition-transform duration-300">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f5f5f5"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="14">Imagem não disponível</text></svg>';
              }}
            />
          </div>

          {/* Nome do produto */}
          <h3 className="font-bold text-[#0F2E51] text-lg mb-2 line-clamp-2 group-hover:text-[#DDAF36] transition-colors">
            {product.name}
          </h3>

          {/* Preços */}
          <div className="space-y-1 mb-4">
            {originalPrice && originalPrice !== currentPrice && (
              <p className="text-sm text-gray-500 line-through">
                De: R$ {originalPrice?.replace(".", ",")}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold" style={{ color: '#DDAF36' }}>
                R$ {currentPrice?.replace(".", ",")}
              </span>
            </div>
          </div>

          {/* Seleção de tamanho */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Tamanho:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedSize("500g")}
                className={`flex-1 py-2 px-3 rounded-lg border text-center transition-all ${
                  selectedSize === "500g"
                    ? "border-[#DDAF36] bg-[#DDAF36] text-white"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <div className="text-sm font-medium">500g</div>
              </button>
              
              <button
                onClick={() => setSelectedSize("1kg")}
                className={`flex-1 py-2 px-3 rounded-lg border text-center transition-all ${
                  selectedSize === "1kg"
                    ? "border-[#DDAF36] bg-[#DDAF36] text-white"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <div className="text-sm font-medium">1kg</div>
              </button>
            </div>
          </div>

          {/* Botão Adicionar ao Carrinho */}
          <Button
            onClick={addToCart}
            className="w-full bg-[#DDAF36] hover:bg-[#c49a2b] text-[#0F2E51] font-bold py-3 rounded-2xl transition-colors duration-300"
          >
            Adicionar ao Carrinho
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}