import { ShoppingCart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface HeaderProps {
  onCartToggle: () => void;
}

export default function Header({ onCartToggle }: HeaderProps) {
  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart']
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
              <Button variant="ghost" size="sm" className="md:hidden">
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
    </>
  );
}