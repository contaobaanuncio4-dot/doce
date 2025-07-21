import { useQuery } from "@tanstack/react-query";
import { Truck } from "lucide-react";

export function ShippingProgressBar() {
  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
  });

  const cartTotal = cartItems.reduce((total: number, item: any) => {
    return total + (parseFloat(item.price?.replace(",", ".") || "0") * item.quantity);
  }, 0);

  const shippingCost = 9.90;

  // Não mostrar se o carrinho estiver vazio
  if (cartTotal === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3">
        <Truck className="h-5 w-5" style={{ color: '#0F2E51' }} />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              Frete: R$ {shippingCost.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-xs text-gray-500">
              Total do carrinho: R$ {cartTotal.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}