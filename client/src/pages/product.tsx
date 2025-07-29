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
import ProductGallery from "@/components/product-gallery";
import ProductReviews from "@/components/product-reviews";

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

  const addToCartMutation = useMutation({
    mutationFn: () => apiRequest('/api/cart', 'POST', {
      productId: parseInt(params?.id || '0'),
      quantity,
      weight: selectedWeight,
    }),
    onSuccess: () => {
      // Notificação removida conforme solicitado
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
  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div>
            <ProductGallery images={images} productName={product.name} />
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              {product.weight && (
                <p className="text-lg text-gray-600 mb-4">
                  Peso: {product.weight}
                </p>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(parseFloat(product.rating || "0"))
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.reviews || 0} avaliações)
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-green-600">
                    R$ {currentPrice}
                  </span>
                  {originalPrice && originalPrice !== currentPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      R$ {originalPrice}
                    </span>
                  )}
                  {product.discount && product.discount > 0 && (
                    <Badge className="bg-red-500">
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Seleção de Peso */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Escolha o peso:</h3>
              <RadioGroup
                value={selectedWeight}
                onValueChange={(value) => setSelectedWeight(value as "500g" | "1kg")}
                className="flex space-x-4"
              >
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
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantidade:</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Botão Adicionar ao Carrinho */}
            <Button
              onClick={() => addToCartMutation.mutate()}
              disabled={addToCartMutation.isPending}
              className="w-full py-3 text-lg font-semibold"
              style={{ backgroundColor: '#0F2E51' }}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {addToCartMutation.isPending
                ? "Adicionando..."
                : "Adicionar ao Carrinho"}
            </Button>

            {/* Descrição */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Descrição</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="mt-16">
          <ProductReviews productId={parseInt(params?.id || "0")} />
        </div>
      </div>
    </div>
  );
}