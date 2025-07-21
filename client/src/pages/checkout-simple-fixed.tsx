import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Package, ArrowLeft, User, MapPin, CreditCard } from "lucide-react";
import { fetchCEP } from "@/lib/cep-api";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  customerCpf: z.string().min(11, "CPF deve ter 11 dígitos").regex(/^\d{11}$/, "CPF deve conter apenas números"),
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
      customerCpf: "",
      zipCode: "",
      address: "",
      addressNumber: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery<any[]>({
    queryKey: ["/api/cart"],
  });

  const total = cartItems.reduce((sum: number, item: any) => {
    return sum + (parseFloat(item.price?.replace(",", ".") || "0") * item.quantity);
  }, 0);

  const shippingCost = 9.90;
  const finalTotal = total + shippingCost;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CheckoutForm) => {
      // Adicionar sessionId padrão
      const orderWithSession = {
        ...orderData,
        sessionId: 'default-session',
        // Limpar CPF para enviar apenas números para a API
        customerCpf: orderData.customerCpf.replace(/\D/g, ''),
        // Limpar CEP para enviar apenas números para a API
        zipCode: orderData.zipCode.replace(/\D/g, ''),
        total: finalTotal.toFixed(2)
      };
      
      const response = await apiRequest('/api/orders', {
        method: 'POST',
        body: orderWithSession
      });
      return response;
    },
    onSuccess: (data) => {
      setOrderId(data.order.id);
      setPixCode(data.pixCode);
      setStep(2);
      toast({
        title: "Pedido criado com sucesso!",
        description: `Pedido #${data.order.id} criado. PIX disponível para pagamento.`,
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

  // Função para buscar CEP automaticamente
  const handleCepChange = async (cep: string) => {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      try {
        const cepData = await fetchCEP(cleanCep);
        
        // Preenche os campos automaticamente
        form.setValue('address', cepData.address);
        form.setValue('neighborhood', cepData.neighborhood);
        form.setValue('city', cepData.city);
        form.setValue('state', cepData.state);
        
        toast({
          title: "CEP encontrado!",
          description: "Endereço preenchido automaticamente.",
        });
      } catch (error) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique se o CEP está correto ou preencha manualmente.",
          variant: "destructive",
        });
      }
    }
  };

  // Função para formatar CPF
  const formatCPF = (cpf: string) => {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  // Função para formatar CEP
  const formatCEP = (cep: string) => {
    return cep
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  if (isLoadingCart) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#F7F3EF' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#F7F3EF' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
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
            </div>
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
            <ArrowLeft className="w-5 h-5" />
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
                        <User className="w-5 h-5" />
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
                                  className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#0F2E51] focus:border-transparent"
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

                        <FormField
                          control={form.control}
                          name="customerCpf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">CPF *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="000.000.000-00" 
                                  className="border-gray-300"
                                  onChange={(e) => {
                                    const formatted = formatCPF(e.target.value);
                                    field.onChange(formatted);
                                  }}
                                  maxLength={14}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#0F2E51' }}>
                        <MapPin className="w-5 h-5" />
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
                                  <Input 
                                    {...field} 
                                    placeholder="00000-000" 
                                    className="border-gray-300"
                                    onChange={(e) => {
                                      const formatted = formatCEP(e.target.value);
                                      field.onChange(formatted);
                                      handleCepChange(e.target.value);
                                    }}
                                    maxLength={9}
                                  />
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
                    <CreditCard className="w-5 h-5" />
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
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}