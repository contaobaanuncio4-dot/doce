import { useQuery } from "@tanstack/react-query";
import ProductCardTabua from "@/components/product-card-tabua";
import Header from "@/components/header";
import PromoBanner from "@/components/promo-banner";
import ExitIntentModal from "@/components/exit-intent-modal";
import OrderBumpModal from "@/components/order-bump-modal";
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
      {/* Banner de Frete Grátis */}
      <div className="bg-green-600 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
          🚚 Frete grátis a partir de R$ 40,00 para todo o Brasil!
        </p>
      </div>
      
      <Header onCartToggle={onCartToggle} />



      {/* Seção de Doces Mais Vendidos */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Doces Mais Vendidos - Tábua de Minas
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {doces.slice(0, 10).map((product: any) => (
              <ProductCardTabua key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-tabua-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-tabua-green/90 transition-colors">
              CONFERIR DOCES MAIS VENDIDOS
            </button>
          </div>
        </div>
      </section>

      {/* Seção de Queijos */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Queijos - Tábua de Minas
            </h2>
            <div className="bg-tabua-yellow/20 rounded-lg p-4 inline-block">
              <p className="font-semibold text-gray-800">
                🧀 Queijos artesanais direto das montanhas de Minas
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {queijos.slice(0, 12).map((product: any) => (
              <ProductCardTabua key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

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
      />
    </div>
  );
}