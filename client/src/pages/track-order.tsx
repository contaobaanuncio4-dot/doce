import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Truck, CheckCircle, Search } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/header";

export default function TrackOrder() {
  const [, setLocation] = useLocation();
  const [orderNumber, setOrderNumber] = useState("");
  const [tracking, setTracking] = useState<any>(null);

  const handleTrackOrder = () => {
    // Simulação de dados de rastreamento
    if (orderNumber.trim()) {
      setTracking({
        orderNumber: orderNumber,
        status: "Em trânsito",
        steps: [
          { status: "Pedido confirmado", date: "25/01/2025 14:30", completed: true },
          { status: "Preparando pedido", date: "25/01/2025 16:45", completed: true },
          { status: "Saiu para entrega", date: "26/01/2025 08:20", completed: true },
          { status: "Entregue", date: "Em breve", completed: false }
        ],
        estimatedDelivery: "26/01/2025"
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3EF' }}>
      <Header onCartToggle={() => {}} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-colors"
            style={{ color: '#0F2E51' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para a loja
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#0F2E51' }}>
            Rastreie seu Pedido
          </h1>
          <p className="text-gray-600">
            Digite o número do seu pedido para acompanhar o status da entrega
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Input
                placeholder="Digite o número do pedido (ex: #1234)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleTrackOrder}
                className="bg-[#0F2E51] hover:bg-[#0F2E51]/90 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Rastrear
              </Button>
            </div>
          </CardContent>
        </Card>

        {tracking && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2" style={{ color: '#0F2E51' }}>
                  Pedido #{tracking.orderNumber}
                </h2>
                <p className="text-gray-600">
                  Status: <span className="font-medium">{tracking.status}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Previsão de entrega: {tracking.estimatedDelivery}
                </p>
              </div>

              <div className="space-y-4">
                {tracking.steps.map((step: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : index === 2 ? (
                        <Truck className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        step.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.status}
                      </h3>
                      <p className="text-sm text-gray-500">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Precisa de ajuda? Entre em contato conosco
          </p>
          <Button 
            onClick={() => setLocation("/contact")}
            variant="outline"
            className="border-[#0F2E51] text-[#0F2E51] hover:bg-[#0F2E51] hover:text-white"
          >
            Falar com Suporte
          </Button>
        </div>
      </div>
    </div>
  );
}