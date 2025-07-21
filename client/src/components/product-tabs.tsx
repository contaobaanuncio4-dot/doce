import { useState } from "react";
import ProductCardTabua from "./product-card-tabua";

interface ProductTabsProps {
  doces: any[];
  queijos: any[];
}

export default function ProductTabs({ doces, queijos }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("doces");

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
                  >
                    Doces Mais Vendidos
                  </button>
                  <button 
                    type="button" 
                    className={`tabs-nav__item px-6 py-3 rounded-md font-medium transition-all ${
                      activeTab === 'queijos' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('queijos')}
                  >
                    Queijos Linha Premium
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
            </div>
          )}
          
          {activeTab === 'queijos' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {queijos.slice(0, 8).map((product: any) => (
                <ProductCardTabua key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Botão de Ver Mais apenas para doces */}
        {activeTab === 'doces' && (
          <div className="text-center mt-8">
            <button 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              style={{ backgroundColor: '#0F2E51' }}
            >
              VER TODOS OS DOCES
            </button>
          </div>
        )}
      </div>
    </section>
  );
}