import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface CartBottomBarProps {
  isVisible: boolean;
}

export default function CartBottomBar({ isVisible }: CartBottomBarProps) {
  const [, setLocation] = useLocation();
  
  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
  });

  const cartArray = Array.isArray(cartItems) ? cartItems : [];

  if (!isVisible || cartArray.length === 0) return null;

  const totalItems = cartArray.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const totalValue = cartArray.reduce((total: number, item: any) => {
    const price = parseFloat(item.price?.replace(",", ".") || "0");
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0);
  
  const shippingCost = 9.90;
  const finalTotal = totalValue + shippingCost;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 shadow-lg" style={{ borderColor: '#DDAF36' }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Informações do carrinho */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" style={{ color: '#0F2E51' }} />
              <Badge 
                className="text-white text-xs font-bold"
                style={{ backgroundColor: '#DDAF36' }}
              >
                {totalItems}
              </Badge>
            </div>
            
            <div className="text-sm">
              <div className="font-medium" style={{ color: '#0F2E51' }}>
                Total: R$ {finalTotal.toFixed(2).replace(".", ",")}
              </div>
              <div className="text-xs text-gray-600">
                Produtos: R$ {totalValue.toFixed(2).replace(".", ",")} + Frete: R$ {shippingCost.toFixed(2).replace(".", ",")}
              </div>
            </div>
          </div>

          {/* Botão de ação */}
          <Button
            onClick={() => setLocation('/checkout')}
            className="text-white font-bold px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#DDAF36' }}
          >
            COMPRAR AGORA
          </Button>
        </div>
      </div>
    </div>
  );
}