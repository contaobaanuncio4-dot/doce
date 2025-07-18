import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Gift } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { apiRequest } from "@/lib/queryClient";

interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExitIntentModal({ isOpen, onClose }: ExitIntentModalProps) {
  const [isAccepted, setIsAccepted] = useState(false);
  const { toast } = useToast();
  const { sessionId } = useCart();

  const applyDiscountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/apply-discount", {
        sessionId,
        discountType: "exit_intent"
      });
      return response.json();
    },
    onSuccess: (data) => {
      setIsAccepted(true);
      toast({
        title: "Desconto aplicado!",
        description: data.message,
      });
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Erro ao aplicar desconto",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAcceptDiscount = () => {
    applyDiscountMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="exit-intent-modal">
      <div className="bounce-in">
        <Card className="max-w-md mx-auto relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 z-10"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <CardContent className="p-8 text-center">
            {!isAccepted ? (
              <>
                <div className="mb-6">
                  <div className="bg-red-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-traditional-blue mb-2">
                    Ei! Antes de sair...
                  </h2>
                  <p className="text-gray-600">
                    Você acabou de ganhar{" "}
                    <span className="font-bold text-red-500">10% de desconto</span>{" "}
                    em todos os produtos!
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    onClick={handleAcceptDiscount}
                    className="w-full bg-minas-green text-white py-4 rounded-full font-semibold text-lg hover:bg-green-600 transition-colors"
                    disabled={applyDiscountMutation.isPending}
                  >
                    {applyDiscountMutation.isPending ? (
                      "Aplicando desconto..."
                    ) : (
                      <>
                        🏷️ Quero meu desconto!
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={onClose}
                    variant="outline"
                    className="w-full border-2 border-gray-300 text-gray-600 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Não, obrigado
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-minas-green mb-2">
                  Desconto aplicado!
                </h2>
                <p className="text-gray-600">
                  Todos os produtos agora têm 10% de desconto.
                  Continue comprando e aproveite!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
