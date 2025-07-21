import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TrackOrderProps {
  onCartToggle?: () => void;
}

export default function TrackOrder({ onCartToggle = () => {} }: TrackOrderProps) {
  const [email, setEmail] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [orderStatus, setOrderStatus] = useState<number>(0);
  const { toast } = useToast();

  // E-mails de clientes que fizeram pedidos (simulação de base de dados)
  const validEmails = [
    "cliente@email.com",
    "joao@email.com", 
    "maria@email.com",
    "pedro@gmail.com",
    "ana@hotmail.com"
  ];

  const handleCheckStatus = () => {
    if (!email) {
      toast({
        title: "E-mail obrigatório",
        description: "Por favor, digite seu e-mail para verificar o status do pedido.",
        variant: "destructive",
      });
      return;
    }

    if (validEmails.includes(email.toLowerCase())) {
      // Simular diferentes status de entrega baseado no e-mail
      const status = email.includes("cliente") ? 3 : 
                   email.includes("joao") ? 2 : 
                   email.includes("maria") ? 1 : 0;
      
      setOrderStatus(status);
      setShowProgress(true);
      
      toast({
        title: "Pedido encontrado!",
        description: "Status do seu pedido atualizado.",
        variant: "default",
      });
    } else {
      toast({
        title: "Pedido não encontrado",
        description: "Não encontramos nenhum pedido com este e-mail. Verifique se o e-mail está correto.",
        variant: "destructive",
      });
      setShowProgress(false);
    }
  };

  const getProgressWidth = () => {
    switch (orderStatus) {
      case 0: return "8%";   // Postado
      case 1: return "35%";  // Em Trânsito  
      case 2: return "70%";  // Saiu para Entrega
      case 3: return "100%"; // Entregue
      default: return "8%";
    }
  };

  const getStatusText = () => {
    switch (orderStatus) {
      case 0: return "Seu pedido foi postado e está a caminho!";
      case 1: return "Seu pedido está em trânsito para o destino.";
      case 2: return "Seu pedido saiu para entrega e chegará em breve!";
      case 3: return "Seu pedido foi entregue com sucesso!";
      default: return "Seu pedido foi postado e está a caminho!";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCartToggle={onCartToggle} />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Rastreie seu Pedido
          </h1>
          <p className="text-lg text-gray-600">
            Digite seu e-mail para verificar o status da entrega
          </p>
        </div>

        <div className="status-container bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Status de Entrega
          </h2>
          
          <div className="space-y-4 mb-6">
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-lg p-4"
            />
            
            <Button
              onClick={handleCheckStatus}
              className="w-full text-white font-semibold py-4 text-lg"
              style={{ backgroundColor: '#0F2E51' }}
            >
              Verificar Status
            </Button>
          </div>

          {showProgress && (
            <>
              <p 
                className="text-center text-gray-700 mb-6 font-medium"
                style={{ display: 'block', marginTop: '10px' }}
              >
                Postado de Natal, Rio Grande do Norte
              </p>
              
              <div className="text-center text-sm text-gray-600 mb-4">
                {getStatusText()}
              </div>

              <div 
                className="progress-wrapper" 
                style={{ display: 'block' }}
              >
                <div className="progress-line relative bg-gray-200 h-2 rounded-full mb-4">
                  <div 
                    className="absolute top-0 left-0 h-full bg-green-600 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: getProgressWidth()
                    }}
                  ></div>
                </div>
                
                <div className="status-labels grid grid-cols-4 text-xs text-center text-gray-600">
                  <div className={orderStatus >= 0 ? "text-green-600 font-semibold" : ""}>
                    Postado
                  </div>
                  <div className={orderStatus >= 1 ? "text-green-600 font-semibold" : ""}>
                    Em Trânsito
                  </div>
                  <div className={orderStatus >= 2 ? "text-green-600 font-semibold" : ""}>
                    Saiu para Entrega
                  </div>
                  <div className={orderStatus >= 3 ? "text-green-600 font-semibold" : ""}>
                    Entregue
                  </div>
                </div>
              </div>
            </>
          )}

          {!showProgress && (
            <div className="text-center text-gray-500 py-8">
              Digite seu e-mail e clique em "Verificar Status" para acompanhar seu pedido
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Problemas para rastrear seu pedido? 
            <a href="/contact" className="text-blue-600 hover:underline ml-1">
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}