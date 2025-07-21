import { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Product {
  id: number;
  name: string;
  description: string;
  price500g?: string;
  price1kg?: string;
  originalPrice500g?: string;
  originalPrice1kg?: string;
  imageUrl: string;
  category: string;
  discount?: number;
  featured?: boolean;
  rating?: string;
  reviews?: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function CartSidebar({ isOpen, onClose, product }: CartSidebarProps) {
  const [selectedSize, setSelectedSize] = useState<"500g" | "1kg">("500g");
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Reset quando o produto muda
  useEffect(() => {
    if (product) {
      setSelectedSize("500g");
      setQuantity(1);
    }
  }, [product]);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const price = selectedSize === "500g" ? product?.price500g : product?.price1kg;
      await apiRequest("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: product?.id,
          quantity,
          size: selectedSize,
          price: price,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      onClose();
    },
  });

  if (!isOpen || !product) return null;

  const currentPrice = selectedSize === "500g" ? product.price500g : product.price1kg;
  const originalPrice = selectedSize === "500g" ? product.originalPrice500g : product.originalPrice1kg;
  const totalPrice = currentPrice ? (parseFloat(currentPrice.replace(",", ".")) * quantity).toFixed(2).replace(".", ",") : "0,00";
  
  const cartTotal = cartItems.reduce((total: number, item: any) => {
    return total + (parseFloat(item.price?.replace(",", ".") || "0") * item.quantity);
  }, 0);

  // Frete fixo
  const shippingCost = 9.90;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#0F2E51' }}>
            <h2 className="text-lg font-semibold" style={{ color: '#0F2E51' }}>
              Adicionar ao Carrinho
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Product Image and Name */}
            <div className="flex items-start space-x-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm leading-tight" style={{ color: '#0F2E51' }}>
                  {product.name}
                </h3>
                <button
                  onClick={() => {
                    setLocation(`/product/${product.id}`);
                    onClose();
                  }}
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  Ver detalhes
                </button>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm" style={{ color: '#0F2E51' }}>
                Escolha o tamanho:
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedSize("500g")}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    selectedSize === "500g"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    borderColor: selectedSize === "500g" ? "#DDAF36" : undefined,
                    backgroundColor: selectedSize === "500g" ? "#DDAF36" : undefined,
                    color: selectedSize === "500g" ? "white" : "#0F2E51"
                  }}
                >
                  <div className="font-medium">500g</div>
                  <div className="text-sm">
                    R$ {product.price500g}
                  </div>
                </button>
                <button
                  onClick={() => setSelectedSize("1kg")}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    selectedSize === "1kg"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    borderColor: selectedSize === "1kg" ? "#DDAF36" : undefined,
                    backgroundColor: selectedSize === "1kg" ? "#DDAF36" : undefined,
                    color: selectedSize === "1kg" ? "white" : "#0F2E51"
                  }}
                >
                  <div className="font-medium">1kg</div>
                  <div className="text-sm">
                    R$ {product.price1kg}
                  </div>
                </button>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm" style={{ color: '#0F2E51' }}>
                Quantidade:
              </h4>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Informação de Frete */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <div className="text-sm font-medium text-center" style={{ color: '#0F2E51' }}>
                Frete: R$ {shippingCost.toFixed(2).replace(".", ",")}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({quantity}x {selectedSize}):</span>
                <span className="font-medium">R$ {totalPrice}</span>
              </div>
              {originalPrice && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Preço original:</span>
                  <span className="line-through">R$ {originalPrice}</span>
                </div>
              )}
              <div className="pt-2 border-t space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Total do carrinho:</span>
                  <span className="font-medium">R$ {(cartTotal + parseFloat(totalPrice.replace(",", "."))).toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete:</span>
                  <span className="font-medium" style={{ color: '#0F2E51' }}>
                    R$ {shippingCost.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1 border-t">
                  <span>Total final:</span>
                  <span>R$ {(cartTotal + parseFloat(totalPrice.replace(",", ".")) + shippingCost).toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="border-t p-4 space-y-3">
            <Button
              onClick={() => addToCartMutation.mutate()}
              disabled={addToCartMutation.isPending}
              className="w-full text-white font-medium py-3"
              style={{ backgroundColor: '#DDAF36' }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {addToCartMutation.isPending ? "Adicionando..." : "ADICIONAR AO CARRINHO"}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-sm py-2"
                style={{ borderColor: '#0F2E51', color: '#0F2E51' }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Continuar comprando
              </Button>
              <Button
                onClick={() => {
                  setLocation('/checkout');
                  onClose();
                }}
                className="text-sm py-2 text-white"
                style={{ backgroundColor: '#0F2E51' }}
              >
                Finalizar compra
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}