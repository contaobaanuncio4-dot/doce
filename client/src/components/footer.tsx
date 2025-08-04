import { Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="wood-texture bg-warm-brown text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4 font-serif">Tábua de Minas</h4>
            <p className="text-gray-300 mb-4">
              Sabores tradicionais de Minas Gerais direto do produtor para sua mesa.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-2xl hover:text-yellow-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="text-2xl hover:text-yellow-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://wa.me/5577999241056" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-yellow-400 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Produtos</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Queijos Artesanais
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Doces Caseiros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Combos Especiais
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Presentes
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Ajuda</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Como Comprar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Formas de Pagamento
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Entrega
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Trocas e Devoluções
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="mr-2">📞</span>
                (31) 9 9999-9999
              </p>
              <p>
                <span className="mr-2">✉️</span>
                contato@tabuademinas.com
              </p>
              <p>
                <span className="mr-2">📍</span>
                Minas Gerais, Brasil
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Tábua de Minas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
