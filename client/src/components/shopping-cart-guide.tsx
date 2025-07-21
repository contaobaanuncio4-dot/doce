import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Truck } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function ShoppingCartGuide() {
  const [location] = useLocation();
  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart']
  });

  // Não mostrar na página de checkout
  if (location === '/checkout') return null;

  const total = cartItems.reduce((sum: number, item: any) => {
    return sum + (parseFloat(item.price?.replace(",", ".") || "0") * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const shippingCost = 9.90;
  const finalTotal = total + shippingCost;

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-sm text-gray-500 line-through">
              Subtotal: R$ {total.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-2xl font-bold" style={{ color: '#DDAF36' }}>
              Total: R$ {finalTotal.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
        <Link href="/checkout">
          <button 
            className="hover:opacity-90 text-white font-bold py-3 px-6 rounded-full transition-colors"
            style={{ backgroundColor: '#0F2E51' }}
          >
            COMPRAR AGORA
          </button>
        </Link>
      </div>
    </div>
  );
}