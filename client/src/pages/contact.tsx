import Header from "@/components/header";
import { Phone, Mail, Clock } from "lucide-react";

interface ContactProps {
  onCartToggle?: () => void;
}

export default function Contact({ onCartToggle = () => {} }: ContactProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header onCartToggle={onCartToggle} />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h1>
          <p className="text-lg text-gray-600">
            Estamos aqui para ajudar você! Entre em contato conosco através dos canais abaixo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Informações de Contato */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informações de Atendimento
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Horário de Atendimento</h3>
                  <p className="text-gray-600">
                    Segunda a Sábado: 8:30 às 18:30 horas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telefone</h3>
                  <a 
                    href="tel:+5511986451646" 
                    className="text-blue-600 hover:underline text-lg"
                  >
                    (11) 98645-1646
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                  <a 
                    href="mailto:sac@tabuademinas.com" 
                    className="text-blue-600 hover:underline text-lg"
                  >
                    sac@tabuademinas.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Widget do Instagram */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Siga-nos no Instagram
            </h2>
            <div className="container">
              <div className="html">
                <script src="https://cdn.lightwidget.com/widgets/lightwidget.js"></script>
                <iframe 
                  src="https://cdn.lightwidget.com/widgets/20b00a80a60b5d258c6da2e89f2aa859.html" 
                  scrolling="no" 
                  allowTransparency={true}
                  className="lightwidget-widget" 
                  style={{ width: '100%', border: '0px', overflow: 'hidden', height: '590px' }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className="mt-12 bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Nossa Localização
          </h2>
          <div className="text-center text-gray-600">
            <p className="text-lg mb-2">Tábua de Minas - Doces e Queijos</p>
            <p>Direto das montanhas de Minas Gerais para sua mesa</p>
          </div>
        </div>
      </div>
    </div>
  );
}