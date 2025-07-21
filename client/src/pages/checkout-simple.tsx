import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
  address: z.string().min(5, "Endereço é obrigatório"),
  addressNumber: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutSimple() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [pixCode, setPixCode] = useState("00020126360014BR.GOV.BCB.PIX0114+5531999887766520400005303986540510.005802BR5925TABUA DE MINAS QUEIJOS6014BELO HORIZONTE62070503***6304ABCD");
  const [orderId, setOrderId] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      zipCode: "",
      address: "",
      addressNumber: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery({
    queryKey: ["/api/cart"],
  });

  const total = cartItems.reduce((sum: number, item: any) => {
    return sum + (parseFloat(item.price?.replace(",", ".") || "0") * item.quantity);
  }, 0);

  const shippingCost = 9.90;
  const finalTotal = total + shippingCost;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CheckoutForm) => {
      // Simular criação de pedido por enquanto
      return {
        order: { id: Math.floor(Math.random() * 1000) + 1 },
        pixCode: "00020126360014BR.GOV.BCB.PIX0114+5531999887766520400005303986540510.005802BR5925TABUA DE MINAS QUEIJOS6014BELO HORIZONTE62070503***6304ABCD"
      };
    },
    onSuccess: (data) => {
      setOrderId(data.order.id);
      setPixCode(data.pixCode);
      setStep(2);
      toast({
        title: "Pedido criado com sucesso!",
        description: "Agora você pode realizar o pagamento via PIX.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar pedido",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    createOrderMutation.mutate(data);
  };

  const copyPIXCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: "PIX copiado!",
      description: "Código PIX copiado para a área de transferência.",
    });
  };

  if (isLoadingCart) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0F2E51' }}>
                  Seu carrinho está vazio
                </h2>
                <p className="text-gray-600 mb-6">
                  Adicione alguns produtos deliciosos ao seu carrinho para continuar.
                </p>
                <Button 
                  onClick={() => setLocation("/")}
                  className="text-white font-bold px-6 py-2 hover:opacity-90"
                  style={{ backgroundColor: '#0F2E51' }}
                >
                  Voltar às Compras
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4" style={{ color: '#0F2E51' }}>
              Finalizar Compra
            </h1>
            <div className="flex justify-center items-center space-x-8">
              <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? 'text-white' : 'bg-gray-400 text-white'}`} style={{ backgroundColor: step >= 1 ? '#0F2E51' : '#9CA3AF' }}>
                  1
                </div>
                <span className="font-semibold">Dados</span>
              </div>
              <div className={`w-16 h-0.5 ${step >= 2 ? '#0F2E51' : 'bg-gray-400'}`} style={{ backgroundColor: step >= 2 ? '#0F2E51' : '#9CA3AF' }}></div>
              <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white`} style={{ backgroundColor: step >= 2 ? '#0F2E51' : '#9CA3AF' }}>
                  2
                </div>
                <span className="font-semibold">Pagamento PIX</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Resumo do Pedido */}
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: '#0F2E51' }}>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img 
                          src={item.product?.imageUrl} 
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold" style={{ color: '#0F2E51' }}>{item.product?.name}</h4>
                          <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                          <p className="font-semibold" style={{ color: '#DDAF36' }}>
                            R$ {(parseFloat(item.price?.replace(",", ".") || "0") * item.quantity).toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Subtotal:</span>
                      <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Frete:</span>
                      <span style={{ color: '#0F2E51' }}>R$ 9,90</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold" style={{ color: '#0F2E51' }}>
                      <span>Total:</span>
                      <span>R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dados do Cliente */}
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: '#0F2E51' }}>Seus Dados</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Seu nome completo" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(31) 99999-9999" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="seu@email.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="00000-000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Endereço</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Rua, Avenida..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="addressNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="123" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Bairro" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cidade</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Cidade" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="MG" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full text-white font-bold py-3 hover:opacity-90"
                        style={{ backgroundColor: '#DDAF36' }}
                        disabled={createOrderMutation.isPending}
                      >
                        {createOrderMutation.isPending ? "Criando Pedido..." : "Finalizar Pedido - Pagar com PIX"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center" style={{ color: '#0F2E51' }}>
                    Pagamento via PIX
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#0F2E51' }}>
                    Pedido #{orderId} criado com sucesso!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Escaneie o código QR ou copie o código PIX abaixo para realizar o pagamento.
                  </p>
                  
                  <div className="bg-gray-100 p-6 rounded-lg mb-6">
                    <div className="bg-white p-4 rounded-lg inline-block mb-4">
                      <div className="text-8xl">📱</div>
                      <p className="text-sm text-gray-600 mt-2">QR Code PIX</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Código PIX:</p>
                      <div className="flex items-center justify-center space-x-2">
                        <code className="bg-gray-100 px-3 py-2 rounded text-sm break-all max-w-xs">
                          {pixCode}
                        </code>
                        <Button 
                          onClick={copyPIXCode}
                          variant="outline"
                          size="sm"
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>

                    <div className="text-2xl font-bold mt-4" style={{ color: '#0F2E51' }}>
                      Valor: R$ {finalTotal.toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                  
                  <div className="text-left bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold mb-2" style={{ color: '#0F2E51' }}>
                      Instruções para pagamento:
                    </h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>1. Abra o aplicativo do seu banco</li>
                      <li>2. Procure pela opção PIX</li>
                      <li>3. Escaneie o QR Code ou cole o código PIX</li>
                      <li>4. Confirme o pagamento de R$ {finalTotal.toFixed(2).replace(".", ",")}</li>
                    </ol>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Após o pagamento, você receberá a confirmação por email e WhatsApp.
                    </p>
                    <Button 
                      onClick={() => setLocation("/")}
                      className="text-white font-bold px-6 py-2 hover:opacity-90"
                      style={{ backgroundColor: '#0F2E51' }}
                    >
                      Voltar ao Início
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}