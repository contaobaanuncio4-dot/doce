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
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Informações do Carrinho */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" style={{ color: '#0F2E51' }} />
              <span className="font-medium" style={{ color: '#0F2E51' }}>
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
            </div>
            
            <div className="text-xl font-bold" style={{ color: '#DDAF36' }}>
              R$ {finalTotal.toFixed(2).replace('.', ',')}
            </div>


          </div>

          {/* Botão Finalizar Compra */}
          <Link href="/checkout">
            <Button 
              className="text-white font-semibold px-6 py-2 hover:opacity-90"
              style={{ backgroundColor: '#0F2E51' }}
            >
              Finalizar Compra
            </Button>
          </Link>
        </div>


      </div>
    </div>
  );
}