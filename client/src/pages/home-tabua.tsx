import { useQuery } from "@tanstack/react-query";
import ProductCardTabua from "@/components/product-card-tabua";
import Header from "@/components/header";
import PromoBanner from "@/components/promo-banner";
import ExitIntentModal from "@/components/exit-intent-modal";
import OrderBumpModal from "@/components/order-bump-modal";

import ProductTabs from "@/components/product-tabs";
import CartBottomBar from "@/components/cart-bottom-bar";
import { useState, useEffect } from "react";
// Preload removido para resolver problemas de build no Netlify
import ProductSkeleton from "@/components/product-skeleton";
import type { Product, CartItem } from "@shared/schema";

interface HomeTabuaProps {
  onCartToggle: () => void;
}

export function HomeTabua({ onCartToggle }: HomeTabuaProps) {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  // Preload de imagens removido para resolver problemas de build

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"]
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
        <PromoBanner />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Separar produtos por categoria baseado no site original
  const doces = products.filter((product: Product) => 
    product.category === 'doces' || product.name.toLowerCase().includes('doce')
  );
  const queijos = products.filter((product: Product) => 
    product.category === 'queijos' || product.name.toLowerCase().includes('queijo')
  );

  return (
    <div className="min-h-screen bg-white">
      <Header onCartToggle={onCartToggle} />



      {/* Seção de Produtos com Abas */}
      <ProductTabs doces={doces} queijos={queijos} />

      {/* Banner Promocional */}
      <PromoBanner />

      {/* Seção de Reviews dos Clientes */}
      <section id="reviews" className="py-12" style={{ backgroundColor: '#F7F3EF' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8" style={{ color: '#0F2E51' }}>
              O que nossos clientes estão dizendo
            </h2>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold mb-2" style={{ color: '#0F2E51' }}>4.9</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">Baseado em 847 avaliações</p>
                  </div>
                </div>
                
                <div className="md:w-2/3 grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      "Queijos excepcionais! O sabor é autêntico, realmente artesanal. Entrega rápida e produto fresco."
                    </p>
                    <p className="text-xs text-gray-500">- Maria Silva, São Paulo</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      "Os doces são divinos! Sabor da roça de verdade. Já comprei várias vezes e sempre surpreende."
                    </p>
                    <p className="text-xs text-gray-500">- João Santos, Rio de Janeiro</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      "Atendimento perfeito e qualidade impecável. Os produtos chegaram bem embalados e no prazo."
                    </p>
                    <p className="text-xs text-gray-500">- Ana Costa, Belo Horizonte</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      "Produtos tradicionais de Minas com sabor autêntico. Recomendo para toda família!"
                    </p>
                    <p className="text-xs text-gray-500">- Carlos Pereira, Brasília</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção do Instagram */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8" style={{ color: '#0F2E51' }}>
              Siga nosso Instagram
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Acompanhe as novidades, receitas e bastidores da nossa produção artesanal
            </p>
            
            <div className="container">
              <div className="html">
                <script src="https://cdn.lightwidget.com/widgets/lightwidget.js"></script>
                <iframe 
                  src="https://cdn.lightwidget.com/widgets/20b00a80a60b5d258c6da2e89f2aa859.html" 
                  scrolling="no" 
                  allowTransparency={true}
                  className="lightwidget-widget" 
                  style={{ 
                    width: '100%', 
                    border: '0px', 
                    overflow: 'hidden', 
                    height: '834px' 
                  }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Confiança e Segurança */}
      <section className="py-12" style={{ backgroundColor: '#FEF7E0' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-8" style={{ color: '#0F2E51' }}>
            Por que escolher a Tábua de Minas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#DDAF36' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="9"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#0F2E51' }}>Qualidade Garantida</h3>
              <p className="text-gray-600 text-sm">Produtos artesanais selecionados com rigoroso controle de qualidade</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#DDAF36' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="m7 11 0-5a5 5 0 0 1 10 0v5"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#0F2E51' }}>Compra 100% Segura</h3>
              <p className="text-gray-600 text-sm">Seus dados protegidos com criptografia e pagamento via PIX seguro</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#DDAF36' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#0F2E51' }}>Entrega Rápida</h3>
              <p className="text-gray-600 text-sm">Produtos frescos entregues com agilidade e cuidado especial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Sobre a Empresa */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md border" style={{ borderColor: '#DDAF36' }}>
              <h3 className="text-xl font-serif font-bold text-center mb-4" style={{ color: '#0F2E51' }}>
                Sobre a Tábua de Minas
              </h3>
              <p className="text-gray-700 mb-4 text-center">
                A Tábua de Minas é uma empresa 100% brasileira especializada em produtos tradicionais artesanais de Minas Gerais. 
                Mais de 5.000 pedidos entregues com qualidade, cuidado e rastreamento completo. 
                Nosso compromisso é com a sua experiência – do sabor autêntico à entrega segura.
              </p>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FEF7E0' }}>
                <p className="font-bold text-center mb-2" style={{ color: '#0F2E51' }}>
                  Nossos Diferenciais:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-center">
                  <div>
                    <span className="font-semibold" style={{ color: '#0F2E51' }}>5.000+</span>
                    <br />Pedidos entregues
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: '#0F2E51' }}>100%</span>
                    <br />Produtos artesanais
                  </div>
                  <div>
                    <span className="font-semibold" style={{ color: '#0F2E51' }}>4.9★</span>
                    <br />Avaliação dos clientes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer simples - com padding bottom para barra de carrinho */}
      <footer className="bg-gray-900 text-white py-8" style={{ paddingBottom: cartItems.length > 0 ? '70px' : '32px' }}>
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

      {/* Barra de Carrinho Fixa */}
      <CartBottomBar isVisible={cartItems.length > 0} />
    </div>
  );
}