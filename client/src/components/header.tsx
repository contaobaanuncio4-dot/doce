import { ShoppingCart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  onCartToggle: () => void;
}

export default function Header({ onCartToggle }: HeaderProps) {
  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart']
  });

  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <>
      {/* Barra de promoção */}
      <div className="bg-tabua-green text-white text-center py-2 text-sm font-medium">
        Frete Grátis na Tábua de Minas 🧀
      </div>
      
      {/* Header principal */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Menu mobile */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-tabua-green">
                Tábua de Minas
              </h1>
            </div>

            {/* Navegação desktop */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-tabua-green font-medium">
                Início
              </a>
              <a href="#" className="text-gray-700 hover:text-tabua-green font-medium">
                Clube da Tábua
              </a>
              <div className="relative group">
                <button className="text-gray-700 hover:text-tabua-green font-medium flex items-center">
                  Produtos
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Tudo da Vendinha!
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Doces - Tábua de Minas
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Queijos - Tábua de Minas
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Queijos Linha Premium
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Doces Mais Vendidos
                    </a>
                  </div>
                </div>
              </div>
              <a href="#" className="text-gray-700 hover:text-tabua-green font-medium">
                Rastreie seu pedido
              </a>
            </nav>

            {/* Ações do usuário */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Search className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
                <span className="hidden md:ml-2 md:inline">Conta</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCartToggle}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-tabua-red text-white text-xs">
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