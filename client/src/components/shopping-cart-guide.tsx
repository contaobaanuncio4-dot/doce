import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Truck } from "lucide-react";
import { Link } from "wouter";

export default function ShoppingCartGuide() {
  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart']
  });

  const total = cartItems.reduce((sum: number, item: any) => {
    // Assumindo que o item tem preço baseado no peso
    const price = item.weight === "1kg" ? item.product?.price1kg : item.product?.price500g;
    return sum + (parseFloat(price || "0") * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);

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
              R$ {total.toFixed(2).replace('.', ',')}
            </div>

            {/* Indicador de Frete Grátis */}
            {remainingForFreeShipping > 0 ? (
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  Faltam <span className="font-medium text-green-600">
                    R$ {remainingForFreeShipping.toFixed(2).replace('.', ',')}
                  </span> para frete grátis
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">
                  🎉 Frete grátis garantido!
                </span>
              </div>
            )}
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

        {/* Barra de Progresso para Frete Grátis */}
        {remainingForFreeShipping > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: '#DDAF36',
                  width: `${Math.min(100, (total / freeShippingThreshold) * 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}