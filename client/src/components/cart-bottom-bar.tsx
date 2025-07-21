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
      <div className="px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Informações do carrinho - compacta para mobile */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#0F2E51' }} />
              <Badge 
                className="text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center"
                style={{ backgroundColor: '#DDAF36' }}
              >
                {totalItems}
              </Badge>
            </div>
            
            <div className="text-xs sm:text-sm min-w-0">
              <div className="font-bold truncate" style={{ color: '#0F2E51' }}>
                R$ {finalTotal.toFixed(2).replace(".", ",")}
              </div>

            </div>
          </div>

          {/* Botão de ação - responsivo */}
          <Button
            onClick={() => setLocation('/checkout')}
            className="text-white font-bold rounded-full hover:opacity-90 transition-opacity flex-shrink-0 text-xs sm:text-sm px-4 py-2 sm:px-6"
            style={{ backgroundColor: '#DDAF36' }}
          >
            <span className="hidden sm:inline">FINALIZAR COMPRA</span>
            <span className="sm:hidden">COMPRAR</span>
          </Button>
        </div>
      </div>
    </div>
  );
}