import { useQuery } from "@tanstack/react-query";
import { X, ShoppingCart as CartIcon, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const [, setLocation] = useLocation();
  const { sessionId, updateQuantity, removeFromCart } = useCart();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart", sessionId],
    enabled: !!sessionId && isOpen,
  });

  const total = cartItems.reduce((sum: number, item: any) => {
    return sum + (parseFloat(item.product?.price || "0") * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    setLocation("/checkout");
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className={`cart-slide fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto ${isOpen ? 'open' : ''}`}>
      <CardHeader className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-traditional-blue flex items-center">
            <CartIcon className="w-6 h-6 mr-2" />
            Seu Carrinho
            {totalItems > 0 && (
              <Badge className="ml-2 bg-minas-green text-white">
                {totalItems}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-traditional-blue mb-2">
              Carrinho vazio
            </h3>
            <p className="text-gray-600 mb-6">
              Adicione alguns produtos deliciosos!
            </p>
            <Button 
              onClick={onClose}
              className="btn-primary"
            >
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <div>
            <div className="space-y-4 mb-6">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200">
                  <img 
                    src={item.product?.imageUrl} 
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-traditional-blue text-sm">
                      {item.product?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.product?.weight}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold text-minas-green">
                        R$ {(parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Subtotal:</span>
                <span className="text-sm">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Frete:</span>
                <span className="text-sm text-minas-green">
                  {total >= 150 ? "Grátis" : "R$ 15,00"}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-traditional-blue">Total:</span>
                <span className="text-2xl font-bold text-minas-green">
                  R$ {(total + (total >= 150 ? 0 : 15)).toFixed(2)}
                </span>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full btn-primary mb-4"
              >
                💳 Finalizar Compra
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                <p>📱 Pagamento seguro via PIX</p>
                <p>🚚 Frete grátis acima de R$ 150</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
