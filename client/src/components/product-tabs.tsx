import { useState, useEffect } from "react";
import ProductCardTabua from "./product-card-tabua";
import { useLocation } from "wouter";

interface ProductTabsProps {
  doces: any[];
  queijos: any[];
}

export default function ProductTabs({ doces, queijos }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("doces");
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Temporizador promocional - termina em 24 horas
  useEffect(() => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header com Promoção */}
        <header className="section__header mb-8">
          <div className="text-container text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              DELÍCIAS MINEIRAS - PREMIUM
            </h3>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 inline-block">
              <p className="text-yellow-800 font-semibold">
                🎁 Promoção do Mês: Compre 3 produtos e ganhe um Queijo Brie grátis!
              </p>
            </div>
          </div>
          
          {/* Navegação por Abas */}
          <div className="tabs-nav tabs-nav--center tabs-nav--edge2edge">
            <div className="tabs-nav__scroller">
              <div className="tabs-nav__scroller-inner">
                <div className="tabs-nav__item-list flex justify-center space-x-1 bg-gray-200 rounded-lg p-1">
                  <button 
                    type="button" 
                    className={`tabs-nav__item px-6 py-3 rounded-md font-medium transition-all ${
                      activeTab === 'doces' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('doces')}
                  >Doces </button>
                  <button 
                    type="button" 
                    className={`tabs-nav__item px-6 py-3 rounded-md font-medium transition-all ${
                      activeTab === 'queijos' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('queijos')}
                  >Queijos</button>
                  <button 
                    type="button" 
                    className={`tabs-nav__item px-6 py-3 rounded-md font-medium transition-all relative ${
                      activeTab === 'clube' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('clube')}
                  >
                    Clube Tábua
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      NOVO
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo das Abas */}
        <div className="tab-content">
          {activeTab === 'doces' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {doces.slice(0, 10).map((product: any) => (
                <ProductCardTabua key={product.id} product={product} />
              ))}
              {doces.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Nenhum doce encontrado.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'queijos' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {queijos.slice(0, 8).map((product: any) => (
                <ProductCardTabua key={product.id} product={product} />
              ))}
              {queijos.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Nenhum queijo encontrado.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'clube' && (
            <div className="max-w-6xl mx-auto">
              {/* Header do Clube */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0F2E51' }}>
                  Clube de Assinatura Tábua de Minas
                </h2>
                <p className="text-xl text-gray-700 mb-6">
                  O sabor da roça direto pra sua casa, todo mês!
                </p>
                
                {/* Temporizador Promocional */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg mb-6 mx-auto max-w-md">
                  <p className="font-bold text-lg mb-2">OFERTA LIMITADA!</p>
                  <p className="text-sm mb-2">Esta promoção termina em:</p>
                  <div className="flex justify-center space-x-4 text-2xl font-bold">
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded px-2 py-1">
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs mt-1">HORAS</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded px-2 py-1">
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs mt-1">MIN</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded px-2 py-1">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs mt-1">SEG</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Como Funciona */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: '#0F2E51' }}>
                  Como Funciona
                </h3>
                <p className="text-gray-700 text-center text-lg">
                  Assine um dos nossos planos e receba todo mês uma seleção especial de queijos mineiros, 
                  direto da fazenda pra sua mesa. Tudo com aquele cheirinho de Minas que a gente ama!
                </p>
              </div>

              {/* Planos */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Plano Semestral */}
                <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-transparent hover:border-yellow-400 transition-all">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold mb-2" style={{ color: '#0F2E51' }}>
                      Plano Semestral
                    </h4>
                    <div className="mb-4">
                      <span className="text-4xl font-bold" style={{ color: '#DDAF36' }}>
                        R$ 187,90
                      </span>
                      <span className="text-gray-600">/mês</span>
                    </div>
                    <p className="text-gray-700 mb-6">
                      3 queijos selecionados por 6 meses
                    </p>
                    <button 
                      onClick={() => setLocation('/checkout?plan=semestral&price=187.90')}
                      className="w-full py-3 px-6 rounded-lg font-bold text-white transition-all hover:transform hover:scale-105"
                      style={{ backgroundColor: '#0F2E51' }}
                    >
                      Assine Aqui
                    </button>
                  </div>
                </div>

                {/* Plano Anual - Destaque */}
                <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-yellow-400 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                      MAIS POPULAR
                    </span>
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold mb-2" style={{ color: '#0F2E51' }}>
                      Plano Anual
                    </h4>
                    <div className="mb-2">
                      <span className="text-gray-500 line-through text-lg">R$ 187,90</span>
                    </div>
                    <div className="mb-4">
                      <span className="text-4xl font-bold" style={{ color: '#DDAF36' }}>
                        R$ 139,90
                      </span>
                      <span className="text-gray-600">/mês</span>
                      <div className="text-green-600 font-bold text-sm">
                        ECONOMIZE R$ 576,00
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6">
                      3 queijos por 12 meses, com desconto especial
                    </p>
                    <button 
                      onClick={() => setLocation('/checkout?plan=anual&price=139.90')}
                      className="w-full py-3 px-6 rounded-lg font-bold text-white transition-all hover:transform hover:scale-105"
                      style={{ backgroundColor: '#DDAF36' }}
                    >
                      Assine Aqui
                    </button>
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#0F2E51' }}>
                  Benefícios do Clube
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DDAF36' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4"/>
                        <circle cx="12" cy="12" r="9"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Queijos artesanais com curadoria</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DDAF36' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13"/>
                        <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Entrega garantida mensal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DDAF36' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Dicas de harmonização exclusivas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DDAF36' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="21" r="1"/>
                        <circle cx="19" cy="21" r="1"/>
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Desconto especial na loja online</span>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#0F2E51' }}>
                  Dúvidas Frequentes
                </h3>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Posso cancelar quando quiser?
                    </h4>
                    <p className="text-gray-700">
                      Sim! É só entrar em contato com nosso atendimento.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Posso mudar o endereço de entrega?
                    </h4>
                    <p className="text-gray-700">
                      Claro! É só atualizar no seu cadastro ou falar com a gente com antecedência.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>


      </div>
    </section>
  );
}