import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import ShoppingCart from "@/components/shopping-cart";
import ExitIntentModal from "@/components/exit-intent-modal";
import OrderBumpModal from "@/components/order-bump-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Shield, Award, Undo } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useExitIntent } from "@/hooks/use-exit-intent";
import type { Product } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { isCartOpen, setIsCartOpen } = useCart();
  const { showExitIntent, setShowExitIntent } = useExitIntent();
  const [showOrderBump, setShowOrderBump] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["/api/products/featured"],
  });

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : (products as Product[]).filter(p => p.category === selectedCategory);

  const categories = [
    { id: "all", name: "Todos", icon: "🍯" },
    { id: "queijos", name: "Queijos", icon: "🧀" },
    { id: "doces", name: "Doces", icon: "🍯" },
    { id: "combos", name: "Combos", icon: "🎁" },
  ];

  const trustBadges = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Frete Grátis",
      description: "Acima de R$ 150 para todo o Brasil"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Compra Segura",
      description: "Seus dados protegidos"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Qualidade Garantida",
      description: "Produtos artesanais selecionados"
    },
    {
      icon: <Undo className="w-8 h-8" />,
      title: "Devolução Fácil",
      description: "7 dias para trocar ou devolver"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="product-card animate-pulse">
                <div className="w-full h-64 bg-gray-300 rounded-t-2xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="h-12 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="kraft-texture bg-wheat py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
              alt="Paisagem tradicional de Minas Gerais com alimentos artesanais" 
              className="rounded-2xl shadow-2xl mx-auto max-w-4xl w-full h-96 object-cover"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-traditional-blue mb-6 font-serif">
            Sabores Tradicionais de <span className="text-warm-brown">Minas Gerais</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Queijos artesanais, doces caseiros e sabores que trazem o carinho do interior mineiro direto para sua mesa
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="btn-primary"
              onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              🛒 Comprar Agora
            </button>
            <button className="border-2 border-traditional-blue text-traditional-blue px-8 py-4 rounded-full text-lg font-semibold hover:bg-traditional-blue hover:text-white transition-all">
              ▶️ Conheça Nossa História
            </button>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-traditional-blue mb-12 font-serif">
            Nossas Especialidades
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <img 
                src="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Queijos artesanais em tábua de madeira" 
                className="rounded-2xl shadow-lg mx-auto mb-6 w-full h-64 object-cover group-hover:scale-105 transition-transform"
              />
              <h3 className="text-2xl font-bold text-traditional-blue mb-4 font-serif">Queijos Artesanais</h3>
              <p className="text-gray-600 mb-6">Queijos curados tradicionalmente, com sabor único e textura incomparável</p>
              <button 
                className="btn-primary"
                onClick={() => setSelectedCategory("queijos")}
              >
                Ver Queijos
              </button>
            </div>
            
            <div className="text-center group">
              <img 
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Doces brasileiros tradicionais" 
                className="rounded-2xl shadow-lg mx-auto mb-6 w-full h-64 object-cover group-hover:scale-105 transition-transform"
              />
              <h3 className="text-2xl font-bold text-traditional-blue mb-4 font-serif">Doces Caseiros</h3>
              <p className="text-gray-600 mb-6">Doces feitos com amor e receitas tradicionais passadas de geração em geração</p>
              <button 
                className="btn-primary"
                onClick={() => setSelectedCategory("doces")}
              >
                Ver Doces
              </button>
            </div>
            
            <div className="text-center group">
              <img 
                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Cesta de presente com queijos e doces artesanais" 
                className="rounded-2xl shadow-lg mx-auto mb-6 w-full h-64 object-cover group-hover:scale-105 transition-transform"
              />
              <h3 className="text-2xl font-bold text-traditional-blue mb-4 font-serif">Combos Especiais</h3>
              <p className="text-gray-600 mb-6">Combinações perfeitas de queijos e doces para presentear ou saborear</p>
              <button 
                className="btn-primary"
                onClick={() => setSelectedCategory("combos")}
              >
                Ver Combos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="produtos" className="py-16 kraft-texture bg-cornsilk">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-traditional-blue mb-12 font-serif">
            Produtos em Destaque
          </h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold text-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-traditional-blue text-white'
                    : 'bg-white text-traditional-blue border-2 border-traditional-blue hover:bg-traditional-blue hover:text-white'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product: Product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={() => setShowOrderBump(true)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-minas-green text-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  {badge.icon}
                </div>
                <h4 className="text-lg font-semibold text-traditional-blue mb-2">{badge.title}</h4>
                <p className="text-gray-600">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals and Components */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ExitIntentModal isOpen={showExitIntent} onClose={() => setShowExitIntent(false)} />
      <OrderBumpModal isOpen={showOrderBump} onClose={() => setShowOrderBump(false)} />

      {/* WhatsApp Float Button */}
      <a 
        href="https://wa.me/5531999999999" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 left-6 bg-minas-green text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <span className="text-2xl">💬</span>
      </a>
    </div>
  );
}
