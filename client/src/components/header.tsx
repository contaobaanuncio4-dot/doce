import { ShoppingCart, Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";

interface HeaderProps {
  onCartToggle: () => void;
}

export default function Header({ onCartToggle }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sessionId = sessionStorage.getItem('sessionId') || 'default-session';
  
  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart'],
    queryFn: () => fetch(`/api/cart?sessionId=${sessionId}`).then(res => res.json()),
    enabled: !!sessionId,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 // Atualizar a cada 1 segundo
  });

  const totalItems = Array.isArray(cartItems) ? cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;

  return (
    <>
      {/* Barra de promoção */}
      <div className="text-white text-center py-2 text-sm font-medium" style={{ backgroundColor: '#0F2E51' }}>
        🧀 Queijos e Doces Artesanais de Minas Gerais 🍯
      </div>
      
      {/* Header principal */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Menu mobile e navegação esquerda */}
            <div className="flex items-center space-x-8">
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              {/* Navegação desktop - lado esquerdo */}
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-700 font-medium hover:opacity-75" style={{ color: '#0F2E51' }}>
                  Início
                </Link>
                <div className="relative group">
                  <button className="font-medium flex items-center hover:opacity-75" style={{ color: '#0F2E51' }}>
                    Produtos
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Doces - Tábua de Minas
                      </Link>
                      <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Queijos - Tábua de Minas
                      </Link>
                      <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Queijos Linha Premium
                      </Link>
                      <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Doces Mais Vendidos
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            {/* Logo Centralizada */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
              <Link href="/">
                <img 
                  src="https://i.imgur.com/RYEyg5c.png" 
                  alt="Tábua de Minas" 
                  className="h-20 w-auto cursor-pointer hover:opacity-75"
                />
              </Link>
            </div>

            {/* Navegação desktop - lado direito */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/track-order" className="text-gray-700 font-medium hover:opacity-75" style={{ color: '#0F2E51' }}>
                Rastreie seu pedido
              </Link>
              <Link href="/contact" className="text-gray-700 font-medium hover:opacity-75" style={{ color: '#0F2E51' }}>
                Contato
              </Link>
            </nav>

            {/* Ações do usuário */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Search className="h-5 w-5" />
              </Button>
              
              

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCartToggle}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-white text-xs" style={{ backgroundColor: '#DDAF36' }}>
                    {totalItems}
                  </Badge>
                )}
                <span className="hidden md:ml-2 md:inline">Carrinho</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto">
            {/* Header do Menu */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: '#0F2E51' }}>
                  Menu
                </h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Navegação Mobile */}
            <div className="p-4">
              <nav className="space-y-4">
                <Link 
                  href="/" 
                  className="block py-3 px-4 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ color: '#0F2E51' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Início
                </Link>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">PRODUTOS</h3>
                  <Link 
                    href="/"
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Doces - Tábua de Minas
                  </Link>
                  <Link 
                    href="/"
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Queijos - Tábua de Minas
                  </Link>
                  <Link 
                    href="/"
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Clube Tábua - Assinatura
                  </Link>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">ATENDIMENTO</h3>
                  <Link 
                    href="/track-order" 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Rastreie seu pedido
                  </Link>
                  <Link 
                    href="/contact" 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contato
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}