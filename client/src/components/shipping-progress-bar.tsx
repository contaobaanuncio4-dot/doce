import { useQuery } from "@tanstack/react-query";
import { Truck } from "lucide-react";

export function ShippingProgressBar() {
  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
  });

  const cartTotal = cartItems.reduce((total: number, item: any) => {
    return total + (parseFloat(item.price?.replace(",", ".") || "0") * item.quantity);
  }, 0);

  const freeShippingThreshold = 30;
  const freeShipping = cartTotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const progressPercentage = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  // Não mostrar se o carrinho estiver vazio
  if (cartTotal === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3">
        <Truck className="h-5 w-5 text-blue-600" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-900">
              {freeShipping ? (
                <span className="text-green-600">🎉 Você ganhou frete grátis!</span>
              ) : (
                <span>Faltam R$ {remainingForFreeShipping.toFixed(2).replace(".", ",")} para ganhar frete grátis</span>
              )}
            </span>
            <span className="text-xs text-gray-500">
              R$ {cartTotal.toFixed(2).replace(".", ",")} / R$ 30,00
            </span>
          </div>
          
          {/* Barra de Progresso */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: freeShipping ? '#059669' : '#2563eb'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}