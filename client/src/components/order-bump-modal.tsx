import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { apiRequest } from "@/lib/queryClient";

interface OrderBumpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const orderBumpProduct = {
  id: 999,
  name: "Doce de Leite Premium",
  description: "500g - Receita especial da vovó",
  price: "35.00",
  imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  discount: 30,
  weight: "500g"
};

export default function OrderBumpModal({ isOpen, onClose }: OrderBumpModalProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { toast } = useToast();
  const { sessionId, addToCart } = useCart();

  const addOrderBumpMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/apply-discount", {
        sessionId,
        discountType: "order_bump"
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Add the order bump product to cart
      addToCart({
        ...orderBumpProduct,
        price: (parseFloat(orderBumpProduct.price) * 0.7).toFixed(2) // Apply 30% discount
      }, 1);
      
      setIsAdded(true);
      toast({
        title: "Produto adicionado!",
        description: "Doce de Leite Premium foi adicionado ao seu pedido com desconto!",
      });
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddOrderBump = () => {
    addOrderBumpMutation.mutate();
  };

  if (!isOpen) return null;

  const originalPrice = parseFloat(orderBumpProduct.price);
  const discountedPrice = originalPrice * 0.7; // 30% discount

  return (
    <div className="exit-intent-modal">
      <div className="bounce-in">
        <Card className="max-w-lg mx-auto relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 z-10"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <CardContent className="p-8">
            {!isAdded ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-traditional-blue mb-2">
                    Oferta Especial!
                  </h2>
                  <p className="text-gray-600">
                    Antes de finalizar, que tal levar esse doce de leite por apenas:
                  </p>
                </div>
                
                <div className="flex items-center bg-gray-50 rounded-xl p-4 mb-6">
                  <img 
                    src={orderBumpProduct.imageUrl} 
                    alt={orderBumpProduct.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-traditional-blue">
                      {orderBumpProduct.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {orderBumpProduct.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-gray-500 line-through text-sm">
                        R$ {originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xl font-bold text-red-500 ml-2">
                        R$ {discountedPrice.toFixed(2)}
                      </span>
                      <Badge className="bg-red-500 text-white text-xs ml-2">
                        -30%
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    onClick={handleAddOrderBump}
                    className="w-full bg-minas-green text-white py-4 rounded-full font-semibold text-lg hover:bg-green-600 transition-colors"
                    disabled={addOrderBumpMutation.isPending}
                  >
                    {addOrderBumpMutation.isPending ? (
                      "Adicionando..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Sim, quero adicionar!
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={onClose}
                    variant="outline"
                    className="w-full border-2 border-gray-300 text-gray-600 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Não, apenas finalizar
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-minas-green mb-2">
                  Produto adicionado!
                </h2>
                <p className="text-gray-600">
                  O Doce de Leite Premium foi adicionado ao seu pedido com desconto especial.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
