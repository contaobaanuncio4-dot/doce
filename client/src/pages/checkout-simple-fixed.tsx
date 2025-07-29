import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Package, ArrowLeft, User, MapPin, CreditCard, Copy, Check, ShoppingBag, X, Plus } from "lucide-react";
import QRCode from "qrcode";
import Header from "@/components/header";
import { useCart } from "@/hooks/use-cart";
import { trackInitiateCheckout, trackCompletePayment } from "@/lib/tiktok-tracking";

const checkoutSchema = z.object({
  customerName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  customerCpf: z.string().min(11, "CPF deve ter 11 dígitos").refine((cpf) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.length === 11;
  }, "CPF deve ter 11 dígitos"),
  zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
  address: z.string().min(5, "Endereço é obrigatório"),
  addressNumber: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface CheckoutSimpleProps {
  onCartToggle?: () => void;
}

// Função fetchCEP implementada diretamente no componente
const fetchCEP = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, '');
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (!response.ok) {
      throw new Error('CEP não encontrado');
    }
    
    const data = await response.json();
    
    if (data.erro) {
      throw new Error('CEP inválido');
    }
    
    return {
      address: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || ''
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error;
  }
};

export default function CheckoutSimple({ onCartToggle }: CheckoutSimpleProps) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [pixCode, setPixCode] = useState("00020126360014BR.GOV.BCB.PIX0114+5531999887766520400005303986540510.005802BR5925TABUA DE MINAS QUEIJOS6014BELO HORIZONTE62070503***6304ABCD");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [showOrderBump, setShowOrderBump] = useState(false);
  const [selectedBumpProducts, setSelectedBumpProducts] = useState<number[]>([]);
  const [shippingOption, setShippingOption] = useState<"express" | "free">("express");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sessionId } = useCart();
  
  // Force sessionId padrão se vazio
  const effectiveSessionId = sessionId || "wil3rxwaf0q";
  
  // Detectar plano de assinatura na URL
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPlan = urlParams.get('plan');
  const planPrice = parseFloat(urlParams.get('price') || '0');

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
    queryKey: ["/api/cart", effectiveSessionId],
    queryFn: () => apiRequest("GET", `/api/cart?sessionId=${effectiveSessionId}`),
    enabled: !!effectiveSessionId,
  });

  // Query para carregar todos os produtos para order bump
  const { data: allProducts = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  // Se existe um plano selecionado, criar item virtual para o carrinho
  const subscriptionItem = selectedPlan ? [{
    id: `subscription-${selectedPlan}`,
    name: selectedPlan === 'semestral' ? 'Clube Tábua - Plano Semestral' : 'Clube Tábua - Plano Anual',
    description: selectedPlan === 'semestral' ? '3 queijos selecionados por 6 meses' : '3 queijos por 12 meses, com desconto especial',
    price: planPrice.toFixed(2).replace('.', ','),
    quantity: 1,
    isSubscription: true
  }] : [];

  // Combinar itens do carrinho com plano de assinatura
  const allItems = selectedPlan ? subscriptionItem : cartItems;

  const total = allItems.reduce((sum: number, item: any) => {
    // Limpar o preço removendo "R$ " se existir e convertendo vírgula para ponto
    const cleanPrice = item.price?.toString().replace("R$ ", "").replace(",", ".") || "0";
    const price = parseFloat(cleanPrice);
    return sum + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  const shippingCost = selectedPlan ? 0 : (shippingOption === "express" ? 9.90 : 0); // Sem frete para planos de assinatura
  const finalTotal = total + shippingCost;

  // Order Bump: Mostrar todos os produtos mais caros da loja com 50% OFF (exceto Queijo Chabichou)
  const suggestedProducts = allProducts
    .filter(product => product.name !== "Queijo Chabichou") // Excluir Queijo Chabichou
    .sort((a, b) => {
      const priceA = parseFloat(a.price500g.replace('R$ ', '').replace(',', '.'));
      const priceB = parseFloat(b.price500g.replace('R$ ', '').replace(',', '.'));
      return priceB - priceA;
    })
    .slice(0, 6); // Mostrar os 6 produtos mais caros

  // Mutation para adicionar produtos do order bump ao carrinho
  const addBumpProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const product = allProducts.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');
      
      const originalPrice = parseFloat(product.price500g.replace('R$ ', '').replace(',', '.'));
      const discountedPrice = originalPrice * 0.5; // 50% de desconto
      
      return await apiRequest('POST', "/api/cart", {
        sessionId: effectiveSessionId,
        productId: product.id,
        quantity: 1,
        size: "500g",
        price: discountedPrice.toFixed(2).replace('.', ',')
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", effectiveSessionId] });
      // Notificação removida conforme solicitado
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto.",
        variant: "destructive",
      });
    },
  });

  const handleBumpProductToggle = (productId: number) => {
    if (selectedBumpProducts.includes(productId)) {
      setSelectedBumpProducts(prev => prev.filter(id => id !== productId));
    } else {
      setSelectedBumpProducts(prev => [...prev, productId]);
      addBumpProductMutation.mutate(productId);
    }
  };

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CheckoutForm) => {
      // Usar o sessionId correto do carrinho
      const orderWithSession = {
        ...orderData,
        sessionId: sessionId || 'default-session',
        // Limpar CPF para enviar apenas números para a API
        customerCpf: orderData.customerCpf.replace(/\D/g, ''),
        // Limpar CEP para enviar apenas números para a API
        zipCode: orderData.zipCode.replace(/\D/g, ''),
        total: finalTotal.toFixed(2)
      };
      
      const response = await apiRequest('POST', '/api/orders', orderWithSession);
      return response;
    },
    onSuccess: async (data) => {
      setOrderId(data.order.id);
      setPixCode(data.pixCode);
      
      // Gerar QR Code
      try {
        const qrDataUrl = await QRCode.toDataURL(data.pixCode, {
          width: 256,
          margin: 2,
          color: {
            dark: '#0F2E51',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
      }
      
      setStep(2);
      
      // Rastrear conclusão de pagamento no TikTok (PIX gerado)
      const contentIds = cartItems.map(item => item.productId.toString());
      trackCompletePayment({
        content_ids: contentIds,
        value: finalTotal,
        currency: 'BRL',
        num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        order_id: data.order.id.toString(),
      });
      
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
    // Rastrear início do checkout no TikTok
    const contentIds = cartItems.map(item => item.productId.toString());
    trackInitiateCheckout({
      content_ids: contentIds,
      value: finalTotal,
      currency: 'BRL',
      num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    });
    
    createOrderMutation.mutate(data);
  };

  const copyPIXCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setShowInstructions(true);
      toast({
        title: "Código PIX copiado!",
        description: "Agora siga as instruções para pagar.",
        variant: "default"
      });
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar PIX:", error);
      toast({
        title: "Erro ao copiar",
        description: "Tente selecionar e copiar manualmente.",
        variant: "destructive"
      });
    }
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

  if (allItems.length === 0) {
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
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3EF' }}>
      <Header onCartToggle={onCartToggle || (() => {})} />
      <div className="container mx-auto px-4 max-w-4xl py-8">
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
                      {/* Opções de Frete */}
                      <div className="mt-6 pt-4 border-t">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#0F2E51' }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Opções de Entrega
                        </h4>
                        
                        <div className="space-y-3">
                          <label className="flex items-center space-x-4 cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors border-gray-200 hover:border-yellow-300">
                            <input
                              type="radio"
                              name="shipping"
                              value="express"
                              checked={shippingOption === "express"}
                              onChange={() => setShippingOption("express")}
                              className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-semibold text-gray-900">Frete Express</span>
                                  <p className="text-sm text-gray-600 mt-1">Entrega em 2 a 3 dias úteis</p>
                                </div>
                                <span className="font-bold text-lg" style={{ color: '#DDAF36' }}>R$ 9,90</span>
                              </div>
                            </div>
                          </label>
                          
                          <label className="flex items-center space-x-4 cursor-pointer p-4 border-2 rounded-lg hover:bg-gray-50 transition-colors border-gray-200 hover:border-green-300">
                            <input
                              type="radio"
                              name="shipping"
                              value="free"
                              checked={shippingOption === "free"}
                              onChange={() => setShippingOption("free")}
                              className="w-4 h-4 text-green-600 focus:ring-green-500"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-semibold text-gray-900">Frete Grátis</span>
                                  <p className="text-sm text-gray-600 mt-1">Entrega em 5 a 8 dias úteis</p>
                                </div>
                                <span className="font-bold text-lg text-green-600">Grátis</span>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                      {/* Order Bump - Produtos Recomendados (Compacto) */}
                      {!selectedPlan && suggestedProducts.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: '#0F2E51' }}>
                              <ShoppingBag className="w-4 h-4" />
                              🎯 Produtos Premium com 50% OFF
                            </h3>
                            <p className="text-xs text-gray-600 mb-3">Leva mais um produto nosso com desconto</p>

                            {/* Lista compacta de produtos */}
                            <div className="space-y-2">
                              {suggestedProducts.map((product) => {
                                const originalPrice = parseFloat(product.price500g.replace('R$ ', '').replace(',', '.'));
                                const discountedPrice = originalPrice * 0.5;
                                const isSelected = selectedBumpProducts.includes(product.id);
                                
                                return (
                                  <div 
                                    key={product.id}
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                                      isSelected ? 'bg-yellow-100 border border-yellow-300' : 'bg-white hover:bg-gray-50 border border-gray-200'
                                    }`}
                                    onClick={() => handleBumpProductToggle(product.id)}
                                  >
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm">{product.name}</h4>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 line-through">
                                          R$ {originalPrice.toFixed(2).replace('.', ',')}
                                        </span>
                                        <span className="font-bold text-sm" style={{ color: '#0F2E51' }}>
                                          R$ {discountedPrice.toFixed(2).replace('.', ',')}
                                        </span>
                                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                                          50% OFF
                                        </span>
                                      </div>
                                    </div>
                                    {isSelected ? (
                                      <span className="text-green-600 font-medium text-xs">✓ Adicionado</span>
                                    ) : (
                                      <Plus className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
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
                  {allItems.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      {item.isSubscription ? (
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DDAF36' }}>
                          <span className="text-white text-2xl">🧀</span>
                        </div>
                      ) : (
                        <img 
                          src={item.product?.imageUrl} 
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.isSubscription ? item.name : item.product?.name}
                        </h3>
                        {item.isSubscription ? (
                          <p className="text-xs text-gray-600">{item.description}</p>
                        ) : (
                          <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                        )}
                        <p className="text-sm font-bold" style={{ color: '#0F2E51' }}>
                          R$ {(() => {
                            const cleanPrice = item.price?.toString().replace("R$ ", "").replace(",", ".") || "0";
                            const price = parseFloat(cleanPrice);
                            return (isNaN(price) ? 0 : price * item.quantity).toFixed(2).replace(".", ",");
                          })()}
                          {item.isSubscription && <span className="text-xs">/mês</span>}
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
                      <span style={{ color: '#0F2E51' }}>
                        {selectedPlan ? 'Grátis' : (shippingOption === "express" ? 'R$ 9,90' : 'Grátis')}
                      </span>
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
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#0F2E51' }}>
                  Pedido #{orderId} criado com sucesso!
                </h3>
                
                {/* Valor em destaque no topo */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl mb-6 border-l-4" style={{ borderLeftColor: '#0F2E51' }}>
                  <p className="text-sm text-gray-600 mb-1">Valor total a pagar:</p>
                  <div className="text-3xl md:text-4xl font-bold" style={{ color: '#0F2E51' }}>
                    R$ {finalTotal.toFixed(2).replace(".", ",")}
                  </div>
                </div>
                
                {/* QR Code Area */}
                <div className="bg-gray-50 p-4 md:p-6 rounded-xl mb-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm mb-4 flex justify-center">
                    {qrCodeDataUrl ? (
                      <div className="text-center">
                        <img 
                          src={qrCodeDataUrl} 
                          alt="QR Code PIX" 
                          className="w-48 h-48 md:w-64 md:h-64 rounded-lg border"
                        />
                        <p className="text-sm font-medium text-gray-700 mt-3">QR Code PIX</p>
                        <p className="text-xs text-gray-500 mt-1">Escaneie com o app do seu banco</p>
                      </div>
                    ) : (
                      <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-.01M12 12v.01M12 12V8m0 0h4" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-gray-700">Gerando QR Code...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Código PIX para copiar */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-700 mb-3">Código PIX para copiar:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div 
                        onClick={copyPIXCode}
                        className="flex-1 bg-gray-50 p-3 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <code className="text-xs break-all text-gray-800 font-mono leading-relaxed">
                          {pixCode}
                        </code>
                      </div>
                      <Button 
                        onClick={copyPIXCode}
                        className="text-white font-semibold px-6 py-3 hover:opacity-90 whitespace-nowrap"
                        style={{ backgroundColor: '#0F2E51' }}
                      >
                        {copied ? (
                          <><Check className="w-4 h-4 mr-1" /> Copiado!</>
                        ) : (
                          <><Copy className="w-4 h-4 mr-1" /> Copiar PIX</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Instruções */}
                <div className="text-left bg-blue-50 p-4 md:p-6 rounded-xl mb-6 border" style={{ borderColor: '#DDAF36' }}>
                  <h4 className="font-semibold mb-3 text-center" style={{ color: '#0F2E51' }}>
                    Como pagar com PIX:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#0F2E51' }}>1</div>
                      <p className="text-sm text-gray-700">Abra o app do seu banco</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#0F2E51' }}>2</div>
                      <p className="text-sm text-gray-700">Escolha "PIX" → "Pagar com QR Code" ou "Copia e Cola"</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#0F2E51' }}>3</div>
                      <p className="text-sm text-gray-700">Cole o código PIX ou escaneie o QR Code gerado pelo app</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#0F2E51' }}>4</div>
                      <p className="text-sm text-gray-700">Confirme o pagamento de <strong>R$ {finalTotal.toFixed(2).replace(".", ",")}</strong></p>
                    </div>
                  </div>
                </div>
                
                {/* Informações finais */}
                <div className="text-center space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      <strong>Confirmação instantânea!</strong><br/>
                      Você receberá a confirmação por email e WhatsApp assim que o pagamento for processado.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => setLocation("/")}
                    variant="outline"
                    className="border-2 font-semibold px-8 py-3 hover:opacity-90"
                    style={{ borderColor: '#0F2E51', color: '#0F2E51' }}
                  >
                    Voltar ao Início
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modal de Instruções PIX */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center" style={{ color: '#0F2E51' }}>
              Como pagar com PIX
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
              <Check className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-semibold text-green-700">
                Código PIX copiado com sucesso!
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#0F2E51' }}>1</div>
                <div>
                  <p className="font-semibold text-gray-900">Abra seu app bancário</p>
                  <p className="text-sm text-gray-600">Qualquer banco que aceite PIX</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#0F2E51' }}>2</div>
                <div>
                  <p className="font-semibold text-gray-900">Escolha "PIX" → "Copia e Cola"</p>
                  <p className="text-sm text-gray-600">Ou "Pagar com código PIX"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#0F2E51' }}>3</div>
                <div>
                  <p className="font-semibold text-gray-900">Cole o código copiado</p>
                  <p className="text-sm text-gray-600">O código já está na sua área de transferência</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#0F2E51' }}>4</div>
                <div>
                  <p className="font-semibold text-gray-900">Confirme o pagamento</p>
                  <p className="text-sm text-gray-600">
                    Valor: <strong style={{ color: '#0F2E51' }}>R$ {finalTotal.toFixed(2).replace(".", ",")}</strong>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-center text-blue-700">
                <strong>Pagamento confirmado automaticamente!</strong><br/>
                Você receberá confirmação por email e WhatsApp.
              </p>
            </div>
            
            <Button 
              onClick={() => setShowInstructions(false)}
              className="w-full text-white font-semibold py-3"
              style={{ backgroundColor: '#0F2E51' }}
            >
              Entendi, vou pagar agora
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}