import { useState } from "react";
import { ShoppingCart, Menu, X, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  onCartClick?: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { sessionId, setIsCartOpen } = useCart();

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart", sessionId],
    enabled: !!sessionId,
  });

  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    } else {
      setIsCartOpen(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="bg-traditional-blue text-white text-center py-2 text-sm">
          <p>
            <span className="mr-2">🚚</span>
            Frete GRÁTIS para todo o Brasil em compras acima de R$ 150
          </p>
        </div>
        
        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <div className="bg-warm-brown text-white rounded-full w-16 h-16 flex items-center justify-center mr-4">
              <Utensils className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-traditional-blue font-serif">
                Tábua de Minas
              </h1>
              <p className="text-sm text-gray-600">
                Doces e Queijos Artesanais
              </p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-lg font-semibold text-traditional-blue hover:text-warm-brown transition-colors"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('produtos')}
              className="text-lg font-semibold text-traditional-blue hover:text-warm-brown transition-colors"
            >
              Produtos
            </button>
            <button 
              onClick={() => scrollToSection('sobre')}
              className="text-lg font-semibold text-traditional-blue hover:text-warm-brown transition-colors"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('contato')}
              className="text-lg font-semibold text-traditional-blue hover:text-warm-brown transition-colors"
            >
              Contato
            </button>
          </nav>
          
          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="lg"
              onClick={handleCartClick}
              className="relative"
            >
              <ShoppingCart className="w-6 h-6 text-traditional-blue" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-traditional-blue" />
              ) : (
                <Menu className="w-6 h-6 text-traditional-blue" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-lg font-semibold text-traditional-blue hover:text-warm-brown transition-colors text-left"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection('produtos')}
                className="text-lg font-semibold text-traditional-blue hover:text-warm-brown transition-colors text-left"
              >
                Produtos
              </button>
              <button 
                onClick={() => scrollToSection('sobre')}
                className="text-lg font-semibold text-traditional-blue hover:text-warm-brown transition-colors text-left"
              >
                Sobre
              </button>
              <button 
                onClick={() => scrollToSection('contato')}
                className="text-lg font-semibold text-traditional-blue hover:text-warm-brown transition-colors text-left"
              >
                Contato
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
