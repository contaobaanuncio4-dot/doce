import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface OrderBumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
}

export default function OrderBumpModal({ isOpen, onClose, cartItems }: OrderBumpModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Determinar categoria dominante no carrinho
  const cartCategories = cartItems.map(item => item.product?.category).filter(Boolean);
  const hasQueijos = cartCategories.includes('queijos');
  const hasDoces = cartCategories.includes('doces');
  
  let targetCategory = '';
  if (hasQueijos && hasDoces) {
    targetCategory = 'both'; // Mostrar queijos e doces
  } else if (hasQueijos) {
    targetCategory = 'queijos';
  } else if (hasDoces) {
    targetCategory = 'doces';
  }

  // Filtrar produtos mais caros por categoria (exceto Queijo Chabichou)
  const getExpensiveProducts = (category: string) => {
    return allProducts
      .filter(product => product.category === category && product.name !== "Queijo Chabichou")
      .sort((a, b) => {
        const priceA = parseFloat(a.price500g.replace('R$ ', '').replace(',', '.'));
        const priceB = parseFloat(b.price500g.replace('R$ ', '').replace(',', '.'));
        return priceB - priceA;
      })
      .slice(0, 3); // Top 3 mais caros
  };

  let suggestedProducts: Product[] = [];
  if (targetCategory === 'both') {
    suggestedProducts = [
      ...getExpensiveProducts('queijos').slice(0, 2),
      ...getExpensiveProducts('doces').slice(0, 1)
    ];
  } else if (targetCategory) {
    suggestedProducts = getExpensiveProducts(targetCategory);
  }

  // Plano de assinatura com desconto
  const subscriptionOffer = {
    id: 'clube-tabua',
    name: 'Clube Tábua - Plano Anual',
    description: '3 queijos artesanais por 12 meses',
    originalPrice: 187.90,
    discountedPrice: 75.16, // 60% de desconto
    discount: 60
  };

  const addToCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      const product = allProducts.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');
      
      const originalPrice = parseFloat(product.price500g.replace('R$ ', '').replace(',', '.'));
      const discountedPrice = originalPrice * 0.6; // 40% de desconto
      
      return await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
        weight: "500g",
        price: `R$ ${discountedPrice.toFixed(2).replace('.', ',')}`,
        sessionId: 'default-session'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const handleProductToggle = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddSelected = () => {
    selectedProducts.forEach(productId => {
      addToCartMutation.mutate(productId);
    });
    onClose();
  };

  const handleSubscriptionAdd = () => {
    // Abrir link direto de checkout da assinatura anual
    window.open('https://pay.tabuademinas.fun/68876277ed44f872dda1f5f6', '_blank');
    onClose();
  };

  // Não mostrar se carrinho estiver vazio ou só tiver produtos de assinatura
  if (cartItems.length === 0 || !targetCategory) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold" style={{ color: '#0F2E51' }}>
              🎯 Aproveite esta oferta especial!
            </DialogTitle>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Produtos relacionados com 40% de desconto */}
          {suggestedProducts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#0F2E51' }}>
                Produtos Premium com 40% OFF
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestedProducts.map((product) => {
                  const originalPrice = parseFloat(product.price500g.replace('R$ ', '').replace(',', '.'));
                  const discountedPrice = originalPrice * 0.6;
                  const isSelected = selectedProducts.includes(product.id);
                  
                  return (
                    <div 
                      key={product.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleProductToggle(product.id)}
                    >
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-sm mb-2">{product.name}</h4>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 line-through">
                          R$ {originalPrice.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-lg font-bold" style={{ color: '#0F2E51' }}>
                          R$ {discountedPrice.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          40% OFF
                        </div>
                      </div>
                      {isSelected && (
                        <div className="mt-2 text-center">
                          <span className="text-green-600 font-medium text-sm">✓ Selecionado</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {selectedProducts.length > 0 && (
                <div className="text-center mt-4">
                  <Button
                    onClick={handleAddSelected}
                    className="text-white font-bold px-6 py-2"
                    style={{ backgroundColor: '#0F2E51' }}
                    disabled={addToCartMutation.isPending}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {addToCartMutation.isPending ? "Adicionando..." : `Adicionar ${selectedProducts.length} produto(s)`}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Separador */}
          <div className="border-t pt-6">
            <div className="text-center text-gray-500 text-sm mb-6">ou</div>
          </div>

          {/* Clube Tábua com 60% de desconto */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6 border-2 border-yellow-300">
            <div className="text-center">
              <div className="text-red-600 font-bold text-sm mb-2">
                🔥 OFERTA LIMITADA - 60% OFF
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#0F2E51' }}>
                {subscriptionOffer.name}
              </h3>
              <p className="text-gray-700 mb-4">{subscriptionOffer.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="text-lg text-gray-500 line-through">
                  De R$ {subscriptionOffer.originalPrice.toFixed(2).replace('.', ',')}/mês
                </div>
                <div className="text-3xl font-bold" style={{ color: '#DDAF36' }}>
                  Por R$ {subscriptionOffer.discountedPrice.toFixed(2).replace('.', ',')}/mês
                </div>
                <div className="text-green-600 font-bold">
                  ECONOMIZE R$ {(subscriptionOffer.originalPrice - subscriptionOffer.discountedPrice).toFixed(2).replace('.', ',')}/mês
                </div>
              </div>

              <Button
                onClick={handleSubscriptionAdd}
                className="text-white font-bold px-8 py-3 text-lg"
                style={{ backgroundColor: '#DDAF36' }}
              >
                Assinar com 60% OFF
              </Button>
              
              <div className="text-xs text-gray-600 mt-2">
                ✓ Sem frete ✓ Queijos artesanais ✓ Entrega mensal garantida
              </div>
            </div>
          </div>

          {/* Botão para continuar sem order bump */}
          <div className="text-center pt-4 border-t">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              Não, obrigado. Continuar com meu pedido atual.
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}