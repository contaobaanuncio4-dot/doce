import { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingCart, Package } from "lucide-react";
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

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  weight: string;
  product?: Product;
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

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart", "default-session"],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, newQuantity }: { itemId: number; newQuantity: number }) => {
      return await apiRequest("PUT", `/api/cart/${itemId}`, { quantity: newQuantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", "default-session"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", "default-session"] });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const price = selectedSize === "500g" ? product?.price500g : product?.price1kg;
      return await apiRequest("POST", "/api/cart", {
        productId: product?.id,
        quantity,
        weight: selectedSize,
        price: price,
        sessionId: 'default-session'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", "default-session"] });
    },
  });

  const subtotal = cartItems.reduce((sum: number, item: CartItem) => {
    return sum + (parseFloat(item.price?.replace(",", ".") || "0") * item.quantity);
  }, 0);

  const shippingCost = 9.90;
  const finalTotal = subtotal + shippingCost;

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantityMutation.mutate({ itemId, newQuantity });
    }
  };

  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate(itemId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#0F2E51' }}>
              <ShoppingCart className="w-5 h-5" />
              Carrinho ({cartItems.length})
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Seu carrinho está vazio</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border border-gray-200 rounded-lg">
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {item.product?.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold" style={{ color: '#0F2E51' }}>
                        R$ {item.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          {cartItems.length > 0 && (
            <>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete:</span>
                  <span style={{ color: '#0F2E51' }}>R$ 9,90</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span style={{ color: '#0F2E51' }}>
                    R$ {finalTotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setLocation('/checkout');
                  onClose();
                }}
                className="w-full hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors mt-6"
                style={{ backgroundColor: '#0F2E51' }}
              >
                FINALIZAR COMPRA
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}