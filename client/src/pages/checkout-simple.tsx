import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Package } from "lucide-react";

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
    <div className="min-h-screen py-8" style={{ backgroundColor: '#F7F3EF' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-colors"
            style={{ color: '#0F2E51' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Voltar para o produto
          </button>
        </div>

          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulário */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h1 className="text-2xl font-serif font-bold mb-6" style={{ color: '#0F2E51' }}>
                    Finalizar Pedido
                  </h1>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#0F2E51' }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Dados Pessoais
                        </h2>
                        
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="customerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Nome Completo *</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Digite seu nome completo"
                                    className="w-full px-3 py-2 border rounded-lg border-gray-300"
                                    style={{ 
                                      '--tw-ring-color': '#0F2E51',
                                      focusRingColor: '#0F2E51'
                                    } as any}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="customerPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Telefone *</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="(11) 99999-9999" className="border-gray-300" />
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
                                  <FormLabel className="text-sm font-medium text-gray-700">Email *</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" placeholder="seu@email.com" className="border-gray-300" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#0F2E51' }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Endereço de Entrega
                        </h2>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">CEP *</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="00000-000" className="border-gray-300" />
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
                                  <FormLabel className="text-sm font-medium text-gray-700">Número *</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="123" className="border-gray-300" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Logradouro</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Rua, Avenida, etc." className="border-gray-300" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="neighborhood"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Bairro</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Bairro" className="border-gray-300" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">Cidade</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Cidade" className="border-gray-300" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Estado</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="MG" className="border-gray-300" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>

              {/* Resumo do Pedido */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#0F2E51' }}>
                    <Package className="w-5 h-5" />
                    Resumo do Pedido
                  </h2>
                  
                  <div className="space-y-4">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex gap-3">
                        <img 
                          src={item.product?.imageUrl} 
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                          <p className="text-sm font-bold" style={{ color: '#0F2E51' }}>
                            R$ {(parseFloat(item.price?.replace(",", ".") || "0") * item.quantity).toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frete:</span>
                        <span style={{ color: '#0F2E51' }}>R$ 9,90</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span style={{ color: '#0F2E51' }}>
                          R$ {finalTotal.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={createOrderMutation.isPending}
                      className="w-full hover:opacity-90 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#0F2E51' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                        <line x1="2" x2="22" y1="10" y2="10"></line>
                      </svg>
                      {createOrderMutation.isPending ? "Gerando PIX..." : "Gerar PIX"}
                    </button>
                    
                    <div className="text-center text-xs text-gray-500">
                      <p>Pagamento 100% seguro</p>
                      <p>Seus dados estão protegidos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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