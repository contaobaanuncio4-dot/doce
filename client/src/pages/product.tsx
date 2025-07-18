import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, Minus, Plus, ShoppingCart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function ProductPage() {
  const [, params] = useRoute("/produto/:id");
  const [selectedWeight, setSelectedWeight] = useState<"500g" | "1kg">("500g");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: [`/api/products/${params?.id}`],
    enabled: !!params?.id,
  });

  const { data: similarProducts = [] } = useQuery({
    queryKey: ['/api/products', { category: product?.category }],
    enabled: !!product?.category,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: [`/api/products/${params?.id}/reviews`],
    enabled: !!params?.id,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => apiRequest('/api/cart', 'POST', {
      productId: parseInt(params?.id || '0'),
      quantity,
      weight: selectedWeight,
    }),
    onSuccess: () => {
      toast({
        title: "Produto adicionado!",
        description: `${product?.name} (${selectedWeight}) foi adicionado ao carrinho.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <p className="text-gray-600">O produto que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  const currentPrice = selectedWeight === "500g" ? product.price500g : product.price1kg;
  const originalPrice = selectedWeight === "500g" ? product.originalPrice500g : product.originalPrice1kg;
  const hasDiscount = originalPrice && parseFloat(originalPrice) > parseFloat(currentPrice);
  
  const filteredSimilarProducts = similarProducts
    .filter((p: Product) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <span className="text-gray-500">Home</span>
        <span className="mx-2">/</span>
        <span className="text-gray-500">Produtos</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Imagem do Produto */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Informações do Produto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#0F2E51' }}>
              {product.name}
            </h1>
            
            {/* Avaliação */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {renderStars(Math.round(parseFloat(product.rating || "0")))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews} avaliações)
              </span>
            </div>

            {/* Preços */}
            <div className="space-y-2">
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <Badge className="text-white" style={{ backgroundColor: '#0F2E51' }}>
                    {product.discount}% OFF
                  </Badge>
                  <span className="text-lg text-gray-500 line-through">
                    R$ {originalPrice}
                  </span>
                </div>
              )}
              <div className="text-3xl font-bold" style={{ color: '#DDAF36' }}>
                R$ {currentPrice}
              </div>
              <p className="text-sm text-gray-600">
                ou 12x de R$ {(parseFloat(currentPrice) / 12).toFixed(2).replace('.', ',')} sem juros
              </p>
            </div>
          </div>

          {/* Seleção de Peso */}
          <div className="space-y-3">
            <Label className="text-base font-medium" style={{ color: '#0F2E51' }}>
              Escolha o tamanho:
            </Label>
            <RadioGroup value={selectedWeight} onValueChange={setSelectedWeight as any}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="500g" id="500g" />
                <Label htmlFor="500g" className="cursor-pointer">
                  500g - R$ {product.price500g}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1kg" id="1kg" />
                <Label htmlFor="1kg" className="cursor-pointer">
                  1kg - R$ {product.price1kg}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Quantidade */}
          <div className="space-y-3">
            <Label className="text-base font-medium" style={{ color: '#0F2E51' }}>
              Quantidade:
            </Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Botão Adicionar ao Carrinho */}
          <Button
            className="w-full text-white font-semibold py-3 text-lg hover:opacity-90"
            style={{ backgroundColor: '#0F2E51' }}
            onClick={() => addToCartMutation.mutate()}
            disabled={addToCartMutation.isPending}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {addToCartMutation.isPending ? "Adicionando..." : "Adicionar ao Carrinho"}
          </Button>

          {/* Entrega */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2" style={{ color: '#0F2E51' }}>
              🚚 Entrega
            </h3>
            <p className="text-sm text-gray-600">
              Frete grátis para compras acima de R$ 150,00
            </p>
            <p className="text-sm text-gray-600">
              Prazo de entrega: 3-7 dias úteis
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Descrição */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#0F2E51' }}>
          Descrição do Produto
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {product.description}
        </p>
      </div>

      <Separator className="my-8" />

      {/* Avaliações */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#0F2E51' }}>
          Avaliações dos Clientes
        </h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                  <span className="font-medium">{review.customerName}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Ainda não há avaliações para este produto.</p>
            <p className="text-sm text-gray-500 mt-2">
              Seja o primeiro a avaliar!
            </p>
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {/* Produtos Similares */}
      {filteredSimilarProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#0F2E51' }}>
            Produtos Similares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredSimilarProducts.map((similarProduct: Product) => (
              <div key={similarProduct.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={similarProduct.imageUrl}
                  alt={similarProduct.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">
                    {similarProduct.name}
                  </h3>
                  <p className="font-bold" style={{ color: '#DDAF36' }}>
                    R$ {similarProduct.price500g}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}