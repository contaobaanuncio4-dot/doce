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
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery({
    queryKey: ["/api/cart", 'default-session'],
    enabled: true,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CheckoutForm) => {
      const response = await apiRequest("/api/orders", {
        method: "POST",
        body: {
          ...orderData,
          sessionId: 'default-session',
          paymentMethod: "pix",
        },
      });
      return response.json();
    },
    onSuccess: (data) => {
      setOrderId(data.order.id);
      setPixCode(data.pixCode);
      setStep(2);
      
      // Gerar QR Code
      QRCode.toDataURL(data.pixCode, { width: 200, margin: 2 }, (err, url) => {
        if (!err) {
          setQrCodeDataUrl(url);
        }
      });
      
      toast({
        title: "Pedido criado com sucesso!",
        description: "Agora você pode realizar o pagamento via PIX.",
      });
    },
    onError: (error: any) => {
      console.error("Error creating order:", error);
      toast({
        title: "Erro ao criar pedido",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const addOrderBumpMutation = useMutation({
    mutationFn: async (products: number[]) => {
      return await apiRequest("/api/order-bump", {
        method: "POST",
        body: {
          orderId,
          products,
          discountType: "order_bump"
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Produtos adicionados!",
        description: "Os produtos foram adicionados ao seu pedido com desconto.",
      });
      setShowOrderBump(false);
    },
  });

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F2E51] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const total = cartItems.reduce((sum: number, item: any) => {
    const price = parseFloat((item.price || "0").replace(",", "."));
    return sum + (price * item.quantity);
  }, 0);

  const shippingCost = 9.90;
  const finalTotal = total + shippingCost;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copiado!",
      description: "Código PIX copiado para a área de transferência.",
    });
  };

  const onSubmit = (data: CheckoutForm) => {
    createOrderMutation.mutate(data);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartToggle={onCartToggle} />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-[#0F2E51]">Finalizar Pedido</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulário */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
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
                              <Input {...field} placeholder="Seu nome completo" className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="customerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">E-mail *</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="seu@email.com" className="border-gray-300" />
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
                              <FormLabel className="text-sm font-medium text-gray-700">Telefone *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="(31) 99999-9999" className="border-gray-300" />
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
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Estado *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="MG" className="border-gray-300" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Cidade *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Belo Horizonte" className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Bairro *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Seu bairro" className="border-gray-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-sm font-medium text-gray-700">Endereço *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Rua, Avenida..." className="border-gray-300" />
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
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="w-full bg-[#DDAF36] hover:bg-[#c49a2b] text-[#0F2E51] font-bold py-4 rounded-xl text-lg"
                  >
                    {createOrderMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F2E51]"></div>
                        Criando pedido...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Finalizar Pedido - R$ {finalTotal.toFixed(2).replace(".", ",")}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Resumo do pedido */}
            <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#0F2E51' }}>
                <ShoppingBag className="w-5 h-5" />
                Resumo do Pedido
              </h2>

              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-900">
                        {item.product?.name} - {item.size}
                      </h4>
                      <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#0F2E51]">
                      R$ {((parseFloat((item.price || "0").replace(",", ".")) * item.quantity).toFixed(2)).replace(".", ",")}
                    </p>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">R$ {total.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete:</span>
                    <span className="font-medium">R$ {shippingCost.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#0F2E51] border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Página de pagamento PIX
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartToggle={onCartToggle} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F2E51] mb-2">Pedido Criado com Sucesso!</h1>
          <p className="text-gray-600">Pedido #{orderId}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#0F2E51] mb-2">Pagamento via PIX</h2>
            <p className="text-gray-600 text-sm">
              Escaneie o QR Code abaixo ou copie o código PIX para fazer o pagamento
            </p>
          </div>

          {qrCodeDataUrl && (
            <div className="text-center mb-6">
              <img src={qrCodeDataUrl} alt="QR Code PIX" className="mx-auto border rounded-lg" />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código PIX:
            </label>
            <div className="flex gap-2">
              <Input
                value={pixCode}
                readOnly
                className="flex-1 bg-gray-50 text-xs"
              />
              <Button
                onClick={() => copyToClipboard(pixCode)}
                variant="outline"
                className="shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Button
              onClick={() => setShowInstructions(!showInstructions)}
              variant="outline"
              className="w-full"
            >
              {showInstructions ? "Ocultar" : "Ver"} Instruções de Pagamento
            </Button>

            {showInstructions && (
              <div className="bg-blue-50 rounded-lg p-4 text-left text-sm text-blue-800">
                <h3 className="font-semibold mb-2">Como pagar:</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Abra o app do seu banco</li>
                  <li>Procure pela opção PIX</li>
                  <li>Escaneie o QR Code ou cole o código PIX</li>
                  <li>Confirme o pagamento</li>
                  <li>Envie o comprovante via WhatsApp: (31) 99999-9999</li>
                </ol>
              </div>
            )}

            <Button
              onClick={() => setLocation("/")}
              className="w-full bg-[#DDAF36] hover:bg-[#c49a2b] text-[#0F2E51] font-bold"
            >
              Voltar à Loja
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}