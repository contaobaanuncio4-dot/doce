import { useQuery } from "@tanstack/react-query";
import ProductCardTabua from "@/components/product-card-tabua";
import Header from "@/components/header";
import PromoBanner from "@/components/promo-banner";
import ExitIntentModal from "@/components/exit-intent-modal";
import OrderBumpModal from "@/components/order-bump-modal";
import { ShippingProgressBar } from "@/components/shipping-progress-bar";
import ProductTabs from "@/components/product-tabs";
import { useState, useEffect } from "react";

interface HomeTabuaProps {
  onCartToggle: () => void;
}

export function HomeTabua({ onCartToggle }: HomeTabuaProps) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"]
  });

  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showOrderBump, setShowOrderBump] = useState(false);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header onCartToggle={onCartToggle} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-tabua-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Separar produtos por categoria baseado no site original
  const doces = products.filter((product: any) => 
    product.category === 'doces' || product.name.toLowerCase().includes('doce')
  );
  const queijos = products.filter((product: any) => 
    product.category === 'queijos' || product.name.toLowerCase().includes('queijo')
  );

  return (
    <div className="min-h-screen bg-white">
      <Header onCartToggle={onCartToggle} />

      {/* Barra de Progresso de Frete */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <ShippingProgressBar />
        </div>
      </div>

      {/* Seção de Produtos com Abas */}
      <ProductTabs doces={doces} queijos={queijos} />

      {/* Banner Promocional */}
      <PromoBanner />

      {/* Footer simples */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4">Tábua de Minas</h3>
          <p className="text-gray-400 mb-4">Doces e Queijos Artesanais</p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-tabua-yellow">Sobre</a>
            <a href="#" className="hover:text-tabua-yellow">Contato</a>
            <a href="#" className="hover:text-tabua-yellow">Rastreamento</a>
            <a href="#" className="hover:text-tabua-yellow">Política de Privacidade</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExitIntentModal 
        isOpen={showExitIntent} 
        onClose={() => setShowExitIntent(false)} 
      />
      <OrderBumpModal 
        isOpen={showOrderBump} 
        onClose={() => setShowOrderBump(false)} 
        cartItems={[]} 
      />
    </div>
  );
}